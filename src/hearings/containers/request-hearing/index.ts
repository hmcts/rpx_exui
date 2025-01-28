import { HearingAdditionalInstructionsComponent } from './hearing-additional-instructions/hearing-additional-instructions.component';
import { HearingAttendanceComponent } from './hearing-attendance/hearing-attendance.component';
import { HearingChangeReasonsComponent } from './hearing-change-reasons/hearing-change-reasons.component';
import { HearingCreateEditSummaryComponent } from './hearing-create-edit-summary/hearing-create-edit-summary.component';
import * as fromHearingEditSummary from './hearing-edit-summary';
import { HearingFacilitiesComponent } from './hearing-facilities/hearing-facilities.component';
import { HearingFinalConfirmationComponent } from './hearing-final-confirmation/hearing-final-confirmation.component';
import { HearingJudgeComponent } from './hearing-judge/hearing-judge.component';
import { HearingLinkComponent } from './hearing-link/hearing-link.component';
import { HearingPanelComponent } from './hearing-panel/hearing-panel.component';
import { HearingPanelRequiredComponent } from './hearing-panel-required/hearing-panel-required.component';
import { HearingPanelSelectorComponent } from './hearing-panel-selector/hearing-panel-selector.component';
import { HearingRequirementsComponent } from './hearing-requirements/hearing-requirements.component';
import { HearingStageComponent } from './hearing-stage/hearing-stage.component';
import { HearingTimingComponent } from './hearing-timing/hearing-timing.component';
import { HearingVenueComponent } from './hearing-venue/hearing-venue.component';
import { HearingViewEditSummaryComponent } from './hearing-view-edit-summary/hearing-view-edit-summary.component';
import { HearingWelshComponent } from './hearing-welsh/hearing-welsh.component';
import { RequestHearingComponent } from './request-hearing.component';

export const containers: any[] = [
  RequestHearingComponent,
  HearingFacilitiesComponent,
  HearingWelshComponent,
  HearingTimingComponent,
  HearingRequirementsComponent,
  HearingStageComponent,
  HearingVenueComponent,
  HearingWelshComponent,
  HearingAttendanceComponent,
  HearingJudgeComponent,
  HearingPanelComponent,
  HearingPanelRequiredComponent,
  HearingPanelSelectorComponent,
  HearingTimingComponent,
  HearingAdditionalInstructionsComponent,
  HearingCreateEditSummaryComponent,
  HearingViewEditSummaryComponent,
  HearingFinalConfirmationComponent,
  HearingChangeReasonsComponent,
  HearingLinkComponent,
  ...fromHearingEditSummary.containers
];
