import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { initialState } from '../hearing.test.data';
import { State } from '../store/reducers';
import { ReasonableAdjustmentsAmendedConverter } from './reasonable-adjustments.amended.converter';
import { PartyDetailsModel } from '../models/partyDetails.model';
import * as _ from 'lodash';

describe('ReasonableAdjustmentsAmendedConverter', () => {
  let reasonableAdjustmentsAmendedConverter: ReasonableAdjustmentsAmendedConverter;

  beforeEach(() => {
    reasonableAdjustmentsAmendedConverter = new ReasonableAdjustmentsAmendedConverter();
  });

  it('should be created', () => {
    // Assert
    expect(reasonableAdjustmentsAmendedConverter).toBeTruthy();
  });

  describe('transformIsAmended', () => {
    it('should return an observable of type boolean', (done) => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      // Act
      reasonableAdjustmentsAmendedConverter.transformIsAmended(of(STATE)).subscribe((result) => {
        // Assert
        expect(result).toBeDefined();
        expect(typeof result).toBe('boolean');
        done();
      });
    });

    it('should call checkReasonableAdjustments with the correct arguments', (done) => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      spyOn(reasonableAdjustmentsAmendedConverter, 'checkReasonableAdjustments');
      // Act
      reasonableAdjustmentsAmendedConverter.transformIsAmended(of(STATE)).subscribe(() => {
        // Assert
        expect(reasonableAdjustmentsAmendedConverter.checkReasonableAdjustments).toHaveBeenCalledWith(
          STATE.hearingRequest.hearingRequestMainModel.partyDetails,
          STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails
        );
        done();
      });
    });

    it('should transform is amended correctly if reasonable adjustments have been amended', () => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      STATE.hearingRequest.hearingRequestMainModel.partyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053'];
      // Act
      const result$ = reasonableAdjustmentsAmendedConverter.transformIsAmended(of(STATE));
      const isAmended = true;
      const expected = cold('(b|)', { b: isAmended });
      // Assert
      expect(result$).toBeObservable(expected);
    });

    it('should transform is amended correctly if reasonable adjustments have not been amended', () => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      STATE.hearingRequest.hearingRequestMainModel.partyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      // Act
      const result$ = reasonableAdjustmentsAmendedConverter.transformIsAmended(of(STATE));
      const isAmended = false;
      const expected = cold('(b|)', { b: isAmended });
      // Assert
      expect(result$).toBeObservable(expected);
    });
  });

  describe('checkReasonableAdjustments', () => {
    it('should return true when reasonable adjustments are not equal for individual party', () => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      const originalPartyDetails: PartyDetailsModel[] = STATE.hearingRequest.hearingRequestMainModel.partyDetails;
      const partyDetailsToCompare: PartyDetailsModel[] = STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails;
      originalPartyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      partyDetailsToCompare[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053'];
      // Act
      const result = reasonableAdjustmentsAmendedConverter.checkReasonableAdjustments(originalPartyDetails, partyDetailsToCompare);
      // Assert
      expect(result).toBe(true);
    });

    it('should return false when reasonable adjustments are equal for individual party', () => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      const originalPartyDetails: PartyDetailsModel[] = STATE.hearingRequest.hearingRequestMainModel.partyDetails;
      const partyDetailsToCompare: PartyDetailsModel[] = STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails;
      originalPartyDetails[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      partyDetailsToCompare[0].individualDetails.reasonableAdjustments = ['RA0042', 'RA0053', 'RA0013', 'RA0016', 'RA0042'];
      // Act
      const result = reasonableAdjustmentsAmendedConverter.checkReasonableAdjustments(originalPartyDetails, partyDetailsToCompare);
      // Assert
      expect(result).toBe(false);
    });

    it('should return false if individual party cannot be found', () => {
      // Arrange
      const STATE: State = _.cloneDeep(initialState.hearings);
      const originalPartyDetails: PartyDetailsModel[] = [STATE.hearingRequest.hearingRequestMainModel.partyDetails[1]];
      const partyDetailsToCompare: PartyDetailsModel[] = STATE.hearingRequestToCompare.hearingRequestMainModel.partyDetails;
      // Act
      const result = reasonableAdjustmentsAmendedConverter.checkReasonableAdjustments(originalPartyDetails, partyDetailsToCompare);
      // Assert
      expect(result).toBe(false);
    });
  });
});
