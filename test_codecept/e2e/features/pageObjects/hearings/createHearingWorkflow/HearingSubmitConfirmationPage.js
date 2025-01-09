class HearingSubmitConfirmationPage{
    constructor() {
        this.pageContainer = $('exui-hearing-confirmation');
        this.confirmationBanner = $('.govuk-panel--confirmation')

      
    }

    async confirmationbannerMessage(){
        return await this.confirmationBanner.getText();
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }
}

module.exports = HearingSubmitConfirmationPage;
