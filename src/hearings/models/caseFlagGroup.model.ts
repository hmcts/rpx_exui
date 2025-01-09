import { AmendmentLabelStatus } from './hearingsUpdateMode.enum';
import { PartyFlagsDisplayModel } from './partyFlags.model';

export interface CaseFlagGroup {
  name: string;
  partyFlags: PartyFlagsDisplayModel[];
  partyAmendmentLabelStatus?: AmendmentLabelStatus;
}
