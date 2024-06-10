import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RoleCategory } from 'api/roleAccess/models/allocate-role.enum';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';

import { Caseworker } from '../../../work-allocation/interfaces/common';
import { CaseworkerDataService } from '../../../work-allocation/services';
import { Answer, ExclusionNavigationEvent, RoleExclusion } from '../../models';
import { AnswerHeaderText, AnswerLabelText, ExclusionMessageText } from '../../models/enums';
import { AllocateRoleService, RoleExclusionsService } from '../../services';
import { handleError } from '../../utils';

@Component({
  selector: 'exui-delete-exclusion',
  templateUrl: './delete-exclusion.component.html'
})
export class DeleteExclusionComponent implements OnInit {
  public caseworkers$: Observable<Caseworker[]>;
  public exclusionNavigationEvent = ExclusionNavigationEvent;
  public answers: Answer[] = [];
  public caption = AnswerHeaderText.DeleteExclusion;
  public heading = AnswerHeaderText.CheckAnswers;
  public hint = AnswerHeaderText.CheckInformation;
  public exclusionId: string;
  public caseId: string;
  public jurisdiction: string;
  public roleExclusion: RoleExclusion;

  public showSpinner: boolean;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly roleExclusionsService: RoleExclusionsService,
              private readonly allocateService: AllocateRoleService,
              private readonly caseworkerDataService: CaseworkerDataService) {}

  public ngOnInit(): void {
    const paramMap$ = this.route.queryParamMap;
    paramMap$.pipe(mergeMap((queryMap) => {
      return this.getExclusionFromQuery(queryMap);
    })).subscribe((exclusions) => {
      this.findAndSetExclusion(exclusions);
    });
  }

  public findAndSetExclusion(exclusions: RoleExclusion[]): void {
    this.roleExclusion = exclusions.find((excl) => excl.id === this.exclusionId);
    if (this.roleExclusion.userType.toUpperCase() === RoleCategory.JUDICIAL) {
      this.allocateService.getCaseRolesUserDetails([this.roleExclusion.actorId], [this.jurisdiction]).subscribe((userDetails) => {
        if (userDetails[0]) {
          this.roleExclusion.name = userDetails[0].known_as;
          this.populateAnswers(this.roleExclusion);
        }
      });
    } else {
      this.populateAnswers(this.roleExclusion);
      this.getNamesIfNeeded();
    }
  }

  public getExclusionFromQuery(queryMap: ParamMap) {
    this.exclusionId = queryMap.get('exclusionId');
    this.caseId = queryMap.get('caseId');
    this.jurisdiction = queryMap.get('jurisdiction');
    const caseType = queryMap.get('caseType');
    return this.roleExclusionsService.getCurrentUserRoleExclusions(this.caseId, this.jurisdiction, caseType, this.exclusionId);
  }

  public populateAnswers(exclusion: RoleExclusion): void {
    const person = exclusion.name ? exclusion.name : 'Awaiting person details';
    this.answers.push({ label: AnswerLabelText.Person, value: person });
    this.answers.push({ label: AnswerLabelText.DescribeExclusion, value: exclusion.notes ? exclusion.notes : '' });
    this.answers.push({ label: AnswerLabelText.DateAdded, value: moment.parseZone(new Date(exclusion.added)).format('D MMMM YYYY') });
  }

  private getNamesIfNeeded(): void {
    if (!this.roleExclusion.name) {
      this.caseworkerDataService.getUsersFromServices([this.jurisdiction]).pipe(first()).subscribe((caseworkers) => {
        const caseworker = caseworkers.find((givenCaseworker) => givenCaseworker.idamId === this.roleExclusion.actorId);
        this.roleExclusion.name = `${caseworker.firstName}-${caseworker.lastName}`;
        this.answers = [];
        this.populateAnswers(this.roleExclusion);
      });
    }
  }

  public onNavEvent(navEvent: ExclusionNavigationEvent): void {
    const goToCaseUrl = `cases/case-details/${this.caseId}/roles-and-access`;
    switch (navEvent) {
      case ExclusionNavigationEvent.DELETE_EXCLUSION: {
        this.showSpinner = true;
        this.roleExclusionsService.deleteExclusion(this.roleExclusion).subscribe(() => {
          // navigates to case details page for specific case id
          this.router.navigate([goToCaseUrl], {
            state: {
              showMessage: true,
              messageText: ExclusionMessageText.Delete }
          });
        }, (error) => {
          return handleError(error, this.router, goToCaseUrl);
        });
        break;
      }
      case ExclusionNavigationEvent.CANCEL: {
        this.router.navigateByUrl(goToCaseUrl);
        return;
      }
      default: {
        this.showSpinner = false;
        throw new Error('Invalid option');
      }
    }
  }
}
