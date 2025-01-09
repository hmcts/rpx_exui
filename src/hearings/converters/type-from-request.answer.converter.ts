import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseCategoryDisplayModel } from '../models/caseCategory.model';
import { LovRefDataModel } from '../models/lovRefData.model';
import { State } from '../store';
import { CaseTypesUtils } from '../utils/case-types.utils';
import { AnswerConverter } from './answer.converter';

export class TypeFromRequestAnswerConverter implements AnswerConverter {
  public caseTypeRefData: LovRefDataModel[];

  constructor(protected readonly route: ActivatedRoute) {
    this.caseTypeRefData = this.route.snapshot.data.caseType;
  }

  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        let result = '';
        const caseCategories = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare?.hearingRequestMainModel?.caseDetails?.caseCategories
          : state.hearingRequest?.hearingRequestMainModel?.caseDetails?.caseCategories;
        if (caseCategories) {
          const caseTypes: CaseCategoryDisplayModel[] = CaseTypesUtils.getCaseCategoryDisplayModels(this.caseTypeRefData, caseCategories);
          caseTypes.forEach((caseCategory) => {
            result += `${caseCategory.categoryDisplayValue} \n<ul>`;
            if (caseCategory.childNodes?.length) {
              caseCategory.childNodes.forEach((child) => {
                result += `<li>- ${child.categoryDisplayValue}</li>`;
              });
            }
            result += '</ul>';
          });
          return result;
        }
        return result;
      })
    );
  }
}
