

class HearingStartAndFinishTimesPage {

    constructor() {
        this.container = $('exui-hearing-actuals-timing');

        this.hearingStageSelect = $('#hearing-stage')
        this.hearingResultRadios = element(by.xpath('//h1[contains(text(),"Hearing result")]/../../div[contains(@class,"govuk-radios")]'))

        this.saveAndContinueButton = element(by.xpath(`//button[contains(text(),'Save and continue')]`))
    }

    getTimeInputFieldElement(fieldName){
        return element(by.xpath(`//label[contains(text(),'${fieldName}')]/../input`))
    }

    async isInputFieldDisplayed(fieldName){
        return await this.getTimeInputFieldElement(fieldName).isDisplayed();
    }

    async inputField(fieldName, value) {
        await this.getTimeInputFieldElement(fieldName).sendKeys(value);
    }

    async selectRecordTimesRadioOption(value){
        await element(by.xpath(`//div[contains(@id,'recordTimes')]//label[contains(text(),'${value}')]/../input`)).click();
    }




}

module.exports = new HearingStartAndFinishTimesPage()
