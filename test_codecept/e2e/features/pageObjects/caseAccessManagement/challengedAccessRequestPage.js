
class ChallengedAccessRequestPage{
    constructor(){
        this.container = $('ccd-case-challenged-access-request');
        this.header = $('h1.govuk-fieldset__heading');

        this.caseReferenceInput = $('#case-reference');
        this.otherReasonTextArea = $('#other-reason');

        this.submitBtn = $('ccd-case-challenged-access-request div.govuk-button-group button');
        this.cancelLink = $('ccd-case-challenged-access-request div.govuk-button-group a')

        this.challengedAccessSuccessContainer = $('ccd-case-challenged-access-success')
    }

    getRadioInputWithLabel(label){
        return element(by.xpath(`//ccd-case-challenged-access-request//label[contains(@class,'govuk-radios__label')][contains(text(),'${label}')]/../input`))
    }

    async selectRadioOption(option){
        const radioInput = this.getRadioInputWithLabel(option);
        await radioInput.click()
    }
}

module.exports = new ChallengedAccessRequestPage()

