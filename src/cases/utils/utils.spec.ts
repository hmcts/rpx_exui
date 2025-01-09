import { CaseRoleDetails, RoleCategory } from '../../role-access/models';
import { Utils } from './utils';

describe('Utils', () => {
  const caseRolesData: any[] = [
    {
      actions: [
        {
          id: 'reallocate',
          title: 'Reallocate'
        },
        {
          id: 'remove',
          title: 'Remove Allocation'
        }
      ],
      actorId: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      end: null,
      id: '13daef07-dbd2-4106-9099-711c4505f04f',
      location: null,
      roleCategory: RoleCategory.JUDICIAL,
      roleName: 'hearing-judge',
      start: '2021-12-09T00:00:00Z'
    }
  ];
  const data: CaseRoleDetails[] = [
    {
      idam_id: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      sidam_id: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      known_as: 'Tom',
      surname: 'Cruz',
      full_name: 'Tom Cruz',
      email_id: '330085EMP-@ejudiciary.net'
    }
  ];

  it('should determine string or number', () => {
    expect(Utils.isStringOrNumber('string')).toEqual(true);
    expect(Utils.isStringOrNumber(1)).toEqual(true);
    expect(Utils.isStringOrNumber(['array'])).toEqual(false);
  });

  it('should get filter type', () => {
    const fieldName = 'someFieldName';
    let metadataFields = [];
    expect(Utils.getFilterType(fieldName, metadataFields)).toEqual('caseFilter');
    metadataFields = ['someFieldName'];
    expect(Utils.getFilterType(fieldName, metadataFields)).toEqual('metadataFilter');
  });

  it('should sanitise Metadata Field Names', () => {
    const fieldName = '[someFieldName]';
    expect(Utils.sanitiseMetadataFieldName('metadataFilter', fieldName)).toEqual('somefieldname');
    expect(Utils.sanitiseMetadataFieldName('caseFilter', fieldName)).toEqual('[someFieldName]');
  });

  it('should map caseRoles', () => {
    const result = Utils.mapCaseRoles(caseRolesData, data);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Tom Cruz');
  });

  it('should map mapCaseRolesForExclusions', () => {
    const roleExclusions = [{
      actorId: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
      id: 'is344',
      type: 'JUDICIAL',
      name: 'Tom Cruz',
      userType: 'JUDICIAL',
      notes: '',
      added: new Date(2021, 12, 31),
      email: 'test@mail.com'
    }];
    const result = Utils.mapCaseRolesForExclusions(roleExclusions, data);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Tom');
  });

  it('should check for matched permissions return true', () => {
    const featureVariation = {
      jurisdiction: 'SSCS',
      includeCaseTypes: [
        'Benefit'
      ]
    };
    const jurisdictionId = 'SSCS';
    const caseTypeId = 'Benefit';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdictionId, caseTypeId)).toEqual(true);
  });

  it('should check for regEx expression and matched permissions return true', () => {
    const featureVariation = {
      jurisdiction: 'SSCS',
      includeCaseTypes: [
        '(Benefit-|BENEFIT-)\\d+'
      ]
    };
    const jurisdictionId = 'SSCS';
    const caseTypeId = 'Benefit-1243';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdictionId, caseTypeId)).toEqual(true);
  });

  it('should check for regEx expression and matched permissions return false', () => {
    const featureVariation = {
      jurisdiction: 'SSCS',
      includeCaseTypes: [
        '(Benefit-|BENEFIT-)\\d+'
      ]
    };
    const jurisdictionId = 'SSCS';
    const caseTypeId = 'Benefit1243';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdictionId, caseTypeId)).toEqual(false);
  });

  it('should check for matched permissions return false', () => {
    const featureVariation = {
      jurisdiction: 'SSCS',
      includeCaseTypes: [
        'Benefit'
      ]
    };
    const jurisdictionId = 'PRL';
    const caseTypeId = 'PRLAPPS';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariation, jurisdictionId, caseTypeId)).toEqual(false);
  });

  it('should support both old and new case type parameters', () => {
    const featureVariations = [
      {
        jurisdiction: 'SSCS',
        includeCaseTypes: [
          'Benefit'
        ]
      },
      {
        jurisdiction: 'PRIVATELAW',
        caseType: 'CARESUPERVISION_EPO',
        roles: ['ignore1', 'ignore2']
      }
    ];

    let jurisdictionId = 'SSCS';
    let caseTypeId = 'Benefit';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariations[0], jurisdictionId, caseTypeId)).toEqual(true);
    jurisdictionId = 'PRIVATELAW';
    caseTypeId = 'CARESUPERVISION_EPO';
    expect(Utils.hasMatchedJurisdictionAndCaseType(featureVariations[1], jurisdictionId, caseTypeId)).toEqual(true);
  });
});
