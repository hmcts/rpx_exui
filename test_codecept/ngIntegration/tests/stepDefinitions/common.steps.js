var { defineSupportCode } = require('cucumber');

// const MockApp = require('../../../nodeMock/app');

const caseListPage = require('../pageObjects/caselistPage');

const browserUtil = require('../../util/browserUtil');
// const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../codeceptCommon/reportLogger');
const BrowserWaits = require('../../../e2e/support/customWaits');
const headerpage = require('../../../e2e/features/pageObjects/headerPage');

const serviceMock = require('../../../backendMock/client/serviceMock')

const { getTestJurisdiction } = require('../../mockData/ccdCaseMock');

// const ccdApi = require('../../../nodeMock/ccd/ccdApi');


    Given('I reload app if {string}', async function(isReadRequired){
        if (isReadRequired.toLowerCase().includes("yes") || isReadRequired.toLowerCase().includes("true")){
            await browserUtil.gotoHomePage();
            await BrowserWaits.retryWithActionCallback(async () => {
                await headerpage.waitForPrimaryNavDisplay();
                await browserUtil.waitForLD();
            });
        }

    });

    Then('I validate session storage has key {string}', async function(key){
        await BrowserWaits.retryWithActionCallback(async () => {
            const sessionStorageVal = await browserUtil.getFromSessionStorage(key);
            expect(sessionStorageVal !== null && sessionStorageVal !== undefined, `Session stoarge does not have ${key} key ${sessionStorageVal}`).to.be.true;
        });

    });



      Given('I set error response code {int} on api method {string}', async function(responseCode, apiMethod){
          await serviceMock.updateMockServer(apiMethod, {
            status: responseCode, data: {}
          })

    });

    Given('I captured {string} request body from mock', async function(apiMethod){
        const requestObj = await serviceMock.getRequestBodyForApiMethod(apiMethod)
        global.scenarioData[apiMethod] = requestObj.data
    })

    When('I navigate to url {string}', async function(url){
        await browser.get(url)
    })
