import { CASE_FLAG_REFERENCE_VALUES } from '../../../api/prd/caseFlag/data/caseFlagReference.mock.data';
import { caseFlagsRefData, serviceHearingValuesModel } from '../hearing.test.data';
import { CaseFlagReferenceModel } from '../models/caseFlagReference.model';
import { CaseFlagType, PartyType } from '../models/hearings.enum';
import { AmendmentLabelStatus } from '../models/hearingsUpdateMode.enum';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { PartyFlagsModel } from '../models/partyFlags.model';
import { CaseFlagsUtils } from './case-flags.utils';

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

  describe('Reasonable adjustments', () => {
    const partiesInHMC: PartyDetailsModel[] = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyName: 'Jane Smith',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      },
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyName: 'Jack Ryan',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jack',
          lastName: 'Ryan',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      }
    ];

    const partiesInSHV: PartyDetailsModel[] = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyName: 'Jane Butler',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      },
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyName: 'Jack Ryan',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jack',
          lastName: 'Ryan',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      },
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyName: 'Rob Kennedy',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Rob',
          lastName: 'Kennedy',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      }
    ];

    const caseFlags: PartyFlagsModel[] = [
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0001',
        flagId: 'RA0002',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'PF0001',
        flagId: 'PF0015',
        flagDescription: 'Language Interpreter',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'CF0001',
        flagId: 'CF0006',
        flagDescription: 'Potential fraud',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P2',
        partyName: 'Jack Ryan',
        flagParentId: 'RA0001',
        flagId: 'RA0002',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P2',
        partyName: 'Jack Ryan',
        flagParentId: 'RA0008',
        flagId: 'RA0042',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P3',
        partyName: 'Rob Kennedy',
        flagParentId: 'RA0001',
        flagId: 'RA0002',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE'
      }
    ];

    it('should return reasonable adjustment flags', () => {
      const flagsGroup = CaseFlagsUtils.getReasonableAdjustmentFlags(caseFlagsRefData, caseFlags, partiesInHMC, partiesInSHV);
      expect(flagsGroup[0].name).toEqual('Jane Butler');
      expect(flagsGroup[0].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.AMENDED);
      expect(flagsGroup[0].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[1].name).toEqual('Jack Ryan');
      expect(flagsGroup[1].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[1].partyFlags[1].flagAmendmentLabelStatus).toEqual(AmendmentLabelStatus.ACTION_NEEDED);
      expect(flagsGroup[2].name).toEqual('Rob Kennedy');
      expect(flagsGroup[2].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.ACTION_NEEDED);
      expect(flagsGroup[2].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
    });
  });

  describe('Non-reasonable adjustments', () => {
    const partiesInHMC: PartyDetailsModel[] = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyName: 'Jane Smith',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      },
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyName: 'Jack Ryan',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jack',
          lastName: 'Ryan'
        }
      },
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyName: 'Rob Kennedy',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Rob',
          lastName: 'Kennedy'
        }
      }
    ];

    const partiesInSHV: PartyDetailsModel[] = [
      {
        partyID: 'P1',
        partyType: PartyType.IND,
        partyName: 'Jane Butler',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jane',
          lastName: 'Smith',
          reasonableAdjustments: [
            'RA0002'
          ]
        }
      },
      {
        partyID: 'P2',
        partyType: PartyType.IND,
        partyName: 'Jack Ryan',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Jack',
          lastName: 'Ryan'
        }
      },
      {
        partyID: 'P3',
        partyType: PartyType.IND,
        partyName: 'Rob Kennedy',
        partyRole: 'APPL',
        individualDetails: {
          firstName: 'Rob',
          lastName: 'Kennedy'
        }
      }
    ];

    const caseFlags: PartyFlagsModel[] = [
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'RA0001',
        flagId: 'RA0002',
        flagDescription: 'Sign language interpreter required',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: 'PF0001',
        flagId: 'PF0015',
        flagDescription: 'Language Interpreter',
        flagStatus: 'ACTIVE'
      },
      {
        partyId: 'P1',
        partyName: 'Jane Smith',
        flagParentId: null,
        flagId: 'CF0006',
        flagDescription: 'Potential fraud',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2023-12-19T09:00:00.000Z'
      },
      {
        partyId: 'P2',
        partyName: 'Jack Ryan',
        flagParentId: null,
        flagId: 'PF0002',
        flagDescription: 'Vulnerable user',
        flagStatus: 'ACTIVE',
        dateTimeModified: '2023-12-19T09:00:00.000Z'
      },
      {
        partyId: 'P2',
        partyName: 'Jack Ryan',
        flagParentId: null,
        flagId: 'CF0002',
        flagDescription: 'Complex Case',
        flagStatus: 'ACTIVE',
        dateTimeCreated: '2023-12-17T09:00:00.000Z'
      },
      {
        partyId: 'P3',
        partyName: 'Rob Kennedy',
        flagParentId: null,
        flagId: 'CF0007',
        flagDescription: 'Urgent Case',
        flagStatus: 'ACTIVE',
        dateTimeModified: '2023-12-17T09:00:00.000Z'
      }
    ];

    const partyDetailsWithLanguage = [
      {
        ...partyDetails[0],
        individualDetails: {
          ...partyDetails[0].individualDetails,
          interpreterLanguage: 'req'
        }
      },
      {
        ...partyDetails[1]
      }];
    const requestDetails = {
      timestamp: '2023-12-18T09:00:00.000Z',
      versionNumber: 1
    };

    const mockLanguageFlag: CaseFlagReferenceModel = {
      name: 'Language Interpreter',
      hearingRelevant: true,
      flagComment: true,
      flagCode: 'PF0015',
      isParent: false,
      Path: [
        'Party'
      ],
      childFlags: []
    };

    const singleCaseFlagReferenceValue: CaseFlagReferenceModel[] = [
      {
        name: 'Case',
        hearingRelevant: true,
        flagComment: true,
        flagCode: 'CF0001',
        isParent: true,
        Path: [],
        childFlags: [
          {
            name: 'Complex Case',
            hearingRelevant: true,
            flagComment: true,
            flagCode: 'CC0002',
            isParent: false,
            Path: [
              'Case'
            ],
            childFlags: []
          }
        ]
      }
    ];

    it('should return non-reasonable adjustment flags with labels', () => {
      const flagsGroup = CaseFlagsUtils.getNonReasonableAdjustmentFlags(caseFlagsRefData, caseFlags,
        partiesInHMC, partiesInSHV, requestDetails, false);
      expect(flagsGroup[0].name).toEqual('Jane Butler');
      expect(flagsGroup[0].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.AMENDED);
      expect(flagsGroup[0].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[0].partyFlags[1].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[0].partyFlags[2].flagAmendmentLabelStatus).toEqual(AmendmentLabelStatus.ACTION_NEEDED);
      expect(flagsGroup[1].name).toEqual('Jack Ryan');
      expect(flagsGroup[1].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[1].partyFlags[0].flagAmendmentLabelStatus).toEqual(AmendmentLabelStatus.ACTION_NEEDED);
      expect(flagsGroup[0].partyFlags[1].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[2].name).toEqual('Rob Kennedy');
      expect(flagsGroup[2].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[2].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
    });

    it('should return non-reasonable adjustment flags with no labels', () => {
      const flagsGroup = CaseFlagsUtils.getNonReasonableAdjustmentFlags(caseFlagsRefData, caseFlags,
        partiesInHMC, partiesInSHV, requestDetails, true);
      expect(flagsGroup[0].name).toEqual('Jane Butler');
      expect(flagsGroup[0].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[0].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[0].partyFlags[1].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[0].partyFlags[2].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[1].name).toEqual('Jack Ryan');
      expect(flagsGroup[1].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[1].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[0].partyFlags[1].flagAmendmentLabelStatus).toBeUndefined();
      expect(flagsGroup[2].name).toEqual('Rob Kennedy');
      expect(flagsGroup[2].partyAmendmentLabelStatus).toEqual(AmendmentLabelStatus.NONE);
      expect(flagsGroup[2].partyFlags[0].flagAmendmentLabelStatus).toBeUndefined();
    });

    it('should set reasonable adjustments from hearing request if found', () => {
      const partyWithFlags = CaseFlagsUtils.convertPartiesToPartyWithFlags(caseFlagReferenceModels, partyDetailsWithLanguage, servicePartyDetails);
      expect(partyWithFlags.get('Jane and Smith').length).toEqual(3);
      expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag1);
      expect(partyWithFlags.get('Jane and Smith')).toContain(mockFlag2);
      expect(partyWithFlags.get('Jane and Smith')).toContain(mockLanguageFlag);
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

    it('should not set reasonable adjustments for party when missing in case flag', () => {
      partyDetails[0].individualDetails.reasonableAdjustments = [];
      const partyWithFlags = CaseFlagsUtils.convertPartiesToPartyWithFlags(singleCaseFlagReferenceValue, partyDetails, servicePartyDetails);
      expect(partyWithFlags.size).toEqual(0);
    });

    it('should return an empty array if partyFlags is undefined', () => {
      const partyFlags: PartyFlagsModel[] = undefined;
      const activeFlags = CaseFlagsUtils.displayCaseFlagsGroup(partyFlags, singleCaseFlagReferenceValue, CaseFlagType.NON_REASONABLE_ADJUSTMENT);
      expect(activeFlags.length).toBe(0);
    });
  });
});
