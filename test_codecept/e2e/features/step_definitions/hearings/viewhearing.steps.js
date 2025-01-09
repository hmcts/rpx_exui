const browserWaits = require('../../../support/customWaits')
const viewHearingPage = require('../../pageObjects/hearings/viewhearingPage')
const reportLogger = require('../../../../codeceptCommon/reportLogger')

Then('I validate view hearing page displayed', async function () {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await viewHearingPage.container.isDisplayed()).to.be.true
    })
})

Then('I validate view hearing page Edit hearing button displayed is {string}', async function (displayBool) {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await viewHearingPage.editHearingBtn.isDisplayed()).to.equal(displayBool.toLowerCase().includes('true'))
    })
})



Then('I validate fields displayed in view hearing page', async function (datatable) {
    const fields = datatable.parse().hashes()

    for (const row of fields) {
        const field = row.field
        const expectedVal = row.value
        const expectedChangeLinkDisplayed = row.changeLinkDisplay
        const expectedAmendFlagDisplayed = row.amendedFlagDisplay

        reportLogger.AddMessage(`Validating: ${JSON.stringify(row)}`)
        expect(await viewHearingPage.isKeyFieldDisplayed(field)).to.be.true
        expect(await viewHearingPage.getKeyFieldValue(field)).to.includes(expectedVal)
        if (expectedChangeLinkDisplayed.includes('true')) {
            expect(await viewHearingPage.isChangeLinkDisplayedForKeyField(field)).to.be.true
        } else {
            expect(await viewHearingPage.isChangeLinkDisplayedForKeyField(field)).to.be.false
        }

        if (expectedAmendFlagDisplayed.includes('true')) {
            expect(await viewHearingPage.isAmendedFlagDisplayedForKeyField(field)).to.be.true
        } else {
            expect(await viewHearingPage.isAmendedFlagDisplayedForKeyField(field)).to.be.false
        }


    }
})

When('In view hearing page, I click Edit hearing button', async function () {
    await viewHearingPage.editHearingBtn.click()
})



