import { caseFlagsRefData, serviceHearingValuesModel } from '../hearing.test.data';
import { CaseFlagType } from '../models/hearings.enum';
import { CaseFlagsUtils } from './case-flags.utils';
import { CASE_FLAG_REFERENCE_VALUES } from '../../../api/prd/caseFlag/data/caseFlagReference.mock.data';
import { CaseFlagReferenceModel } from '../models/caseFlagReference.model';
import { PartyType } from '../../../api/hearings/models/hearings.enum';

describe('CaseFlagsUtils', () => {
  const caseFlagReferenceModels: CaseFlagReferenceModel[] = CASE_FLAG_REFERENCE_VALUES;
  const partyDetails = [
    {
      partyID: 'P1',
      partyName: 'Jane and Smith',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      individualDetails: {
        title: 'Miss',
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson',
        reasonableAdjustments: [
          'RA0053',
          'RA0042'
        ],
        interpreterLanguage: null
      }
    },
    {
      partyID: 'P2',
      partyName: 'DWP',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      individualDetails: {
        title: '',
        firstName: 'DWP',
        preferredHearingChannel: 'inPerson',
        lastName: 'Representative',
        reasonableAdjustments: [],
        interpreterLanguage: null
      }
    }];
  const servicePartyDetails = [
    {
      partyID: 'P1',
      partyName: 'Jane and Smith',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      individualDetails: {
        title: 'Miss',
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson',
        reasonableAdjustments: [
          'RA0018',
          'RA0020'
        ],
        interpreterLanguage: null
      }
    },
    {
      partyID: 'P2',
      partyName: 'DWP',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      individualDetails: {
        title: '',
        firstName: 'DWP',
        preferredHearingChannel: 'inPerson',
        lastName: 'Representative',
        reasonableAdjustments: [],
        interpreterLanguage: null
      }
    }];
  const mockFlag1: CaseFlagReferenceModel = {
    name: 'Hearing Loop',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'RA0053',
    isParent: false,
    Path: [
      'Party', 'Reasonable adjustment', 'Within our buildings and hearing room environment',
      'Hearing Enhancement System (hearing loops infra red receiver)'
    ],
    childFlags: []
  };

  const mockFlag2: CaseFlagReferenceModel = {
    name: 'Sign Language Interpreter',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'RA0042',
    isParent: false,
    Path: ['Party', 'Reasonable adjustment', 'Help or support from a third party'],
    childFlags: []
  };

  const mockFlag3: CaseFlagReferenceModel = {
    name: 'Accessible toilet',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'RA0018',
    isParent: false,
    Path: [
      'Party', 'Reasonable adjustment', 'Physical access and facilities'
    ],
    childFlags: []
  };

  const mockFlag4 = {
    name: 'Assistance using lifts',
    hearingRelevant: true,
    flagComment: true,
    flagCode: 'RA0020',
    isParent: false,
    Path: [
      'Party', 'Reasonable adjustment', 'Physical access and facilities'
    ],
    childFlags: []
  };

  it('should return true if has the right property', () => {
    const caseFlagGroup = CaseFlagsUtils.displayCaseFlagsGroup(serviceHearingValuesModel.caseFlags.flags, caseFlagsRefData, CaseFlagType.REASONABLE_ADJUSTMENT);
    expect(caseFlagGroup.length).toBe(2);
  });

  it('should return false if has not the right property', () => {
    const caseFlagGroup = CaseFlagsUtils.displayCaseFlagsGroup(serviceHearingValuesModel.caseFlags.flags, caseFlagsRefData, CaseFlagType.NON_REASONABLE_ADJUSTMENT);
    expect(caseFlagGroup.length).toBe(3);
  });

  it('should set reasonable adjustments from hearing request if found', () => {
    const partyWithFlags = CaseFlagsUtils.convertPartiesToPartyWithFlags(caseFlagReferenceModels, partyDetails, servicePartyDetails);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag1);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag2);
  });

  it('should set reasonable adjustments from service hearing values if null in hearing request', () => {
    partyDetails[0].individualDetails.reasonableAdjustments = null;
    const partyWithFlags = CaseFlagsUtils.convertPartiesToPartyWithFlags(caseFlagReferenceModels, partyDetails, servicePartyDetails);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag3);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag4);
  });

  it('should set reasonable adjustments from service hearing values if empty array in hearing request', () => {
    partyDetails[0].individualDetails.reasonableAdjustments = [];
    const partyWithFlags = CaseFlagsUtils.convertPartiesToPartyWithFlags(caseFlagReferenceModels, partyDetails, servicePartyDetails);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag3);
    expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag4);
  });
});
