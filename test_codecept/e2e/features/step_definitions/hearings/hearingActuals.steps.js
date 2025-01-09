

const hearingActualsPage = require('../../pageObjects/hearings/hearingActualsPage')
const browserWaits = require('../../../support/customWaits')
const hearingStartFinishTimesPage = require('../../pageObjects/hearings/hearingStartAndFinishTimesPage')

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
    await browserWaits.retryWithActionCallback(async () => {
        expect(await hearingActualsPage.checkYourAnswersHeader.isDisplayed()).to.be.true
    })
})


When('I click Submit hearing details button in hearing actuals CYA', async function () {
    await hearingActualsPage.submitBtn.click()
})



When('In hearing actual, I see hearings for date {string}', async function (hearingDate) {
    const hearingDateObj = hearingActualsPage.getHearingDateObject(hearingDate)

    await browserWaits.waitForElement(element(by.xpath(hearingDateObj.hearingDateDetailsSummary)))
    expect(await hearingDateObj.isDisplayed()).to.be.true
})


When('In hearing actual, I click hearing date {string}', async function (hearingDate) {
    const hearingDateObj = hearingActualsPage.getHearingDateObject(hearingDate)
    await hearingDateObj.clickHearingSummary()
})


Then('In hearing actuals, hearing date {string} displayed with values and actions', async function (hearingDate, datatable) {

    const hearingDateObj = hearingActualsPage.getHearingDateObject(hearingDate)
    expect(await hearingDateObj.isDisplayed(), `Hearing actuals for date ${hearingDate} not displayed`).to.be.true

    const rows = datatable.parse().hashes();

    for(const row of rows){
        const field = row.field;
        const value = row.value;
        const actions = row.actions.split(',')

        let actualValue = await hearingDateObj.getValue(field)
        if(value === ''){
            expect(actualValue, ` ${field} Expected value ${value} did not match actual ${actualValue}`).to.equal('')
        }else{
            expect(actualValue, `${field} Expected value ${value} did not match actual ${actualValue}`).to.includes(value)
        }

        const actualActions = await hearingDateObj.getActions(field)

        for (const action of actions){
            expect(actualActions, `Expected action ${action} not present in actual actions ${actualActions}`).to.includes(action)
        }

    }

})


When('In hearing actual for date {string}, I click action link {string} for field {string}', async function (hearingDate, actionLink, field) {
    const hearingDateObj = hearingActualsPage.getHearingDateObject(hearingDate)
    expect(await hearingDateObj.isDisplayed(), `Hearing actuals for date ${hearingDate} not displayed`).to.be.true

    await hearingDateObj.clickAction(field, actionLink )
})

Then('In hearing actuals, I see hearing start and finsih times page', async function(){
    expect(await hearingStartFinishTimesPage.container.isDisplayed()).to.be.true
})


When('In hearing actuals start finish times page, I select radio option {string} for Do you need to record times the hearing was paused?', async function (option) {
    await hearingStartFinishTimesPage.selectRecordTimesRadioOption(option)
})



When('In hearing actuals start and finish times page I input values', async function(datatable){
    const rows = datatable.parse().hashes();
    for(const row of rows){
        const field = row.field
        const value = row.value
        await hearingStartFinishTimesPage.inputField(field, value)
    }
})

When('In hearing actuals start finish times page, I click save and continue', async function (option) {
    await hearingStartFinishTimesPage.saveAndContinueButton.click()
})

