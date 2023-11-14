export interface ResponseDetailsModel {
  hearingRequestID?: string;
  status?: string;
  timestamp?: string;
  versionNumber: number;
}

export interface RequestDetailsModel extends ResponseDetailsModel {
  hearingGroupRequestId?: string;
  partiesNotified?: string;
  cancellationReasonCodes?: string[];
}
