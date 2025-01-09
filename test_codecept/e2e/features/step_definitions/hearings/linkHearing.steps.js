
const linkHearingWorkflowPage = require('../../pageObjects/hearings/linkHearingWorkflowPage')
const browserWaits = require('../../../support/customWaits')

Then('I am on linked hearing page {string}', async function(page){
    await browserWaits.retryWithActionCallback(async () => {
        expect(await linkHearingWorkflowPage.pages[page].isDisplayed()).to.be.true
    })
})

When('In link hearing page I select case hearings', async function(datatable){
    const caseHearings = datatable.parse().hashes();

    for (const hearing of caseHearings){
        await linkHearingWorkflowPage.selectCaseHearing(hearing.caseReference, hearing.hearing)
    }
})

When('In link hearing workflow I click continue button', async function(){
    await linkHearingWorkflowPage.continueButton.click()
})

When('In link hearing workflow I click Link hearings button', async function () {
    await linkHearingWorkflowPage.linkHearingsBtn.click()
})


When('In link hearing How should these linked hearings be heard? page, I select option {string}', async function (option) {
    await linkHearingWorkflowPage.selectRadioOptionHowLinked(option)
})
When('In link hearing How should these linked hearings be heard? page, I select case hearing order', async function (datatable) {
    const cases = datatable.parse().hashes();
    for(const caseRef of cases){
        const caseId = caseRef.caseReference
        const pos = caseRef.position
        await linkHearingWorkflowPage.selectHearingOrder(caseId, pos)
    }
})

Then('I see link hearings confirmatin page with message {string}', async function(message){
    await browserWaits.retryWithActionCallback(async () => {
        expect(await linkHearingWorkflowPage.confirmationBanner.isDisplayed()).to.be.true
        expect(await linkHearingWorkflowPage.confirmationBanner.getText()).to.includes(message)
    })

})

