import { expect } from 'chai';
import { setTestContext } from './utils/helper';
import Request from './utils/request';


const nodeAppDataModels = require('../../dataModels/nodeApp')
const testUsers = require('../../e2e/config/appTestConfig');
const config = require('./config/config').config;

describe('nodeApp endpoint', () => {
  const userName = config.users[config.testEnv].solicitor.e;
  const password = config.users[config.testEnv].solicitor.sec;

  // const userName = 'peterxuisuperuser@mailnesia.com';
  // const password = 'Monday01';

  beforeEach(function () {
    this.timeout(120000);

    setTestContext(this);
    Request.clearSession();
  });


  it('external/configuration-ui', async () => {
    const response = await Request.get('external/configuration-ui', null, 200);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.all.keys(config.configuratioUi[config.testEnv]);
    // expect(response.data.launchDarklyClientId).to.equal('645baeea2787d812993d9d70');
    expect(response.data.clientId).to.equal('xuiwebapp_passport_0_7');
  });

  it('auth/isAuthenticated with session cookies', async () => {
    await Request.withSession(userName, password);
    const response = await Request.get('auth/isAuthenticated', null, 200);
    expect(response.status).to.equal(200);
    expect(response.data).to.equal(true);
  });

  it('auth/isAuthenticated without session cookies', async () => {
    const response = await Request.get('auth/isAuthenticated', null, 200);
    expect(response.status).to.equal(200);
    expect(response.data).to.equal(false);
  });


  it('api/user/details', async () => {
    await Request.withSession(userName, password);
    const configRes = await Request.get('external/configuration-ui', null, 200);

    const response = await Request.get('api/user/details', null, 200);
    expect(response.status).to.equal(200);
    const actualLocationObjKeys = response.data;
    const expectedUserDetailsObj_oidc = nodeAppDataModels.getUserDetails_oidc();
    expect(actualLocationObjKeys).to.have.all.keys(Object.keys(expectedUserDetailsObj_oidc));

    if (actualLocationObjKeys.roleAssignmentInfo.length > 0) {
      const actualRoleAssignmentObjKeys = Object.keys(actualLocationObjKeys.roleAssignmentInfo[0]);
      console.log(actualRoleAssignmentObjKeys);
      console.log(Object.keys(expectedUserDetailsObj_oidc.roleAssignmentInfo[0]));

      expect(actualRoleAssignmentObjKeys).to.include.members(Object.keys(expectedUserDetailsObj_oidc.roleAssignmentInfo[0]));
    }

    expect(actualLocationObjKeys.userInfo.roles).to.be.an('array');

    if (configRes.data.oidcEnabled) {
      expect(actualLocationObjKeys.userInfo).to.have.all.keys(Object.keys(expectedUserDetailsObj_oidc.userInfo));
    } else {
      expect(actualLocationObjKeys.userInfo).to.have.all.keys(Object.keys(nodeAppDataModels.getUserDetails_oauth().userInfo));
    }
  });

  // it('api/user/details role-assignment case allocator *****(to be enabled: localtionInfo on access-management integration)****', async () => {

  //   const matchingUsers = testUsers.users['aat'].filter(user => user.userIdentifier === 'IAC_Judge_WA_R2_CaseAllocator');
  //   if (matchingUsers.length === 0){
  //     throw new Error(`Users details with identfier "IAC_Judge_WA_R2_CaseAllocator" not found in test user config`);
  //   }

  //   await Request.withSession(matchingUsers[0].email, 'Welcome01');

  //   const response = await Request.get('api/user/details', null, 200);
  //   expect(response.status).to.equal(200);
  //   const actualLocationObjKeys = response.data;
  //   const expectedUserDetailsObj_oidc = nodeAppDataModels.getUserDetails_oidc();
  //   expect(actualLocationObjKeys).to.have.all.keys(Object.keys(expectedUserDetailsObj_oidc));

  //   expect(actualLocationObjKeys.roleAssignmentInfo[0].isCaseAllocator).to.be.true;

  // });

  it('api/user/details without session', async () => {
    await Request.get('api/user/details', null, 401);
  });


  it('api/configuration?configurationKey=xxx', async () => {
    await Request.withSession(userName, password);
    const response = await Request.get('api/configuration?configurationKey=termsAndConditionsEnabled', null, 200);
    console.log(response.data);

    expect(JSON.stringify(response.data)).to.have.lengthOf.below(6);
  });


});
