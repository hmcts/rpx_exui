import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class PanelRolesAnswerConverter implements AnswerConverter {
  constructor(protected readonly route: ActivatedRoute) {}

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    const panelRoles: LovRefDataModel[] = this.route.snapshot.data.otherPanelRoles;

    return hearingState$.pipe(
      map((state) => {
        const panelRequirements = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.panelRequirements
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements;
        const panelSpecialism: string[] = panelRequirements && panelRequirements.panelSpecialisms;
        const selectedSpecialisms: string[] = [];
        panelSpecialism.forEach((specialismName) => {
          let selectedSpecialismName: string = '';
          panelRoles.forEach((role) => {
            if (role.key === specialismName) {
              selectedSpecialismName = role.value_en;
            } else if (role.child_nodes && role.child_nodes.length) {
              role.child_nodes.forEach((specialism) => {
                if (specialismName === specialism.key && !selectedSpecialismName.length) {
                  selectedSpecialismName = `${role.value_en} - ${specialism.value_en}`;
                }
              });
            }
          });
          selectedSpecialisms.push(selectedSpecialismName);
        });
        return selectedSpecialisms.join('<br>');
      })
    );
  }
}
