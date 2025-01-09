var { defineSupportCode } = require('cucumber');

const MockApp = require('../../../../nodeMock/app');
const workAllocationMockData = require('../../../mockData/workAllocation/mockData');

const BrowserWaits = require('../../../../e2e/support/customWaits');
const WACasesTable = require('../../../../e2e/features/pageObjects/workAllocation/casesTable');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');

const SoftAssert = require('../../../util/softAssert');
;
const CucumberReporter = require('../../../../codeceptCommon/reportLogger');
const browserUtil = require('../../../util/browserUtil');

const waMockData = require('../../../mockData/workAllocation/mockData');

const ArrayUtil = require("../../../../e2e/utils/ArrayUtil");

const { DataTableArgument } = require('codeceptjs');

    const waCasesTable = new WACasesTable();



    const taskApiMockService = require('../../../../backendMock/services/task-management-api/index')


    Given('I set MOCK task required for event as {string}', async function (isTaskRequired) {

        taskApiMockService.setTaskRequiredForEventAs(isTaskRequired.includes("true"));
    });

    Given('I set MOCK tasks required for event', async function (tasksDatatable) {
        await taskApiMockService.setTaskRequiredForEventTasks(tasksDatatable.parse().hashes());
    });

    When('I complete and submit test event {string}', async function(eventId){
        const continueBtn = $(`ccd-case-edit-page button[type='submit']`);
        const submitBtn = $(`ccd-case-edit-submit button[type='submit']`);
        if (eventId === 'text') {
            await BrowserWaits.retryWithActionCallback(async () => {
                await BrowserWaits.waitForElement(continueBtn);
                await continueBtn.click();
            });

            await BrowserWaits.retryWithActionCallback(async () => {
                await BrowserWaits.waitForElement(submitBtn);
                await submitBtn.click();
            });

        }
        
    });

    Given('I set MOCK task details', async function(datatable){
        const taskRow = datatable.parse().rowsHash();
        waMockData.setTaskDetails(taskRow); 
    });
