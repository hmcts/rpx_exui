import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../store';
import { AnswerConverter } from './answer.converter';

export class AdditionalInstructionsAnswerConverter implements AnswerConverter {
  public transformAnswer(hearingState$: Observable<State>): Observable<string> {
    return hearingState$.pipe(
      map((state) => {
        const additionalInstructions = state.hearingConditions?.isHearingAmendmentsEnabled
          ? state.hearingRequestToCompare.hearingRequestMainModel.hearingDetails.listingComments
          : state.hearingRequest.hearingRequestMainModel.hearingDetails.listingComments;
        if (!additionalInstructions) {
          return additionalInstructions;
        }

        const formattedInstructions = additionalInstructions.replace(/(?:\r\n|\r|\n)/g, '<br>');
        return formattedInstructions;
      })
    );
  }
}
