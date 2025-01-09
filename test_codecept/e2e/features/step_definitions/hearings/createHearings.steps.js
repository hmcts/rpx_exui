
const createHearingWorkflow = require('../../pageObjects/hearings/createHearingWorkflow/createhearingWorkflow')
const reportLogger = require('../../../../codeceptCommon/reportLogger')

const browserWaits = require('../../../support/customWaits')

function getPageObject(page){
    const pageObj = createHearingWorkflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(createHearingWorkflow.pages)}`)
    }
    return pageObj;
}

When('I click continue in create hearing workflow', async function(){
    await createHearingWorkflow.continueBtn.click();
})

When('I click continue in hearing workflow', async function () {
    await createHearingWorkflow.continueBtn.click();
})

async function verifyOnHearingPage(page){
    await browserWaits.retryWithActionCallback(async () => {
        expect(await getPageObject(page).isDisplayed(), `${page} not displayed`).to.be.true
    })
}

Then('I am on create hearing page {string}', async function(page){
    await verifyOnHearingPage(page)
})

Then('I am on hearing page {string}', async function (page) {
    await verifyOnHearingPage(page)
    await browserWaits.retryWithActionCallback(async () => {
        expect(await getPageObject(page).isDisplayed(), `${page} not displayed`).to.be.true
    })
})

Then('In create hearing page {string}, I validate fields displayed', async function(page, datatable){
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    reportLogger.AddMessage(`Validating fields display:`)
    for (let row of datatablehashes){
        expect(await pageObj.fieldMapping[row.name].isDisplayed(), `${row.name} not displayed`).to.be.true
        reportLogger.AddMessage(`${row.name} is displayed`)
    }

})

Then('In create hearing page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.name].isDisplayed(), `${row.name} is displayed`).to.be.false
        reportLogger.AddMessage(`${row.name} is not displayed`)
    }
})

async function inputValuesInPage(page, datatable){
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
}

When('In create hearing page {string}, I input values', async function(page, datatable){
    await inputValuesInPage(page, datatable)
})


When('In hearing page {string}, I input values', async function (page, datatable) {
    await inputValuesInPage(page, datatable)
})

When('In hearing page {string}, I input values and click continue', async function (page, datatable) {
    await browserWaits.retryWithActionCallback(async () => {
        await inputValuesInPage(page, datatable);
        await createHearingWorkflow.continueBtn.click();
        await browserWaits.waitForElement($('exui-hearing-edit-summary,exui-hearing-view-edit-summary'));
    });
})



When('In create hearing work flow, I click submit request', async function (page, datatable) {
    await createHearingWorkflow.clickSubmitRequest()
})


When('In hearing work flow, I click submit request', async function (page, datatable) {
    await createHearingWorkflow.clickSubmitRequest()
})


Then('In create hearing workflow, I validate check yoor answers displayed', async function(datatable){
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash){
        reportLogger.AddMessage(`Validating ${row.section} => ${row.field}=${row.value}`)
        await createHearingWorkflow.pages["Check your answers before sending your request"].validateSummaryFieldWithValueDisplayed(row.section,row.field,row.value)
    }
})

When('In create hearing work flow, I click back link', async function () {
    await createHearingWorkflow.backLink.click();
})


When('In create hearing check your answers page, I click change link for field {string}', async function (field) {
    await createHearingWorkflow.pages['Check your answers before sending your request'].clickChangeLinkForField(field)
})






