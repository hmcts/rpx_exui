import { HearingLocationModel } from './hearingLocation.model';
import { HearingWindowModel } from './hearingWindow.model';
import { PanelRequirementsModel } from './panelRequirements.model';

export interface HearingDetailsModel {
  duration: number;
  hearingType: string;
  hearingLocations: HearingLocationModel[];
  hearingIsLinkedFlag?: boolean;
  hearingWindow: HearingWindowModel;
  privateHearingRequiredFlag?: boolean;
  panelRequirements: PanelRequirementsModel;
  autolistFlag: boolean;
  nonStandardHearingDurationReasons?: string[];
  hearingPriorityType: string;
  numberOfPhysicalAttendees?: number;
  hearingInWelshFlag?: boolean;
  facilitiesRequired?: string[];
  listingComments?: string;
  hearingRequester?: string;
  leadJudgeContractType?: string;
  amendReasonCodes: string[];
  hearingChannels: string[];
  listingAutoChangeReasonCode: string;
  isPaperHearing?: boolean;
}
