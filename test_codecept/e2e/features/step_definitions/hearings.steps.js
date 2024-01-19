
const CucumberReportLogger = require('../../../codeceptCommon/reportLogger');

const BrowserWaits = require("../../support/customWaits");
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const browserUtil = require('../../../ngIntegration/util/browserUtil');

const { DataTableArgument } = require('codeceptjs');


const hearingTabPage = require('../pageObjects/hearings/hearingsTabPage')
const createHearingWorkflow = require('../pageObjects/hearings/createHearingWorkflow/createhearingWorkflow')

Then('I see hearings tab displayed', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
        expect(await hearingTabPage.isHearingsTabDisplayed()).to.be.true
    })
});

Then('I see Request a hearing button in hearings tab page', async function () {
    expect(await hearingTabPage.requesthearingBtn.isDisplayed()).to.be.true
});

Then('I do not see Request a hearing button in hearings tab page', async function () {
    expect(await hearingTabPage.requesthearingBtn.isDisplayed()).to.be.false
});

When('I click Request a hearing button', async function(){
    await hearingTabPage.requesthearingBtn.click()
});

Then('I see create hearing workflow container', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
        expect(await createHearingWorkflow.isCreateHearingWorkflowDIsplayed()).to.be.true
    })
});

Then('I see hearing details success confirmation message {string}', async function(message){
    const ele = $('.govuk-panel--confirmation')
    expect(await ele.getText()).to.includes(message)
})
