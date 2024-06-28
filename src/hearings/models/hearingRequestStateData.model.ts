import { HttpError } from '../../models/httpError.model';
import { HearingRequestMainModel } from './hearingRequestMain.model';
import { HearingResponseError } from './hearingResponseError.model';

export interface HearingRequestStateData {
  hearingRequestMainModel: HearingRequestMainModel;
  lastError?: HttpError;
  getJudicialUsersError?: HearingResponseError;
}
