import { expect } from 'chai';
import { SERVICE_HEARING_VALUES } from './data/serviceHearingValues.mock.data';
import { mapDataByDefault } from './services.index';

describe('hearings services', () => {
  describe('mapDataByDefault', () => {
    it('should return data with no modifications if no case flags', () => {
      const data = SERVICE_HEARING_VALUES;
      const result = mapDataByDefault(data);
      expect(result.caseFlags.flags.length).to.equal(0);
    });

    it('should set the flagId and return the result', () => {
      const data = SERVICE_HEARING_VALUES;
      data.caseFlags = {
        flags: [
          {
            partyID: '26e278a9-4051-4e',
            partyName: 'miss defendant1 lit friend hnl',
            flagId: 'PF0015',
            flagDescription: 'Language Interpreter',
            flagStatus: 'Active'
          },
          {
            partyID: 'f07420e6-5d4d-43',
            partyName: 'miss defendant1 lit friend hnl',
            flagId: 'RA0012',
            flagDescription: 'Braille documents',
            flagStatus: 'Active'
          }
        ],
        flagAmendURL: '/flag/amend'
      };
      const result = mapDataByDefault(data);
      expect(result.caseFlags.flags[0].partyId).to.equal('26e278a9-4051-4e');
      expect(result.caseFlags.flags[1].partyId).to.equal('f07420e6-5d4d-43');
    });

    it('should return flagID as null if flagId contains value', () => {
      const data = SERVICE_HEARING_VALUES;
      data.caseFlags = {
        flags: [
          {
            partyId: '26e278a9-4051-4e',
            partyName: 'miss defendant1 lit friend hnl',
            flagId: 'PF0015',
            flagDescription: 'Language Interpreter',
            flagStatus: 'Active'
          },
          {
            partyId: 'f07420e6-5d4d-43',
            partyName: 'miss defendant1 lit friend hnl',
            flagId: 'RA0012',
            flagDescription: 'Braille documents',
            flagStatus: 'Active'
          }
        ],
        flagAmendURL: '/flag/amend'
      };
      const result = mapDataByDefault(data);
      expect(result.caseFlags.flags[0].partyID).to.equal(undefined);
      expect(result.caseFlags.flags[1].partyID).to.equal(undefined);
    });
  });
});

