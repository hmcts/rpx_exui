import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { CaseRole } from '../../../role-access/models/case-role.interface';
import { AllocateRoleService } from '../../../role-access/services/allocate-role.service';
import { Caseworker } from '../../../work-allocation/models/dtos';
import { CaseworkerDataService } from '../../../work-allocation/services/caseworker-data.service';
import { WASupportedJurisdictionsService } from '../../../work-allocation/services/wa-supported-jurisdiction.service';
import { RestrictedCase } from '../../models/restricted-case.model';

@Component({
  selector: 'exui-restricted-case-access-container',
  templateUrl: './restricted-case-access-container.component.html'
})
export class RestrictedCaseAccessContainerComponent implements OnInit, OnDestroy {
  public caseId: string;
  public caseRoles: CaseRole[];
  public caseWorkers: Caseworker[];
  public idamIds: string[];
  public restrictedCases: RestrictedCase[];
  public allocateServiceSubscription: Subscription;
  public showSpinner$: Observable<boolean>;

  constructor(private readonly route: ActivatedRoute,
              private readonly allocateService: AllocateRoleService,
              private readonly caseworkerDataService: CaseworkerDataService,
              private readonly waSupportedJurisdictionsService: WASupportedJurisdictionsService,
              private readonly loadingService: LoadingService) {
  }

  public ngOnInit(): void {
    this.showSpinner$ = this.loadingService.isLoading as any;
    const loadingToken = this.loadingService.register();
    this.caseId = this.route.snapshot.params.cid;
    this.allocateServiceSubscription = this.allocateService.getCaseAccessRolesByCaseId(this.caseId).pipe(
      switchMap((caseRoles) => {
        this.caseRoles = caseRoles;
        return of(this.getUniqueIdamIds());
      }), take(1),
      switchMap(() => this.waSupportedJurisdictionsService.getWASupportedJurisdictions()),
      take(1),
      switchMap((jurisdictions) => this.caseworkerDataService.getUsersFromServices(jurisdictions)),
      take(1),
      switchMap((caseworkers) => of(this.getRestrictedCases(caseworkers)))
    ).subscribe(
      (restrictedCases) => {
        this.restrictedCases = restrictedCases;
        this.loadingService.unregister(loadingToken);
      }, () => {
        this.loadingService.unregister(loadingToken);
      }
    );
  }

  public ngOnDestroy(): void {
    this.allocateServiceSubscription?.unsubscribe();
  }

  private getUniqueIdamIds(): string[] {
    const idamIds = this.caseRoles.map((role) => role.actorId);
    this.idamIds = idamIds.filter((value, index) => idamIds.indexOf(value) === index);
    return this.idamIds;
  }

  private getRestrictedCases(caseworkers: Caseworker[]): RestrictedCase[] {
    const restrictedCases: RestrictedCase[] = [];
    this.idamIds.forEach((id) => {
      const user = caseworkers.find((caseworker) => caseworker.idamId === id);
      const caseRole = this.caseRoles.find((role) => role.actorId === id);
      if (user && caseRole) {
        restrictedCases.push({
          user: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: caseRole.roleName
        });
      }
    });
    return restrictedCases;
  }
}
