

class EditHearingStageAndResultPage{

    constructor(){
        this.container = $('exui-hearing-stage-result');

        this.hearingStageSelect = $('#hearing-stage')
        this.hearingResultRadios = element(by.xpath('//h1[contains(text(),"Hearing result")]/../../div[contains(@class,"govuk-radios")]'))

        this.saveAndContinueButton = element(by.xpath(`//button[contains(text(),'Save and continue')]`))
    }

    async selectHearingStage(stage){
        await this.hearingStageSelect.select(stage)
    }

    async selectHearingResult(result){
        const e = element(by.xpath(`//h1[contains(text(),'Hearing result')]/../..//label[contains(text(),'${result}')]/../input`))
        await e.click()
    }




}

module.exports = new EditHearingStageAndResultPage()
