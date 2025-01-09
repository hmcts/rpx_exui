import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType } from '../models/hearings.enum';
import { State } from '../store/reducers';
import { IsAmendedConverter } from './is-amended.converter';

export class HearingPanelAmendedConverter implements IsAmendedConverter {
  public transformIsAmended(hearingState$?: Observable<State>): Observable<boolean> {
    return hearingState$.pipe(map((state) => {
      const hearingComparePanelRequirements = state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements;
      const comparedPanelMembers: number = hearingComparePanelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER).length || 0;
      const comparedPanelSpecialisms: number = hearingComparePanelRequirements?.panelSpecialisms?.length || 0;

      const hearingRequestPanelRequirements = state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
      const requestedPanelMembers: number = hearingRequestPanelRequirements?.panelPreferences?.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER).length || 0;
      const requestedPanelSpecialisms: number = hearingRequestPanelRequirements?.panelSpecialisms?.length || 0;

      return !_.isEqual(comparedPanelMembers, requestedPanelMembers) || !_.isEqual(comparedPanelSpecialisms, requestedPanelSpecialisms);
    }));
  }
}
