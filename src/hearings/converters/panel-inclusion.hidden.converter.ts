import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType, RequirementType } from '../models/hearings.enum';
import { State } from '../store';
import { HiddenConverter } from './hidden.converter';

export class PanelInclusionHiddenConverter implements HiddenConverter {
  public transformHidden(hearingState$: Observable<State>): Observable<boolean> {
    return hearingState$.pipe(map((state) => {
      const panelRequirements = state.hearingConditions?.isHearingAmendmentsEnabled
        ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements
        : state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
      if (panelRequirements?.panelPreferences) {
        return !panelRequirements.panelPreferences.filter((preferences) => preferences.memberType === MemberType.PANEL_MEMBER && preferences.requirementType === RequirementType.MUSTINC).length;
      }
      return true;
    }
    ));
  }
}
