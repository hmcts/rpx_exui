import * as chai from 'chai';
import { expect } from 'chai';
import { NextFunction } from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { GlobalSearchService } from '../interfaces/globalSearchService';
import { http } from '../lib/http';
import * as globalSearchServices from './index';
import { RefDataHMCTSService } from '../ref-data/models/ref-data-hmcts-service.model';

chai.use(sinonChai);

describe('Jurisdiction', () => {
  let sandbox: sinon.SinonSandbox;
  const refDataHMCTS: RefDataHMCTSService[] = [
    {
      jurisdiction: 'Immigration and Asylum Chamber',
      service_id: 39,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Tribunals',
      service_description: 'Immigration and Asylum Appeals',
      service_code: 'BFA1',
      service_short_description: 'Immigration and Asylum Appeals',
      ccd_service_name: 'IA',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: ['Asylum', 'Bail']
    },
    {
      jurisdiction: 'Civil',
      service_id: 6,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Civil and Family',
      service_description: 'Specified Money Claims',
      service_code: 'AAA6',
      service_short_description: 'Specified Money Claims',
      ccd_service_name: 'Civil',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: [
        'MoneyClaimCase',
        'CMC_ExceptionRecord',
        'CIVIL',
        'GENERALAPPLICATION'
      ]
    },
    {
      jurisdiction: 'Civil',
      service_id: 7,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Civil and Family',
      service_description: 'Damages',
      service_code: 'AAA7',
      service_short_description: 'Damages',
      ccd_service_name: 'CIVIL',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: ['UNSPECIFIED_CLAIMS', 'CIVIL', 'GENERALAPPLICATION']
    },
    {
      jurisdiction: 'Family',
      service_id: 12,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Civil and Family',
      service_description: 'Family Private Law',
      service_code: 'ABA5',
      service_short_description: 'Family Private Law',
      ccd_service_name: 'PRIVATELAW',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: ['PRLAPPS']
    },
    {
      jurisdiction: 'Family',
      service_id: 10,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Civil and Family',
      service_description: 'Family Public Law',
      service_code: 'ABA3',
      service_short_description: 'Family Public Law',
      ccd_service_name: 'PUBLICLAW',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: ['CARE_SUPERVISION_EPO']
    },
    {
      jurisdiction: 'Employment Tribunals',
      service_id: 43,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Tribunals',
      service_description: 'Employment Claims',
      service_code: 'BHA1',
      service_short_description: 'Employment Claims',
      ccd_service_name: 'EMPLOYMENT',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: [
        'ET_EnglandWales',
        'ET_Scotland',
        'ET_Scotland_Multiple',
        'ET_EnglandWales_Multiple'
      ]
    },
    {
      jurisdiction: 'Social Entitlement Chamber',
      service_id: 30,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Tribunals',
      service_description: 'Criminal Injuries Compensation',
      service_code: 'BBA2',
      service_short_description: 'Criminal Injuries Compensation',
      ccd_service_name: 'ST_CIC',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: ['CriminalInjuriesCompensation']
    },
    {
      jurisdiction: 'Family',
      service_id: 13,
      org_unit: 'HMCTS',
      business_area: 'Civil, Family and Tribunals',
      sub_business_area: 'Civil and Family',
      service_description: 'Probate',
      service_code: 'ABA6',
      service_short_description: 'Probate',
      ccd_service_name: 'PROBATE',
      last_update: '2021-02-10T11:53:58.808063',
      ccd_case_types: [
        'Caveat',
        'GrantOfRepresentation',
        'LegacySearch',
        'PROBATE_ExceptionRecord',
        'StandingSearch',
        'WillLodgement'
      ]
    }
  ];
  const serviceList: GlobalSearchService[] = [

    { serviceId: 'IA', serviceName: 'Immigration and Asylum Appeals' },
    { serviceId: 'Civil', serviceName: 'Civil' },
    { serviceId: 'PRIVATELAW', serviceName: 'Family Private Law' },
    { serviceId: 'PUBLICLAW', serviceName: 'Family Public Law' },
    { serviceId: 'EMPLOYMENT', serviceName: 'Employment Claims' },
    { serviceId: 'ST_CIC', serviceName: 'Criminal Injuries Compensation' }
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get global search services', async() => {
    const req = mockReq();
    const res = mockRes({
      serviceList
    });
    const next = sinon.mock().atLeast(1) as NextFunction;
    sandbox.stub(http, 'get').resolves(res);
    sandbox.stub(globalSearchServices, 'getServices').returns(res);
    const response = await globalSearchServices.getServices(req, res, next);
    expect(response).to.deep.equal(res);
  });

  it('should error when getting global search services', async() => {
    const req = mockReq();
    const res = mockRes({
      status: 500
    });
    const next = sinon.mock().atLeast(1) as NextFunction;
    sandbox.stub(globalSearchServices, 'getServices').returns(res);
    const response = await globalSearchServices.getServices(req, res, next);
    expect(response).to.deep.equal(res);
  });

  it('should return global search services', async() => {
    let services = globalSearchServices.generateServices(undefined);
    expect(services.length).to.equal(6);

    services = globalSearchServices.generateServices(null);
    expect(services.length).to.equal(6);

    services = globalSearchServices.generateServices([]);
    expect(services.length).to.equal(6);
  });

  it('should return global search services2', async() => {
    console.log ('refDataHMCTS size: ' + refDataHMCTS.length);
    const services = globalSearchServices.generateServices(refDataHMCTS);
    expect(services).to.deep.equal(serviceList);
  });

  it('should get global search results', async () => {
    const req = mockReq();
    const res = mockRes(
      {
        caseStartRecord: 1,
        casesReturned: 25,
        moreResultsToGo: true
      },
      [{
        ccdCaseTypeId: '123',
        ccdCaseTypeName: 'Test Case Type',
        ccdJurisdictionId: 'IA',
        ccdJurisdictionName: '',
        hmctsServiceId: '',
        hmctsServiceShortDescription: '',
        baseLocationId: '',
        baseLocationName: '',
        caseManagementCategoryId: '',
        caseManagementCategoryName: '',
        caseNameHmctsInternal: '',
        caseReference: '',
        otherReferences: [],
        processForAccess: '',
        regionId: '',
        regionName: '',
        stateId: ''
      }]
    );
    const next = sinon.mock().atLeast(1) as NextFunction;
    sandbox.stub(http, 'post').resolves(res);
    sandbox.stub(globalSearchServices, 'getSearchResults').returns(res);
    const response = await globalSearchServices.getSearchResults(req, res, next);
    expect(response).to.deep.equal(res);
  });
});
