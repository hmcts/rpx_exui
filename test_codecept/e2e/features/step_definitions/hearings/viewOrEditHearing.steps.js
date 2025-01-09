const browserWaits = require('../../../support/customWaits')
const viewOrEditHearingPage = require('../../pageObjects/hearings/viewOrEditHearingPage')
const editHearingPage = require('../../pageObjects/hearings/editHearingPage')

const reportLogger = require('../../../../codeceptCommon/reportLogger')

const createHearingWorkflow = require('../../pageObjects/hearings/createHearingWorkflow/createhearingWorkflow')


function getPageObject(page) {
    const pageObj = createHearingWorkflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(createHearingWorkflow.pages)}`)
    }
    return pageObj;
}


Then('I validate view or edit hearing page displayed', async function(){
    await browserWaits.retryWithActionCallback(async () => {
        expect(await viewOrEditHearingPage.container.isDisplayed()).to.be.true
        expect(await viewOrEditHearingPage.headerElement.getText()).to.include('View or edit hearing')
    })
})

Then('I validate Edit hearing page displayed', async function () {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await editHearingPage.container.isDisplayed()).to.be.true
        expect(await editHearingPage.headerElement.getText()).to.include('Edit hearing')

    })
})


Then('I validate fields displayed in view or edit hearing page', async function (datatable) {
    const fields = datatable.parse().hashes()

    for(const row of fields){
        const field = row.field
        const expectedVal = row.value
        const expectedChangeLinkDisplayed = row.changeLinkDisplay
        const expectedAmendFlagDisplayed = row.amendedFlagDisplay
        const expectedAmendFlagDisplayed_preCR84 = row.amendedFlagDisplayed_preCR84

        reportLogger.AddMessage(`Validating: ${JSON.stringify(row)}`)
        expect(await viewOrEditHearingPage.isKeyFieldDisplayed(field)).to.be.true
        if (expectedChangeLinkDisplayed.includes('true')) {
            expect(await viewOrEditHearingPage.isChangeLinkDisplayedForKeyField(field)).to.be.true
        } else {
            expect(await viewOrEditHearingPage.isChangeLinkDisplayedForKeyField(field)).to.be.false
        }

        const values = await viewOrEditHearingPage.getKeyFieldValue(field);
        const isValueDisplayed = values.find(v => v.includes(expectedVal))
        const actualValue = values.find(v => v.includes(expectedVal) )
        expect(actualValue, `Field:${field}  ${expectedAmendFlagDisplayed} not displayed in ${actualValue} `).to.not.equal(undefined)

        if (expectedAmendFlagDisplayed && expectedAmendFlagDisplayed !== '') {
            expect(actualValue, `Field:${field} to include label AMENDED actual ${expectedAmendFlagDisplayed}`).to.includes(expectedAmendFlagDisplayed)
        } else if (expectedAmendFlagDisplayed_preCR84 && expectedAmendFlagDisplayed_preCR84 !== ''){
            const actionColText = await viewOrEditHearingPage.getActionColumnTextForKeyField(field);
            expect(actionColText.toLowerCase()).includes(expectedAmendFlagDisplayed_preCR84.toLowerCase())
        } else if (expectedAmendFlagDisplayed_preCR84 && expectedAmendFlagDisplayed_preCR84 === '') {
            expect(await viewOrEditHearingPage.getActionColumnTextForKeyField(field)).to.not.includes('AMENDED')
        } else {
            expect(actualValue, `Field:${field} to not include label AMENDED actual ${expectedAmendFlagDisplayed}`).to.not.includes('AMENDED')
            expect(actualValue, `Field:${field} to not include label AMENDED actual ${expectedAmendFlagDisplayed}`).to.not.includes('ACTION NEEDED')
        }

        expect(isValueDisplayed !== undefined, `Field:${field} to include value ${expectedVal} not found`).to.be.true
        expect(isValueDisplayed, `Field:${field} to include value ${expectedVal} actual ${values}`).to.include(expectedVal)

    }
})

Then('I validate edit hearing section heading labels', async function (datatable){
    const fields = datatable.parse().hashes()
    for(const row of fields){
        const heading = row.Heading
        const expectedLabel = row.Label
        await browserWaits.retryWithActionCallback(async () => {
            const actualLabel = await viewOrEditHearingPage.getSectionHeadingLabel(heading)
            if (expectedLabel === '') {
                expect(actualLabel, `${heading} expected no label, actual displayed ${actualLabel}`).to.equal('')
            } else {
                expect(actualLabel, `${heading} expected label did not match`).to.includes(expectedLabel)
            }
        })

    }
})

When('In view or edit hearing page, I click change link for field {string}', async function(field){
    await viewOrEditHearingPage.clickChangeLinkForField(field)
})

When('In view or edit hearing page, I click Submit updated request', async function (field) {
    await viewOrEditHearingPage.s(field)
})


Then('I validate edit heating change links and navigation', async function(datatable){
    const validationPages = datatable.parse().hashes()
    let ctr = 0;
    for (const validationPage of validationPages){
        ctr++;
        const changeLinkFor = validationPage.changeLinkFor
        const navigationPage = validationPage.navigationPage
        const pageHeader = validationPage.pageHeader
        reportLogger.AddMessage(`************** ${ctr}: Validation of ${changeLinkFor}, ${navigationPage}`)

        await browserWaits.retryWithActionCallback(async () => {
            await viewOrEditHearingPage.clickChangeLinkForField(changeLinkFor)

            const navigationPageObject = getPageObject(navigationPage);
            await browserWaits.retryWithActionCallback(async () => {
                expect(await navigationPageObject.isDisplayed(), `For change link ${changeLinkFor}, ${navigationPage} not displayed`).to.be.true
            });

            const actualheaderCaption = await $('span.govuk-caption-l').getText()
            reportLogger.AddMessage(`page header expected ${pageHeader}, actual ${actualheaderCaption}`)
            expect(actualheaderCaption).to.includes(pageHeader)
        })
        await createHearingWorkflow.continueBtn.click();
    }


})


Then('In edit hearing page warning message banner isDisplayed {string}', async function (boolVal) {
    if (boolVal.toLowerCase().includes('true')) {
        expect(await editHearingPage.isWarningTextBannerDisplayed()).to.be.true
    } else {
        expect(await editHearingPage.isWarningTextBannerDisplayed()).to.be.false
    }

})

Then('In edit hearing page warning message banner contains {string}', async function (warning) {
    expect(await editHearingPage.getWarningBanerText()).to.includes(warning)
})


Then('In edit hearing page error banner displayed with message {string}', async function (errorMessage) {
    expect(await editHearingPage.getErrorSummary()).to.includes(errorMessage)
})

Then('In edit hearing page error displayed with message {string}', async function (errorMessage) {
    expect(await editHearingPage.errorMessage.getText()).to.includes(errorMessage)
})



