const moment = require('moment')
const browserWaits = require('../../../support/customWaits')
const reportLogger = require('../../../../codeceptCommon/reportLogger')
const workflow = require('../../pageObjects/caseAccessManagement/SARWorkflow')

function getPageObject(page) {
    const pageObj = workflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(workflow.pages)}`)
    }
    return pageObj;
}

Then('I am on SAR workflow page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})


When('In SAR workflow flag workflow, I click continue', async function () {
    await workflow.continueBtn.click();
})


When('In SAR workflow flag workflow, I click submit', async function () {
    await workflow.submitBtn.click();
})




Then('In SAR workflow page {string}, I validate fields displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    reportLogger.AddMessage(`Validating fields display:`)
    for (let row of datatablehashes) {
        if (!Object.keys(pageObj.fieldMapping).includes(row.field)) {
            throw new Error(`${row.field} not configured for page ${page}`)
        }
        await browserWaits.retryWithActionCallback(async () => {
            expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} not displayed`).to.be.true
        })
        reportLogger.AddMessage(`${row.name} is displayed`)
    }

})

Then('In SAR workflow page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} is displayed`).to.be.false
        reportLogger.AddMessage(`${row.field} is not displayed`)
    }
})


When('In SAR workflow page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValues(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})


When('In SAR workflow, I click submit request', async function () {
    await workflow.clickSubmitRequest()
})


Then('In SAR workflow, I validate check your answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldWithValueDisplayed(row.field, row.value)
    }
})

Then('In SAR workflow, I validate check your answers not displays fields', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldNotDisplayed(row.field)
    }
})

Then('In SAR workflow Review specific access page, I validate access request details', async function (datatable) {
    const pageObj = getPageObject('Review specific access request');
    const requestDetails = datatable.parse().rowsHash();
    await browserWaits.retryWithActionCallback(async () => {
        const actualRequestDetails = await pageObj.getAccessRequestDetails();
        const expectedRowHeaders = Object.keys(requestDetails);
        const actualRowHeaders = Object.keys(actualRequestDetails);
        expectedRowHeaders.forEach(expectedRowKey => {
            expect(actualRowHeaders, 'Missing request details row').to.includes(expectedRowKey);
            expect(actualRequestDetails[expectedRowKey], `${expectedRowKey} request details missmatch `).to.includes(requestDetails[expectedRowKey]);

        });


    });
});

Then('In SAR workflow, I see error message banner with message {string}', async function (message) {
    expect(await workflow.isErrorMessageDisplayed()).to.be.true
    expect(await workflow.getErrorMessageDisplayed()).to.includes(message)

})

Then('In SAR workflow, I see access approved page', async function(){
    const ele = element(by.xpath(`//exui-specific-access-approved//h1[contains(text(),'Access approved')]`))
    expect(await ele.isDisplayed()).to.be.true
})


Then('In SAR workflow, I see access Rejected page', async function () {
    const ele = element(by.xpath(`//exui-specific-access-approved//h1[contains(text(),'Access approved')]`))
    expect(await ele.isDisplayed()).to.be.true
})

Then('In SAR workflow page {string}, I validate access start and end fields fisplayed', async function(page){
    const pageObj = getPageObject(page);
    pageObj.validateAccessStartEndDisplayed()
})
