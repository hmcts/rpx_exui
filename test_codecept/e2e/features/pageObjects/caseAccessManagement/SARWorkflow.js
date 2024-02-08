
const SpecificReviewPage = require('./reviewSARPage')
const SpecificAccessDurationSelectionPage = require('./durationSelectionPage')
const requestMoreInformationPage = require('./requestMoreInformationPage');

const ActionConfirmationPage = require('./SARActionConfirmationPage');
class SpecificAccessRequestWorkflow{

    constructor(){
        this.continueBtn = element(by.xpath(`//button[contains(text(),'Continue')]`))
        this.submitBtn = element(by.xpath(`//button[contains(text(),'Submit')]`))

        this.errorBanner = $('.govuk-error-summary')

        this.SARSubmitSuccessPage = $('')

        this.pages = {
            "Review specific access request" : new SpecificReviewPage(),
            "How long do you want to give access to this case for?": new SpecificAccessDurationSelectionPage(),
            "Request more information": new requestMoreInformationPage()
        }

    }

    async isErrorMessageDisplayed(){
        return this.errorBanner.isDisplayed();
    }

    async getErrorMessageDisplayed(){
        return  this.errorBanner.getText();
    }


}

module.exports = new SpecificAccessRequestWorkflow(); 