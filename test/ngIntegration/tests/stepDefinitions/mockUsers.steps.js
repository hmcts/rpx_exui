var { defineSupportCode } = require('cucumber');

const MockApp = require('../../../nodeMock/app');

const caseEditPage = require('../pageObjects/ccdCaseEditPages');

const browserUtil = require('../../util/browserUtil');
const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../e2e/support/reportLogger');
const dummyCaseDetails = require('../../../nodeMock/ccd/caseDetails_data');

const headerpage = require('../../../e2e/features/pageObjects/headerPage');
const workAlloctionMockData = require('../../../nodeMock/workAllocation/mockData');

const { getTestJurisdiction, getMockJurisdictionWorkbaseketConfig, getMockJurisdictionSearchInputConfig } = require('../../mockData/ccdCaseMock');
const getEventConfig = require('../../mockData/ccdMockEventConfigs');

defineSupportCode(function ({ And, But, Given, Then, When }) {
  Given('I set MOCK case workers', async function(datatable){
    const dtHashes = datatable.hashes();
    let i = 0;
    for (const hash of dtHashes){
      for(const key of Object.keys(hash)){
        workAlloctionMockData.caseWorkersList[i][key] = hash[key];
      }
      i++;
    }
  });

  Given('I set MOCK caseworkers for service {string}', async function (service, datatable) {
    // step definition code here
    const datatableHashes = datatable.hashes();
    for (const userhash of datatableHashes) {
      workAlloctionMockData.addCaseworker(userhash, service);
    }
  });

  Given('I set MOCK caseworkers for service {string}, base location', async function (service, datatable) {
    // step definition code here
    const datatableHashes = datatable.hashes();
    for (const row of datatableHashes) {
      workAlloctionMockData.setLocationForCaseWorkers(service, row.email, row.locationId);
    }
  });

  Given('I add MOCK judicial user', async function (datatable) {
    const dtHashes = datatable.hashes();
    for (const hash of dtHashes) {
      workAlloctionMockData.addJudgeUsers(hash.idamId, hash.firstName, hash.lastName, hash.email);
    }
  });
});
