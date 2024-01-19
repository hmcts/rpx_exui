

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


}

module.exports = new HearingActualsPage()


