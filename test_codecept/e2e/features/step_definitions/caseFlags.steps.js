const browser = require("../../../codeceptCommon/browser")
const moment = require('moment')
const browserWaits = require('../../support/customWaits')
const reportLogger = require('../../../codeceptCommon/reportLogger')
const workflow = require('../pageObjects/caseFlags/caseFlagsWorkflow')
const caseSetup = require('../pageObjects/caseFlags/caseSetUp')

const reviewDetailsPage = require('../pageObjects/caseFlags/reviewDetailsPage')
const caseFlagsTabPage = require('../pageObjects/caseFlags/caseFlagsTabPage')

function getPageObject(page) {
    const pageObj = workflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(workflow.pages)}`)
    }
    return pageObj;
}


When('I setup a case for case flags version {string}', async function(version,datatable){
    await caseSetup.createCase(version, datatable.parse().hashes())
})

Then('I am on create case flags page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

Then('I am on manage case flags page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

Then('I am on create case flags, select flag type page {string}', async function (page) {
    workflow.addAndGetSelectFlagTypePage(page)
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

When('In create case flag workflow, I click Next', async function (page) {
    await workflow.nextButton.click();
})

When('In manage case flag workflow, I click Next', async function (page) {
    await workflow.nextButton.click();
})




Then('In create case flag page {string}, I validate fields displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    reportLogger.AddMessage(`Validating fields display:`)
    for (let row of datatablehashes) {
        if (!Object.keys(pageObj.fieldMapping).includes(row.field)) {
            throw new Error(`${row.field} not configured for page ${page}`)
        }
        await browserWaits.retryWithActionCallback(async () => {
            await browserWaits.waitForElement(pageObj.fieldMapping[row.field])
            expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} not displayed`).to.be.true
        })
        reportLogger.AddMessage(`${row.name} is displayed`)
    }

})

Then('In manage case flag page {string}, I validate fields displayed', async function (page, datatable) {
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

Then('In create case flag page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} is displayed`).to.be.false
        reportLogger.AddMessage(`${row.field} is not displayed`)
    }
})


When('In create case flag page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})

When('In manage case flag page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})



When('In create case flag work flow, I click submit request', async function () {
    await workflow.clickSubmitRequest()
})

When('In manage case flag work flow, I click submit request', async function () {
    await workflow.clickSubmitRequest()
})




Then('In create case flag workflow, I validate check your answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldWithValueDisplayed(row.field, row.value)
    }
})

Then('In create case flag workflow, I validate check your answers not displays fields', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldNotDisplayed(row.field)
    }
})


Then('In manage case flag workflow, I validate check your answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldWithValueDisplayed(row.field, row.value)
    }
})

Then('In manage case flag workflow, I validate check your answers not displays fields', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldNotDisplayed(row.field)
    }
})



Then('In create case flag workflow, I am on Review details page', async function () {
    expect(await reviewDetailsPage.container.isDisplayed()).to.be.true

})
Then('In manage case flag workflow, I am on Review details page', async function () {
    expect(await reviewDetailsPage.container.isDisplayed()).to.be.true

})


Then('In create case flag workflow, I validate Review details displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await reviewDetailsPage.validateSummaryFieldWithValueDisplayed(row.field, row.value, row.isChangeLinkDisplayed.includes('true'))
    }
})

Then('In manage case flag workflow, I validate Review details displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await reviewDetailsPage.validateSummaryFieldWithValueDisplayed(row.field, row.value, row.isChangeLinkDisplayed.includes('true'))
    }
})

When('In create case flag workflow, I click submit', async function () {
    await browserWaits.retryWithActionCallback(async () => {
        await element(by.xpath(`//button[contains(text(),'Submit')]`)).click()
        const caseDetailsPageContainer = $('ccd-case-full-access-view');
        await browserWaits.waitForElement(caseDetailsPageContainer);
    })
   
})

When('In manage case flag workflow, I click submit', async function () {
    await browserWaits.retryWithActionCallback(async () => {
        await element(by.xpath(`//button[contains(text(),'Submit')]`)).click()
        const caseDetailsPageContainer = $('ccd-case-full-access-view');
        await browserWaits.waitForElement(caseDetailsPageContainer);
    })
   
})

Then('I see case details page and I see case flags banner with message {string}', async function(message){
    const caseDetailsPageContainer = $('ccd-case-full-access-view');
    await browserWaits.waitForElement(caseDetailsPageContainer)
    const ele = $('ccd-notification-banner .govuk-notification-banner__content')
    expect(await ele.getText()).to.includes(message)
})  

Then('I see case details page and I dont see case flags banner', async function () {
    const caseDetailsPageContainer = $('ccd-case-full-access-view');
    await browserWaits.waitForElement(caseDetailsPageContainer)
    const ele = $('ccd-notification-banner .govuk-notification-banner__content')
    expect(await ele.isDisplayed()).to.be.false
})  


Then('I am on manage case update flag page {string}', async function (page) {
    workflow.addAndGetUpdateFlagPage(page)
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

Then('I validate case flags table for {string} has {int} flags', async function(tableFor, flagsCount){
    const caseFlagsTablePage = caseFlagsTabPage.getFlagTableFor(tableFor)
    if (flagsCount === 0){
        const tableDataNone = await caseFlagsTablePage.isTableDataNone();
        expect(tableDataNone, `Flags count for ${tableFor} does not match expected`).to.be.true
    }else{
        const tableData = await caseFlagsTablePage.getTableData();

        reportLogger.AddMessage(`Case flags displayed for ${tableFor} : ${JSON.stringify(tableData, null, 2)}`)
        expect(tableData.length, `Flags count for ${tableFor} does not match expected`).to.equal(flagsCount)

    }
   
})

Then('I validate case flags tab table data for {string}', async function(tableFor, datatable){

    const isCaseFlagPresent = (expectedCaseFlag, caseFlags) => {
        const expectedkeys = Object.keys(expectedCaseFlag)
        for(const actualFlag of caseFlags){
            actualFlag['Flag status'] = actualFlag['Flag status'].toUpperCase()
            const matchingFields = expectedkeys.filter(key => { 
                reportLogger.AddMessage(`${expectedCaseFlag[key]} === ${actualFlag[key] }`)
                return actualFlag[key].includes(expectedCaseFlag[key])
            })
            if (matchingFields.length === expectedkeys.length){
                return true;
            }
        }
        return false;
    }

    const expectedTableData = datatable.parse().hashes();
    const caseFlagsTablePage = caseFlagsTabPage.getFlagTableFor(tableFor)
    const tableData = await caseFlagsTablePage.getTableData();

    reportLogger.AddMessage(`Case flags displayed for ${tableFor} : ${JSON.stringify(tableData,null,2)}`)
    for (const expected of expectedTableData){
        if (expected['Creation date'] === 'today'){
            expected['Creation date'] = moment().format('DD MMM YYYY')
        }
        if (expected['Last modified'] === 'today') {
            expected['Last modified'] = moment().format('DD MMM YYYY')
        }

        expect(isCaseFlagPresent(expected, tableData),`Case flag not displayed ${JSON.stringify(expected, null,2)}`).to.be.true
        
    }
    reportLogger.AddMessage(`Table data : ${JSON.stringify(tableData, null,2)}`)

})


