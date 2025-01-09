
const SummaryTable = require('../common/summaryTable')

class ViewOrEditHearingPage {

    constructor() {
        this.container = $('exui-hearing-edit-summary')
        this.headerElement = $('exui-hearing-edit-summary h1')

        this.summaryTable = new SummaryTable('exui-hearing-edit-summary')

        this.warningMessage = $('exui-warning-and-error-section .govuk-warning-text__text')
        this.errorSummaryMessage = $('.govuk-error-summary__body')
        this.errorMessage = $('.govuk-error-message')


    }

    async getHeader() {
        return await this.headerElement.getText()
    }

    async isKeyFieldDisplayed(field) {
        return await this.summaryTable.isFieldDisplayed(field)
    }

    async getKeyFieldValue(field) {
        return await this.summaryTable.getValueForField(field)
    }

    async isChangeLinkDisplayedForKeyField(field) {
        return await this.summaryTable.isChangeLinkDisplayedForField(field)
    }

    async clickChangeLinkForField(field) {
        return await this.summaryTable.clickChangeLinkForField(field)
    }

    async isAmendedFlagDisplayedForKeyField(field) {
        return await this.summaryTable.isAmendedFlagDisplayedForField(field)
    }

    async isWarningTextBannerDisplayed(){
        return await this.warningMessage.isDisplayed();
    }

    async getWarningBanerText(){
        return await this.warningMessage.getText();
    }

    async getErrorSummary() {
        return await this.errorSummaryMessage.getText();
    }

}

module.exports = new ViewOrEditHearingPage();

