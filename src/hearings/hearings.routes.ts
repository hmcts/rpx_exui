import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './components';
import { CancelHearingComponent } from './containers/cancel-hearing/cancel-hearing.component';
import { HearingActualsAddEditSummaryComponent } from './containers/hearing-actuals/hearing-actuals-add-edit-summary/hearing-actuals-add-edit-summary.component';
import { HearingActualsEditSummaryComponent } from './containers/hearing-actuals/hearing-actuals-edit-summary/hearing-actuals-edit-summary.component';
import { HearingActualsFinalConfirmationComponent } from './containers/hearing-actuals/hearing-actuals-final-confirmation/hearing-actuals-final-confirmation.component';
import { HearingActualsTimingComponent } from './containers/hearing-actuals/hearing-actuals-timing/hearing-actuals-timing.component';
import { HearingActualsViewEditPartiesComponent } from './containers/hearing-actuals/hearing-actuals-view-edit-parties/hearing-actuals-view-edit-parties.component';
import { HearingActualsComponent } from './containers/hearing-actuals/hearing-actuals.component';
import { HearingStageResultComponent } from './containers/hearing-actuals/hearing-stage-result/hearing-stage-result.component';
import { LinkedHearingsCheckYourAnswersComponent } from './containers/linked-hearings/linked-hearings-check-your-answers/linked-hearings-check-your-answers.component';
import { LinkedHearingsFinalConfirmationComponent } from './containers/linked-hearings/linked-hearings-final-confirmation/linked-hearings-final-confirmation.component';
import { HowLinkedHearingsBeHeardComponent } from './containers/linked-hearings/linked-hearings-how-to-heard/linked-hearings-how-to-heard.component';
import { LinkedHearingsWithCaseComponent } from './containers/linked-hearings/linked-hearings-with-case/linked-hearings-with-case.component';
import { LinkedHearingsComponent } from './containers/linked-hearings/linked-hearings.component';
import { HearingAdditionalInstructionsComponent } from './containers/request-hearing/hearing-additional-instructions/hearing-additional-instructions.component';
import { HearingAttendanceComponent } from './containers/request-hearing/hearing-attendance/hearing-attendance.component';
import { HearingChangeReasonsComponent } from './containers/request-hearing/hearing-change-reasons/hearing-change-reasons.component';
import { HearingCreateEditSummaryComponent } from './containers/request-hearing/hearing-create-edit-summary/hearing-create-edit-summary.component';
import { HearingEditSummaryComponent } from './containers/request-hearing/hearing-edit-summary/hearing-edit-summary.component';
import { HearingFacilitiesComponent } from './containers/request-hearing/hearing-facilities/hearing-facilities.component';
import { HearingFinalConfirmationComponent } from './containers/request-hearing/hearing-final-confirmation/hearing-final-confirmation.component';
import { HearingJudgeComponent } from './containers/request-hearing/hearing-judge/hearing-judge.component';
import { HearingLinkComponent } from './containers/request-hearing/hearing-link/hearing-link.component';
import { HearingPanelComponent } from './containers/request-hearing/hearing-panel/hearing-panel.component';
import { HearingRequirementsComponent } from './containers/request-hearing/hearing-requirements/hearing-requirements.component';
import { HearingStageComponent } from './containers/request-hearing/hearing-stage/hearing-stage.component';
import { HearingTimingComponent } from './containers/request-hearing/hearing-timing/hearing-timing.component';
import { HearingVenueComponent } from './containers/request-hearing/hearing-venue/hearing-venue.component';
import { HearingViewEditSummaryComponent } from './containers/request-hearing/hearing-view-edit-summary/hearing-view-edit-summary.component';
import { HearingWelshComponent } from './containers/request-hearing/hearing-welsh/hearing-welsh.component';
import { HearingPanelRequiredComponent } from './containers/request-hearing/hearing-panel-required/hearing-panel-required.component';
import { HearingPanelSelectorComponent } from './containers/request-hearing/hearing-panel-selector/hearing-panel-selector.component';
import { RequestHearingComponent } from './containers/request-hearing/request-hearing.component';
import { HearingAdjournedSummaryComponent } from './containers/view-hearing/hearing-adjourned-summary/hearing-adjourned-summary.component';
import { HearingCancellationSummaryComponent } from './containers/view-hearing/hearing-cancellation-summary/hearing-cancellation-summary.component';
import { HearingCancelledSummaryComponent } from './containers/view-hearing/hearing-cancelled-summary/hearing-cancelled-summary.component';
import { HearingCompletedSummaryComponent } from './containers/view-hearing/hearing-completed-summary/hearing-completed-summary.component';
import { HearingRequestFailedSummaryComponent } from './containers/view-hearing/hearing-request-failed-summary/hearing-request-failed-summary.component';
import { HearingViewActualSummaryComponent } from './containers/view-hearing/hearing-view-actual-summary/hearing-view-actual-summary.component';
import { HearingViewSummaryComponent } from './containers/request-hearing/hearing-view-summary/hearing-view-summary.component';
import { ViewHearingComponent } from './containers/view-hearing/view-hearing.component';
import { HearingAmendmentsGuard } from './guards/hearing-amendments-guard';
import { HearingsEditGuard } from './guards/hearings-edit-guard';
import { HearingsViewGuard } from './guards/hearings-view-guard';
import { HearingCategory, MemberType, Mode } from './models/hearings.enum';
import { ActualSummaryResponseResolver } from './resolvers/actual-summary-response-resolver.resolve';
import { AdditionalFacilitiesResolver } from './resolvers/additional-facilities.resolver';
import { AdjournHearingActualReasonResolver } from './resolvers/adjourn-hearing-actual-reason.resolver';
import { CancelHearingActualReasonResolver } from './resolvers/cancel-hearing-actual-reason.resolver';
import { CancelHearingRequestReasonResolver } from './resolvers/cancel-hearing-request-reason.resolver';
import { CaseFlagsResolver } from './resolvers/case-flags.resolver';
import { CaseTypesResolver } from './resolvers/case-types.resolver';
import { CourtLocationsDataResolver } from './resolvers/court-locations-resolver.resolve';
import { HearingActualPartyChannelResolverService } from './resolvers/hearing-actual-party-channel-resolver.service';
import { HearingActualPartySubChannelResolverService } from './resolvers/hearing-actual-party-subchannel-resolver.service';
import { HearingActualRoleResolverService } from './resolvers/hearing-actual-role-resolver.service';
import { HearingChangeReasonResolver } from './resolvers/hearing-change-reason.resolver';
import { HearingStageResolver } from './resolvers/hearing-stage.resolver';
import { JudgeTypesResolverService } from './resolvers/judge-types-resolver.service';
import { JudicialUserSearchResolver } from './resolvers/judicial-user-search-resolver.resolve';
import { JudicialUserSearchResponseResolver } from './resolvers/judicial-user-search-response-resolver.resolve';
import { PanelMemberSearchResponseResolver } from './resolvers/panel-member-search-response-resolver';
import { PanelRolesResolverService } from './resolvers/panel-roles-resolver.service';
import { PartyChannelsResolverService } from './resolvers/party-channels-resolver.service';
import { PartySubChannelsResolverService } from './resolvers/party-subchannels-resolver.service';
import { RefDataResolver } from './resolvers/ref-data-resolver.resolve';

export const ROUTES: Routes = [
  {
    path: 'cancel/:hearingId',
    resolve: { hearingCancelOptions: RefDataResolver },
    component: CancelHearingComponent,
    canActivate: [HearingsEditGuard],
    data: {
      category: HearingCategory.CancelHearingReason
    },
    children: [
      {
        path: '',
        component: null,
        data: {
          title: 'HMCTS Hearings | Cancel Hearing'
        }
      }
    ]
  },
  {
    path: 'link/:caseId/:hearingId',
    resolve: {
      hearingStageOptions: HearingStageResolver
    },
    component: LinkedHearingsComponent,
    canActivate: [HearingsEditGuard],
    children: [
      {
        path: '',
        component: LinkedHearingsWithCaseComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Cases'
        }
      },
      {
        path: 'group-selection',
        component: HowLinkedHearingsBeHeardComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Group Selection'
        }
      },
      {
        path: 'check-your-answers',
        component: LinkedHearingsCheckYourAnswersComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Check your answers'
        }
      },
      {
        path: 'final-confirmation',
        component: LinkedHearingsFinalConfirmationComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Final confirmation'
        }
      }
    ]
  },
  {
    path: 'manage-links/:caseId/:hearingGroupRequestId/:hearingId',
    resolve: {
      hearingStageOptions: HearingStageResolver
    },
    component: LinkedHearingsComponent,
    data: {
      mode: Mode.MANAGE_HEARINGS
    },
    children: [
      {
        path: '',
        component: LinkedHearingsCheckYourAnswersComponent,
        canActivate: [HearingsEditGuard],
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Selected Hearings'
        }
      },
      {
        path: 'selected-hearings',
        component: LinkedHearingsWithCaseComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Cases'
        }
      },
      {
        path: 'group-selection',
        component: HowLinkedHearingsBeHeardComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Group Selection',
          mode: Mode.MANAGE_HEARINGS
        }
      },
      {
        path: 'check-your-answers',
        component: LinkedHearingsCheckYourAnswersComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Check your answers'
        }
      },
      {
        path: 'final-confirmation',
        component: LinkedHearingsFinalConfirmationComponent,
        data: {
          title: 'HMCTS Hearings | Linked Hearings | Final confirmation'
        }
      }
    ]
  },
  {
    path: 'actuals/:id',
    component: HearingActualsComponent,
    canActivate: [HearingsEditGuard],
    resolve: {
      partyChannels: HearingActualPartyChannelResolverService,
      partySubChannels: HearingActualPartySubChannelResolverService,
      hearingRole: HearingActualRoleResolverService
    },
    data: {
      isChildRequired: [HearingCategory.HearingChannel]
    },
    children: [
      {
        path: 'hearing-actual-add-edit-summary',
        resolve: {
          hearingTypes: RefDataResolver,
          actualPartHeardReasonCodes: AdjournHearingActualReasonResolver,
          cancelHearingActualReasons: CancelHearingActualReasonResolver
        },
        component: HearingActualsAddEditSummaryComponent,
        data: {
          category: HearingCategory.HearingType,
          title: 'HMCTS Hearings | Hearing Actuals | Check details'
        }
      },
      {
        path: 'hearing-actual-edit-summary',
        resolve: {
          hearingTypes: RefDataResolver,
          actualPartHeardReasonCodes: AdjournHearingActualReasonResolver,
          cancelHearingActualReasons: CancelHearingActualReasonResolver,
          caseType: CaseTypesResolver
        },
        component: HearingActualsEditSummaryComponent,
        data: {
          category: HearingCategory.HearingType,
          title: 'HMCTS Hearings | Hearing Actuals | Check your answers'
        }
      },
      {
        path: 'hearing-timing/:hearingDate',
        component: HearingActualsTimingComponent,
        data: {
          title: 'HMCTS Hearings | Hearing Actuals | Hearing Timing'
        }
      },
      {
        path: 'hearing-stage-result',
        resolve: {
          hearingTypes: RefDataResolver,
          actualPartHeardReasonCodes: AdjournHearingActualReasonResolver,
          actualCancellationReasonCodes: CancelHearingActualReasonResolver
        },
        component: HearingStageResultComponent,
        data: {
          category: HearingCategory.HearingType,
          title: 'HMCTS Hearings | Hearing Actuals | Hearing Stage Result'
        }
      },
      {
        path: 'hearing-actuals-confirmation',
        component: HearingActualsFinalConfirmationComponent,
        data: {
          title: 'HMCTS Hearings | Hearing Actuals | Confirmation'
        }
      },
      {
        path: 'actuals-parties/:hearingDate',
        component: HearingActualsViewEditPartiesComponent,
        data: {
          title: 'HMCTS Manage cases | Hearing Actuals | Update Participants'
        }
      }
    ]
  },
  {
    path: 'request',
    component: RequestHearingComponent,
    canActivate: [HearingsEditGuard],
    children: [
      {
        path: '',
        redirectTo: 'hearing-requirements',
        data: {
          title: 'HMCTS Hearings | Request Hearing'
        }
      },
      {
        path: 'hearing-requirements',
        resolve: {
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver
        },
        component: HearingRequirementsComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Hearing Requirement',
          isChildRequired: [HearingCategory.CaseType]
        }
      },
      {
        path: 'hearing-facilities',
        resolve: {
          caseFlags: CaseFlagsResolver,
          additionFacilitiesOptions: RefDataResolver
        },
        component: HearingFacilitiesComponent,
        data: {
          category: HearingCategory.Facilities,
          title: 'HMCTS Hearings | Request Hearing | Additional Facilities'
        }
      },
      {
        path: 'hearing-stage',
        resolve: { hearingStages: RefDataResolver },
        component: HearingStageComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Hearing Stage',
          category: HearingCategory.HearingType
        }
      },
      {
        path: 'hearing-attendance',
        component: HearingAttendanceComponent,
        resolve: {
          hearingChannels: RefDataResolver
        },
        data: {
          title: 'HMCTS Hearings | Request Hearing | How Party Attend',
          category: HearingCategory.HearingChannel
        }
      },
      {
        path: 'hearing-venue',
        component: HearingVenueComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Location Search'
        }
      },
      {
        path: 'hearing-welsh',
        component: HearingWelshComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Welsh Hearing'
        }
      },
      {
        path: 'hearing-panel-required',
        component: HearingPanelRequiredComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Panel Required'
        }
      },
      {
        path: 'hearing-judge',
        resolve: {
          hearingStages: RefDataResolver,
          judicialUsers: JudicialUserSearchResolver
        },
        component: HearingJudgeComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Specify Judge',
          category: HearingCategory.JudgeType,
          memberType: MemberType.JUDGE
        }
      },
      {
        path: 'hearing-panel-selector',
        resolve: {
          otherPanelRoles: RefDataResolver,
          judicialUsers: JudicialUserSearchResolver
        },
        component: HearingPanelSelectorComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Require Panel Or Not',
          category: HearingCategory.PanelMemberType,
          memberType: MemberType.PANEL_MEMBER,
          isChildRequired: [HearingCategory.PanelMemberType]
        }
      },
      {
        path: 'hearing-panel',
        resolve: {
          otherPanelRoles: RefDataResolver,
          judicialUsers: JudicialUserSearchResolver
        },
        component: HearingPanelComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Require Panel Or Not',
          category: HearingCategory.PanelMemberType,
          memberType: MemberType.PANEL_MEMBER,
          isChildRequired: [HearingCategory.PanelMemberType]
        }
      },
      {
        path: 'hearing-timing',
        resolve: { hearingPriorities: RefDataResolver },
        component: HearingTimingComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Hearing Timing',
          category: HearingCategory.HearingPriority
        }
      },
      {
        path: 'hearing-link',
        component: HearingLinkComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Hearing Link'
        }
      },
      {
        path: 'hearing-additional-instructions',
        component: HearingAdditionalInstructionsComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Additional Instruction'
        }
      },
      {
        path: 'hearing-create-edit-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          otherPanelRoles: PanelRolesResolverService
        },
        component: HearingCreateEditSummaryComponent,
        data: {
          title: 'HMCTS Hearings | Request Hearing | Check Answers',
          isChildRequired: [HearingCategory.PanelMemberType, HearingCategory.CaseType]
        }
      },
      {
        path: 'hearing-view-edit-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver
        },
        component: HearingViewEditSummaryComponent,
        data: {
          title: 'HMCTS Hearings | Amend Hearing | Check Answers',
          isChildRequired: [HearingCategory.PanelMemberType, HearingCategory.CaseType]
        }
      },
      {
        path: 'hearing-view-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver
        },
        component: HearingViewSummaryComponent,
        data: {
          title: 'HMCTS Hearings | View Hearing | Summary',
          isChildRequired: [HearingCategory.PanelMemberType, HearingCategory.CaseType]
        }
      },
      {
        path: 'hearing-edit-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver
        },
        component: HearingEditSummaryComponent,
        canActivate: [HearingsEditGuard, HearingAmendmentsGuard],
        data: {
          title: 'HMCTS Hearings | Amend Hearing',
          isChildRequired: [HearingCategory.PanelMemberType, HearingCategory.CaseType]
        }
      },
      {
        path: 'hearing-change-reason',
        resolve: {
          hearingTypes: RefDataResolver,
          hearingChangeReasons: HearingChangeReasonResolver
        },
        component: HearingChangeReasonsComponent,
        data: {
          title: 'HMCTS Hearings | Amend Hearing | Change reason'
        }
      },
      {
        path: 'hearing-confirmation',
        component: HearingFinalConfirmationComponent,
        data: {
          title: 'HMCTS Hearings | Request Amend Hearing | Confirmation'
        }
      }
    ]
  },
  {
    path: 'view',
    component: ViewHearingComponent,
    canActivate: [HearingsViewGuard],
    children: [
      {
        path: '',
        component: null,
        data: {
          title: 'HMCTS Hearings | View Hearing'
        }
      },
      {
        path: 'hearing-cancellation-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver,
          cancelHearingReasons: CancelHearingRequestReasonResolver
        },
        component: HearingCancellationSummaryComponent,
        data: {
          title: 'HMCTS Hearings | View Hearing | Cancellation summary'
        }
      },
      {
        path: 'hearing-cancelled-summary/:id',
        resolve: {
          actualSummary: ActualSummaryResponseResolver,
          cancelHearingReasons: CancelHearingRequestReasonResolver,
          cancelHearingActualReasons: CancelHearingActualReasonResolver,
          hearingPriorities: RefDataResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver
        },
        component: HearingCancelledSummaryComponent,
        data: {
          title: 'HMCTS Hearings | View Hearing | Cancelled Summary'
        }
      },
      {
        path: 'hearing-completed-summary/:id',
        resolve: {
          actualSummary: ActualSummaryResponseResolver,
          hearingStageOptions: HearingStageResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          courtLocation: CourtLocationsDataResolver,
          partyChannels: HearingActualPartyChannelResolverService,
          partySubChannels: HearingActualPartySubChannelResolverService,
          hearingRoles: HearingActualRoleResolverService
        },
        component: HearingCompletedSummaryComponent,
        data: {
          title: 'HMCTS Hearings | Hearing Actuals | Completed',
          isChildRequired: [HearingCategory.HearingChannel]
        }
      },
      {
        path: 'hearing-adjourned-summary/:id',
        resolve: {
          actualSummary: ActualSummaryResponseResolver,
          hearingStageOptions: HearingStageResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          courtLocation: CourtLocationsDataResolver,
          partyChannels: HearingActualPartyChannelResolverService,
          partySubChannels: HearingActualPartySubChannelResolverService,
          hearingRoles: HearingActualRoleResolverService,
          adjournReasons: AdjournHearingActualReasonResolver
        },
        component: HearingAdjournedSummaryComponent,
        data: {
          title: 'HMCTS Hearings | Hearing Actuals | Adjourned',
          isChildRequired: [HearingCategory.HearingChannel]
        }
      },
      {
        path: 'hearing-view-actuals-summary/:id',
        resolve: {
          actualSummary: ActualSummaryResponseResolver,
          hearingStageOptions: HearingStageResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          courtLocation: CourtLocationsDataResolver,
          partyChannels: HearingActualPartyChannelResolverService,
          partySubChannels: HearingActualPartySubChannelResolverService,
          hearingRoles: HearingActualRoleResolverService
        },
        component: HearingViewActualSummaryComponent,
        data: {
          title: 'HMCTS Hearings | Hearing Actuals | Awaiting',
          isChildRequired: [HearingCategory.HearingChannel]
        }
      },
      {
        path: 'hearing-request-failed-summary/:id',
        resolve: {
          hearingStageOptions: HearingStageResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          courtLocation: CourtLocationsDataResolver,
          partyChannels: HearingActualPartyChannelResolverService,
          partySubChannels: HearingActualPartySubChannelResolverService
        },
        component: HearingRequestFailedSummaryComponent,
        data: {
          title: 'HMCTS Hearings | View Hearing | Request failed '
        }
      },
      {
        path: 'hearing-view-summary',
        resolve: {
          hearingPriorities: RefDataResolver,
          caseType: CaseTypesResolver,
          caseFlags: CaseFlagsResolver,
          hearingStageOptions: HearingStageResolver,
          additionFacilitiesOptions: AdditionalFacilitiesResolver,
          partyChannels: PartyChannelsResolverService,
          partySubChannels: PartySubChannelsResolverService,
          judgeTypes: JudgeTypesResolverService,
          judicialUsers: JudicialUserSearchResolver,
          judicialResponseUsers: JudicialUserSearchResponseResolver,
          panelMemberResponseUsers: PanelMemberSearchResponseResolver,
          otherPanelRoles: PanelRolesResolverService,
          courtLocation: CourtLocationsDataResolver
        },
        component: HearingViewSummaryComponent,
        data: {
          title: 'HMCTS Hearings | View Hearing | Summary',
          isChildRequired: [HearingCategory.PanelMemberType, HearingCategory.CaseType]
        }
      }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    canActivate: [HearingsViewGuard],
    data: {
      title: 'HMCTS Hearings | System Error'
    }
  }
];

export const hearingsRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
