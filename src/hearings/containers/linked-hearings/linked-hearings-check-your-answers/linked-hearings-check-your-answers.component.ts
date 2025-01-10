import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { HttpError } from '../../../../models/httpError.model';
import { HearingLinksStateData } from '../../../models/hearingLinksStateData.model';
import { GroupLinkType, Mode } from '../../../models/hearings.enum';
import {
  HearingDetailModel,
  LinkedCaseHearingsResult,
  LinkedHearingGroupMainModel,
  LinkedHearingsDetailModel,
  ServiceLinkedCasesWithHearingsModel
} from '../../../models/linkHearings.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';

@Component({
  selector: 'exui-check-your-answers',
  templateUrl: './linked-hearings-check-your-answers.component.html',
  styleUrls: ['./linked-hearings-check-your-answers.component.scss']
})
export class LinkedHearingsCheckYourAnswersComponent implements OnInit, OnDestroy {
  private static readonly MANAGE_JOURNEY_FINAL_PAGE = 'check-your-answers';
  public isManageLink: boolean;
  public mode: Mode = Mode.LINK_HEARINGS;
  public caseId: string;
  public caseName: string;
  public hearingId: string;
  public hearingLinks: HearingLinksStateData;
  public hearingGroupRequestId: string;
  public showPositionColumn: boolean;
  public linkedCaseHearingsResults: LinkedCaseHearingsResult[] = [];
  public hearingsInGroup: LinkedHearingsDetailModel[];
  public linkedHearingGroup: LinkedHearingGroupMainModel;
  public cancelButtonText: string;
  public sub: Subscription;
  public serverErrors: { id: string, message: string }[] = [
    { id: 'serverError', message: 'There was a system error and your request could not be processed. Please try again.' }
  ];

  public error$: Observable<HttpError>;
  public isManageJourneyFinalPage: boolean;
  public showSpinner: boolean = true;
  public hearingStageOptions: LovRefDataModel[];

  constructor(private readonly hearingStore: Store<fromHearingStore.State>,
              private readonly hearingsService: HearingsService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.isManageLink = this.route.snapshot.data.mode === Mode.MANAGE_HEARINGS;
    this.isManageJourneyFinalPage = this.isManageLink &&
      this.route.snapshot.url &&
      this.route.snapshot.url.length > 0 &&
      this.route.snapshot.url[0].path === LinkedHearingsCheckYourAnswersComponent.MANAGE_JOURNEY_FINAL_PAGE;
    this.mode = this.route.snapshot.data.mode;
    this.caseId = this.route.snapshot.params.caseId;
    this.hearingGroupRequestId = this.route.snapshot.params.hearingGroupRequestId;
    this.hearingId = this.route.snapshot.params.hearingId;
    this.error$ = this.hearingStore.select(fromHearingStore.getHearingLinksLastError);
    this.hearingStageOptions = this.route.snapshot.data.hearingStageOptions;
  }

  public ngOnInit(): void {
    this.sub = this.hearingStore.pipe(select(fromHearingStore.getHearingsFeatureState)).subscribe({
      next: (state: fromHearingStore.State) => {
        this.caseName = state.hearingValues.serviceHearingValuesModel ? state.hearingValues.serviceHearingValuesModel.hmctsInternalCaseName : '';
        this.hearingLinks = state.hearingLinks;
        if (this.hearingLinks.serviceLinkedCasesWithHearings && this.hearingLinks.serviceLinkedCasesWithHearings.length) {
          if (this.isManageLink) {
            this.presetHearingLinkedGroup(this.hearingLinks);
          } else {
            this.setHearingLinkedGroup(this.hearingLinks);
          }
        }
        this.showSpinner = false;
      },
      error: () => {
        this.showSpinner = false;
      }
    });
  }

  public setHearingLinkedGroup(hearingLinksStateData: HearingLinksStateData) {
    if (hearingLinksStateData && hearingLinksStateData.linkedHearingGroup) {
      this.linkedHearingGroup = hearingLinksStateData.linkedHearingGroup;
      this.hearingsInGroup = hearingLinksStateData.linkedHearingGroup.hearingsInGroup;
      this.showPositionColumn = this.canDisplayPositionColumn();
      hearingLinksStateData.serviceLinkedCasesWithHearings.forEach((linkedCaseWithHearings) => {
        const selectedHearings = linkedCaseWithHearings.caseHearings && linkedCaseWithHearings.caseHearings.filter((hearing) => hearing.isSelected);
        this.setDisplayRow(linkedCaseWithHearings, selectedHearings);
      });
      this.sortDisplayRecords();
    }
    this.setCancelButtonText();
  }

  public presetHearingLinkedGroup(hearingLinksStateData: HearingLinksStateData): void {
    if (hearingLinksStateData && hearingLinksStateData.linkedHearingGroup) {
      this.linkedHearingGroup = hearingLinksStateData.linkedHearingGroup;
      this.hearingsInGroup = hearingLinksStateData.linkedHearingGroup.hearingsInGroup;
      this.showPositionColumn = this.canDisplayPositionColumn();
      // @ts-ignore
      const allHearings: HearingDetailModel[] = hearingLinksStateData.serviceLinkedCasesWithHearings.flatMap((x) => x.caseHearings);
      this.hearingsInGroup.forEach((hearing) => {
        const foundHearing = allHearings.find((aHearing) => aHearing.hearingID === hearing.hearingId);
        const foundCase = hearingLinksStateData.serviceLinkedCasesWithHearings.find((linkedCase) => linkedCase.caseHearings.some((aHaring) => aHaring.hearingID === hearing.hearingId));
        let linkedCaseHearingsResult: LinkedCaseHearingsResult = null;
        if (foundCase && foundHearing) {
          linkedCaseHearingsResult = {
            caseRef: foundCase.caseRef,
            caseName: foundCase.caseName,
            hearingID: hearing.hearingId,
            hearingType: foundHearing.hearingType,
            position: hearing.hearingOrder
          };
        }
        if (!this.linkedCaseHearingsResults.some((result) => result.hearingID === hearing.hearingId) && linkedCaseHearingsResult) {
          this.linkedCaseHearingsResults.push(linkedCaseHearingsResult);
        }
      });
      this.sortDisplayRecords();
    }
    this.setCancelButtonText();
  }

  public setCancelButtonText(): void {
    if (this.isManageLink) {
      this.cancelButtonText = !this.isManageJourneyFinalPage && this.linkedCaseHearingsResults.length > 0 ? 'Return to hearings' : 'Cancel';
    } else {
      this.cancelButtonText = 'Cancel';
    }
  }

  public setDisplayRow(linkedCase: ServiceLinkedCasesWithHearingsModel, selectedHearings: HearingDetailModel[]): void {
    if (selectedHearings && selectedHearings.length > 0) {
      selectedHearings.forEach((hearingDetailModel) => {
        if (!this.linkedCaseHearingsResults.some((result) => result.hearingID === hearingDetailModel.hearingID)) {
          this.linkedCaseHearingsResults.push({
            caseName: linkedCase.caseName,
            caseRef: linkedCase.caseRef,
            hearingID: hearingDetailModel.hearingID,
            hearingType: hearingDetailModel.hearingType,
            position: this.getPosition(hearingDetailModel)
          });
        }
      });
    }
  }

  public sortDisplayRecords(): void {
    if (this.showPositionColumn) {
      this.linkedCaseHearingsResults.sort((a, b) => a.position - b.position);
    }
  }

  public getPosition(hearing: HearingDetailModel): number {
    if (this.showPositionColumn) {
      const linkedHearings: LinkedHearingsDetailModel[] = this.hearingsInGroup.filter((x) => x.hearingId === hearing.hearingID);
      if (linkedHearings && linkedHearings.length > 0) {
        return linkedHearings[0].hearingOrder;
      }
    }
    return null;
  }

  public canDisplayPositionColumn(): boolean {
    return this.linkedHearingGroup
      && this.linkedHearingGroup.groupDetails
      && this.linkedHearingGroup.groupDetails.groupLinkType === GroupLinkType.ORDERED;
  }

  public onLinkHearings(): void {
    this.hearingStore.dispatch(new fromHearingStore.SubmitLinkedHearingGroup({
      linkedHearingGroup: this.linkedHearingGroup,
      caseId: this.caseId,
      hearingGroupRequestId: this.hearingGroupRequestId,
      hearingId: this.hearingId,
      isManageLink: this.isManageLink
    }));
  }

  public onManageLinkHearings(): void {
    this.hearingStore.dispatch(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup: this.linkedHearingGroup,
      caseId: this.caseId,
      hearingGroupRequestId: this.hearingGroupRequestId,
      hearingId: this.hearingId
    }));
  }

  public onEdit(): void {
    this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'selected-hearings']);
  }

  public onUnlinkHearings(): void {
    this.hearingStore.dispatch(new fromHearingStore.ManageLinkedHearingGroup({
      linkedHearingGroup: null,
      caseId: this.caseId,
      hearingGroupRequestId: this.hearingGroupRequestId,
      hearingId: this.hearingId
    }));
  }

  public onChange(): void {
    this.hearingStore.dispatch(new fromHearingStore.ResetLinkedHearingLastError());
    this.router.navigate(['/', 'hearings', 'link', this.caseId, this.hearingId]);
  }

  public onBack(): void {
    if (this.isManageJourneyFinalPage) {
      this.router.navigate(['/', 'hearings', 'manage-links', this.caseId, this.hearingGroupRequestId, this.hearingId, 'group-selection']);
    } else if (this.isManageLink) {
      this.router.navigate(['/', 'cases', 'case-details', this.caseId, 'hearings']);
    } else {
      this.hearingStore.dispatch(new fromHearingStore.ResetLinkedHearingLastError());
      this.router.navigate(['/', 'hearings', 'link', this.caseId, this.hearingId, 'group-selection']);
    }
  }

  public onCancel(): void {
    this.router.navigate(['/', 'cases', 'case-details', this.caseId, 'hearings']);
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
