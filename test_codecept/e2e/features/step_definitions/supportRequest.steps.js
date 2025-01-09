const browser = require("../../../codeceptCommon/browser")
const browserWaits = require('../../support/customWaits')
const reportLogger = require('../../../codeceptCommon/reportLogger')
const workflow = require('../pageObjects/caseFlags/caseFlagsWorkflow')
const caseSetup = require('../pageObjects/caseFlags/caseSetUp')

const reviewDetailsPage = require('../pageObjects/caseFlags/reviewDetailsPage')

function getPageObject(page) {
    const pageObj = workflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(workflow.pages)}`)
    }
    return pageObj;
}

Then('I am on create support request page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

Then('I am on manage support request page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.retryWithActionCallback(async () => {
        await browserWaits.waitForElement(pageObj.container)
        expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
    })
})

Then('I am on create support request, select support type page {string}', async function (page) {
    workflow.addAndGetSelectFlagTypePage(page)
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

When('In create support request workflow, I click Next', async function (page) {
    await workflow.nextButton.click();
})

When('In manage support request workflow, I click Next', async function (page) {
    await workflow.nextButton.click();
})




Then('In create support request page {string}, I validate fields displayed', async function (page, datatable) {
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

Then('In manage support request page {string}, I validate fields displayed', async function (page, datatable) {
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

Then('In create support request page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} is displayed`).to.be.false
        reportLogger.AddMessage(`${row.field} is not displayed`)
    }
})


When('In create support request page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})

When('In manage support request page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})



When('In create support request work flow, I click submit request', async function () {
    await workflow.clickSubmitRequest()
})

When('In manage support request work flow, I click submit request', async function () {
    await workflow.clickSubmitRequest()
})




Then('In create support request workflow, I validate check your answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldWithValueDisplayed(row.field, row.value)
    }
})

Then('In create support request workflow, I validate check your answers not displays fields', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldNotDisplayed(row.field)
    }
})


Then('In manage support request workflow, I validate check your answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldWithValueDisplayed(row.field, row.value)
    }
})

Then('In manage support request workflow, I validate check your answers not displays fields', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}`)
        await workflow.pages["Check your answers before you register"].validateSummaryFieldNotDisplayed(row.field)
    }
})



Then('In create support request workflow, I am on Review details page', async function () {
    expect(await reviewDetailsPage.container.isDisplayed()).to.be.true

})
Then('In manage support request workflow, I am on Review details page', async function () {
    expect(await reviewDetailsPage.container.isDisplayed()).to.be.true

})


Then('In create support request workflow, I validate Review details displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await reviewDetailsPage.validateSummaryFieldWithValueDisplayed(row.field, row.value, row.isChangeLinkDisplayed.includes('true'))
    }
})

Then('In manage support request workflow, I validate Review details displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.field}=${row.value}`)
        await reviewDetailsPage.validateSummaryFieldWithValueDisplayed(row.field, row.value, row.isChangeLinkDisplayed.includes('true'))
    }
})

When('In create support request workflow, I click submit', async function () {
    await element(by.xpath(`//button[contains(text(),'Submit')]`)).click()
})

When('In manage support request workflow, I click submit', async function () {
    await element(by.xpath(`//button[contains(text(),'Submit')]`)).click()
})


Then('I am on manage case update flag page {string}', async function (page) {
    workflow.addAndGetUpdateFlagPage(page)
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})


