import { AmendmentLabelStatus } from './hearingsUpdateMode.enum';

export interface PartyFlagsModel {
  partyId: string;
  partyName: string;
  flagParentId?: string;
  flagId: string;
  flagDescription: string;
  flagStatus: string;
  flagComment?: string;
  dateTimeCreated?: string;
  dateTimeModified?: string;
}

export interface PartyFlagsDisplayModel {
  partyId: string;
  partyName: string;
  flagParentId?: string;
  flagId: string;
  flagDescription: string;
  flagStatus: string;
  flagComment?: string;
  dateTimeCreated?: string;
  dateTimeModified?: string;
  displayName: string;
  displayPath: string[];
  flagAmendmentLabelStatus?: AmendmentLabelStatus;
}
