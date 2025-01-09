

class HearingActualsPage{

    constructor(){
        this.container = $('exui-hearing-actuals')
        this.hearinsgSummaryContainer = $('exui-hearing-actuals-add-edit-summary .govuk-summary-list');

        this.hearingStageAndResultUpdateLink = $('#hearing-stage-result-update-link');

        this.continueBtn = element(by.xpath(`//button[contains(text(),'Continue')]`))
        this.submitBtn = element(by.xpath(`//button[contains(text(),'Submit hearing details')]`))

        this.checkYourAnswersHeader = element(by.xpath(`//exui-hearing-actuals//h1[contains(text(),'Check your answers')]`))
    }

    getTableKeyElementXpath(key){
        return `//dt[contains(@class,'govuk-summary-list__key')][contains(text(),'${key}')]`
    }

    getTableValueElementXpath(forKey){
        const keyElement = this.getTableKeyElementXpath(forKey)
        return `${keyElement}/../dd`
    }

    async isFieldDisplayed(forKey){
        const e = element(by.xpath(this.getTableKeyElementXpath(forKey)))
        return e.isDisplayed();
    }

    async getValueForField(forKey) {
        const e = element(by.xpath(this.getTableValueElementXpath(forKey)))
        return e.getText();
    }

    getHearingDateObject(hearingDate){
        return new ActualHearingDate(hearingDate)
    }

}


class ActualHearingDate{

    constructor(hearingDate){
        this.hearingDateDetailsSummary = `//div[@id='actual-hearing-dates']//summary//div[contains(text(),'${hearingDate}')]/..`
        
        this.hearingDateDetailsContainer = `${this.hearingDateDetailsSummary}/..`

        this.headingRows = [
            'Hearing timings',
            'Participants'
        ]

    }

    async clickHearingSummary(){
        await await element(by.xpath(this.hearingDateDetailsSummary)).click()
    }

    async isDisplayed(){
        return await element(by.xpath(this.hearingDateDetailsSummary)).isDisplayed()
    }

    async getSummaryText(){
        return await element(by.xpath(this.hearingDateDetailsSummary)).getText()
    }

    async getValue(field){
        
        const fieldEleXpath = this.headingRows.includes(field)  ? 
            `${this.hearingDateDetailsContainer}//dt//span[contains(text(),'${field}')]` :
            `${this.hearingDateDetailsContainer}//dt[contains(text(),'${field}')]`;
        const valueEleXpath = this.headingRows.includes(field) ?
            `${fieldEleXpath}/../../dd[contains(@class,'govuk-summary-list__value')]` :
            `${fieldEleXpath}/../dd[contains(@class,'govuk-summary-list__value')]`;
        
        expect(await element(by.xpath(fieldEleXpath)).isDisplayed(),`${field} not displayed`).to.be.true
        return await element(by.xpath(valueEleXpath)).getText();
    }

    async clickAction(field, action) {
        const fieldEleXpath = this.headingRows.includes(field) ?
            `${this.hearingDateDetailsContainer}//dt//span[contains(text(),'${field}')]` :
            `${this.hearingDateDetailsContainer}//dt[contains(text(),'${field}')]`;
        const actionEleXpath = this.headingRows.includes(field) ?
            `${fieldEleXpath}/../../dd[contains(@class,'govuk-summary-list__actions')]/a[contains(text(),'${action}')]` :
            `${fieldEleXpath}/../dd[contains(@class,'govuk-summary-list__actions')]/a[contains(text(),'${action}')]`;

        expect(await element(by.xpath(fieldEleXpath)).isDisplayed()).to.be.true
        await element(by.xpath(actionEleXpath)).click();
    }

    async getActions(field) {
        const fieldEleXpath = this.headingRows.includes(field) ?
            `${this.hearingDateDetailsContainer}//dt//span[contains(text(),'${field}')]` :
            `${this.hearingDateDetailsContainer}//dt[contains(text(),'${field}')]`;
        const actionEleXpath = this.headingRows.includes(field) ?
            `${fieldEleXpath}/../../dd[contains(@class,'govuk-summary-list__actions')]` :
            `${fieldEleXpath}/../dd[contains(@class,'govuk-summary-list__actions')]`;

        expect(await element(by.xpath(fieldEleXpath)).isDisplayed()).to.be.true
        return await element(by.xpath(actionEleXpath)).getText();
    }



}

module.exports = new HearingActualsPage()


