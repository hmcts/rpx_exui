

const hearingActualsPage = require('.././../pageObjects/hearings/hearingActualsPage')
const browserWaits = require('../../../support/customWaits')

Then('I see hearing actuals page', async function () {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await hearingActualsPage.container.isDisplayed()).to.be.true
    })
})


Then('I see hearing actuals page with details', async function (datatable) {
    const details = datatable.parse().hashes();
    for (const row of details) {
        const expectedField = row.field;
        const expectedValue = row.value

        const expectedFieldEle = element(by.xpath(hearingActualsPage.getTableKeyElementXpath(expectedField)))
        const expectedValueEle = element(by.xpath(hearingActualsPage.getTableValueElementXpath(expectedField)))

        await browserWaits.retryWithActionCallback(async () => {
            expect(await expectedFieldEle.isDisplayed()).to.be.true
            expect(await expectedValueEle.getText()).to.includes(expectedValue)

        })
       

    }
})

Then('I validate hearing actuals details in CYA', async function (datatable){
    const details = datatable.parse().hashes();
    for (const row of details) {
        const expectedField = row.field;
        const expectedValue = row.value

        const expectedFieldEle = element(by.xpath(hearingActualsPage.getTableKeyElementXpath(expectedField)))
        const expectedValueEle = element(by.xpath(hearingActualsPage.getTableValueElementXpath(expectedField)))

        await browserWaits.retryWithActionCallback(async () => {
            expect(await expectedFieldEle.isDisplayed()).to.be.true
            expect(await expectedValueEle.getText()).to.includes(expectedValue)

        })


    }
})



Then('I see hearing actuals update link', async function () {
    expect(await hearingActualsPage.hearingStageAndResultUpdateLink.isDisplayed()).to.be.true
})


When('I click hearing actuals update link', async function () {
    await hearingActualsPage.hearingStageAndResultUpdateLink.click()
})


Then('In hearing actuals page, I click continue', async function () {
    await hearingActualsPage.continueBtn.click()
})


Then('I am hearing actuals check your answers page', async function () {
    expect(await hearingActualsPage.checkYourAnswersHeader.isDisplayed()).to.be.true
})


When('I click Submit hearing details button in hearing actuals CYA', async function () {
    await hearingActualsPage.submitBtn.click()
})

