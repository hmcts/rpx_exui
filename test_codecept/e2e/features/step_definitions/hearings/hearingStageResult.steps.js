
const hearingStageAndResultUpdatePage = require('../../pageObjects/hearings/editHearingStageAndResultPage')

Then('I see Hearing stage and result update page', async function(){
    expect(await hearingStageAndResultUpdatePage.container.isDisplayed()).to.be.true
})


When('In Hearing stage and result page, I set {string} to {string}', async function (field,value) {
    switch (field){
        case "Hearing stage":
            await hearingStageAndResultUpdatePage.selectHearingStage(value)
            break;
        case "Hearing result":
            await hearingStageAndResultUpdatePage.selectHearingResult(value)
            break;
        default:
            throw new Error(`Unknown field ${field}`)
    }
})

When('In Hearing stage and result update page, click save and continue', async function () {
    await hearingStageAndResultUpdatePage.saveAndContinueButton.click()
})


