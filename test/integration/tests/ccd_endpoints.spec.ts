import { expect } from 'chai';
// import mocha from 'mocha';
import { config } from './config/config';
import { getXSRFToken } from './utils/authUtil';
import { setTestContext } from './utils/helper';
import Request from './utils/request';

describe('CCD Endpoints', () => {
  const userName = config.users[config.testEnv].solicitor.e;
  const password = config.users[config.testEnv].solicitor.sec;

  beforeEach(function () {
    this.timeout(120000);

    setTestContext(this);
    Request.clearSession();
  });

  // it('Jurisdictions for user role', async function() {
  //   await Request.withSession(userName, password);
  //   const response = await Request.get('aggregated/caseworkers/:uid/jurisdictions?access=read', null, 200);
  //   expect(response.data).to.be.an('array');
  //   expect(response.data.map((e) => e.name)).to.include.members(config.jurisdcitionNames[config.testEnv]);
  // });

  const jurisdictions = config.jurisdictions[config.testEnv];
  for (const jurisdiction of jurisdictions) {
    for (const caseType of jurisdiction.caseTypeIds) {
      it(`work-basket-input for casetype  ${caseType}`, async () => {
        await Request.withSession(userName, password);
        const response = await Request.get(`data/internal/case-types/${caseType}/work-basket-inputs`, { experimental: true }, 200);
        expect(response.status).to.equal(200, `request with ${caseType} failed`);
        expect(response.data).to.be.an('object');
        expect(response.data.workbasketInputs).to.be.an('array');
      });
    }
  }



  function getSolicitorCreateUrl(caseType: string, event: string) {
    return `data/internal/case-types/${caseType}/event-triggers/${event}?ignore-warning=false`;
  }

  async function getCasesForCaseType(jurisdiction: string, casetype: string) {
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      'X-XSRF-TOKEN': xsrfToken
    };
    const casesResponse = await Request.get(`data/internal/searchCases?ctid=${casetype}&use_case=WORKBASKET&view=WORKBASKET&state=Any`, headers, 200);
    return casesResponse;
  }
});
