
class SpecificAccessRequestPage {
    constructor() {
        this.container = $('ccd-case-specific-access-request');
        this.header = $('h1.govuk-fieldset__heading');

        this.provideReasonInput = $('#specific-reason');

        this.submitBtn = $('ccd-case-specific-access-request div.govuk-button-group button');
        this.cancelLink = $('ccd-case-specific-access-request div.govuk-button-group a');

        this.requestSuccessPageContainer = $('ccd-case-specific-access-success')
    }

}

module.exports = new SpecificAccessRequestPage()

