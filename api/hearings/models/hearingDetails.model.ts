import { HearingLocationModel } from './hearingLocation.model';
import { HearingWindowModel } from './hearingWindow.model';
import { PanelRequirementsModel } from './panelRequirements.model';

export interface HearingDetailsModel {
  autolistFlag: boolean;
  hearingType: string;
  hearingWindow: HearingWindowModel;
  duration: number;
  nonStandardHearingDurationReasons?: string[];
  hearingPriorityType: string;
  numberOfPhysicalAttendees?: number;
  hearingInWelshFlag?: boolean;
  hearingLocations: HearingLocationModel[];
  facilitiesRequired: string[];
  listingComments?: string;
  hearingRequester?: string;
  privateHearingRequiredFlag?: boolean;
  leadJudgeContractType?: string;
  panelRequirements: PanelRequirementsModel;
  hearingIsLinkedFlag?: boolean;
  amendReasonCodes: string[];
  hearingChannels: string[];
  hearingLevelParticipantAttendance: string[];
  listingAutoChangeReasonCode: string;
  isAPanelFlag?: boolean;
}
