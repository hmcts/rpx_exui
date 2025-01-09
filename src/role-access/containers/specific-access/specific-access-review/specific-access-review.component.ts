import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { $enum as EnumUtil } from 'ts-enum-util';
import { UserDetails } from '../../../../app/models';
import { CaseworkerDataService, WASupportedJurisdictionsService } from '../../../../work-allocation/services';
import { ERROR_MESSAGE } from '../../../constants';
import { DisplayedAccessReason, OptionsModel, RequestAccessDetails, RoleCategory, SpecificAccessNavigationEvent, SpecificAccessState, SpecificAccessStateData } from '../../../models';
import { AccessReason, SpecificAccessErrors, SpecificAccessText } from '../../../models/enums';
import { SpecificAccessNavigation } from '../../../models/specific-access-navigation.interface';
import { AllocateRoleService } from '../../../services';
import * as fromFeature from '../../../store';

@Component({
  selector: 'exui-specific-access-review',
  templateUrl: './specific-access-review.component.html'
})
export class SpecificAccessReviewComponent implements OnInit, OnDestroy {
  public ERROR_MESSAGE = ERROR_MESSAGE;
  @Input() public navEvent: SpecificAccessNavigation;
  public title = SpecificAccessText.TITLE;
  public hint = SpecificAccessText.HINT;
  public caseRefLabel = SpecificAccessText.CASE_REF;
  public requestAccessDetails: RequestAccessDetails;
  public userDetails$: Observable<UserDetails>;
  public errorMessage = {
    title: 'There is a problem',
    description: SpecificAccessErrors.NO_SELECTION
  };

  public optionsList: OptionsModel[];

  public submitted: boolean = false;

  public requesterName: string;

  public formGroup: FormGroup;
  public initialAccessReason: AccessReason;
  public reviewOptionControl: FormControl;

  public specificAccessStateDataSub: Subscription;
  public specificAccessStateData: SpecificAccessStateData;

  public readonly accessReasons: DisplayedAccessReason[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromFeature.State>,
    private readonly allocateRoleService: AllocateRoleService,
    private readonly caseworkerDataService: CaseworkerDataService,
    private readonly waSupportedJurisdictionsService: WASupportedJurisdictionsService
  ) {
    this.accessReasons = [
      { reason: AccessReason.APPROVE_REQUEST, checked: false },
      { reason: AccessReason.REJECT_REQUEST, checked: false },
      { reason: AccessReason.REQUEST_MORE_INFORMATION, checked: false }
    ];
  }

  public ngOnInit(): void {
    this.specificAccessStateDataSub = this.store.pipe(select(fromFeature.getSpecificAccessState)).subscribe(
      (specificAccessStateData) => {
        this.specificAccessStateData = specificAccessStateData;
      }
    );
    if (this.specificAccessStateData.roleCategory === RoleCategory.JUDICIAL) {
      this.allocateRoleService.getCaseRolesUserDetails([this.specificAccessStateData.actorId], [this.specificAccessStateData.jurisdiction]).subscribe(
        (caseRoleUserDetails) => {
          this.requesterName = caseRoleUserDetails[0].full_name;
        }
      );
    } else {
      this.waSupportedJurisdictionsService.getWASupportedJurisdictions().subscribe((services) => {
        this.caseworkerDataService.getUsersFromServices(services).subscribe(
          (caseworkers) => {
            const caseworker = caseworkers.find((thisCaseworker) => thisCaseworker.idamId === this.specificAccessStateData.actorId);
            if (caseworker) {
              this.requesterName = `${caseworker.firstName} ${caseworker.lastName}`;
            }
          });
      });
    }
    this.reviewOptionControl = new FormControl(this.initialAccessReason ? this.initialAccessReason : '', [Validators.required]);
    this.formGroup = this.fb.group({
      radioSelected: this.reviewOptionControl
    });
    this.optionsList = [
      {
        optionId: EnumUtil(AccessReason).getKeyOrDefault(AccessReason.APPROVE_REQUEST),
        optionValue: AccessReason.APPROVE_REQUEST
      },
      {
        optionId: EnumUtil(AccessReason).getKeyOrDefault(AccessReason.REJECT_REQUEST),
        optionValue: AccessReason.REJECT_REQUEST
      },
      {
        optionId: EnumUtil(AccessReason).getKeyOrDefault(AccessReason.REQUEST_MORE_INFORMATION),
        optionValue: AccessReason.REQUEST_MORE_INFORMATION
      }
    ];
  }

  public onChange(): void {
    this.submitted = false;
  }

  public navigationHandler(navEvent: SpecificAccessNavigationEvent) {
    this.submitted = true;
    if (this.reviewOptionControl.invalid) {
      this.reviewOptionControl.setErrors({
        invalid: true
      });
      return;
    }
    this.dispatchEvent(navEvent);
  }

  public dispatchEvent(navEvent: SpecificAccessNavigationEvent) {
    switch (navEvent) {
      case SpecificAccessNavigationEvent.CONTINUE:
        let specificAccessState: SpecificAccessState;
        const accessReason = this.reviewOptionControl.value;
        switch (accessReason) {
          case AccessReason.APPROVE_REQUEST:
            specificAccessState = SpecificAccessState.SPECIFIC_ACCESS_DURATION;
            break;
          case AccessReason.REJECT_REQUEST:
            const rejectedRole = { id: 'specific-access-denied', name: 'specific-access-denied' };
            let specificAccessBody;
            this.store.pipe(select(fromFeature.getSpecificAccessState)).pipe(take(1)).subscribe((specificAccess) => {
              if (specificAccess) {
                specificAccessBody = {
                  accessReason,
                  specificAccessReason: specificAccess.specificAccessReason,
                  typeOfRole: rejectedRole,
                  caseId: specificAccess.caseId,
                  requestId: specificAccess.requestId,
                  taskId: specificAccess.taskId,
                  jurisdiction: specificAccess.jurisdiction,
                  assigneeId: specificAccess.actorId,
                  caseName: specificAccess.caseName,
                  requestCreated: specificAccess.requestCreated,
                  roleCategory: specificAccess.roleCategory,
                  person: { id: specificAccess.actorId, name: null, domain: null }
                };
              }
            });
            this.store.dispatch(new fromFeature.RequestMoreInfoSpecificAccessRequest(specificAccessBody));
            break;
          case AccessReason.REQUEST_MORE_INFORMATION:
            specificAccessState = SpecificAccessState.SPECIFIC_ACCESS_INFORMATION;
            break;
          default:
            throw new Error('Invalid option');
        }
        this.store.dispatch(new fromFeature.DecideSpecificAccessAndGo({
          accessReason,
          specificAccessState
        }));
        break;
      default:
        throw new Error('Invalid option');
    }
  }

  public ngOnDestroy(): void {
    if (this.specificAccessStateDataSub) {
      this.specificAccessStateDataSub.unsubscribe();
    }
  }
}
