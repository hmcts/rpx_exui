import { PartyType } from './hearings.enum';
import { AmendmentLabelStatus } from './hearingsUpdateMode.enum';
import { IndividualDetailsModel } from './individualDetails.model';
import { OrganisationDetailsModel } from './organisationDetails.model';
import { UnavailabilityDOWModel } from './unavailabilityDOW.model';
import { UnavailabilityRangeModel } from './unavailabilityRange.model';

export interface PartyDetailsModel {
  partyID: string;
  partyType: PartyType;
  partyName?: string;
  partyRole: string;
  individualDetails?: IndividualDetailsModel;
  organisationDetails?: OrganisationDetailsModel;
  unavailabilityDOW?: UnavailabilityDOWModel[];
  unavailabilityRanges?: UnavailabilityRangeModel[];
  hearingSubChannel?: string;
  partyAmendmentStatus?: AmendmentLabelStatus;
}
