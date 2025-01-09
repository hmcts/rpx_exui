
const SummaryTable = require('../common/summaryTable')

class ViewHearingPage {

    constructor() {
        this.container = $('exui-hearing-viewsummary')
        this.headerElement = $('exui-hearing-viewsummary exui-hearing-summary h1')

        this.summaryTable = new SummaryTable('exui-hearing-viewsummary')

        this.editHearingBtn = element(by.xpath(`//exui-hearing-viewsummary//button[contains(text(),'Edit hearing')]`))


    }


    async isEditHearingBtnDisplayed(){
        return await this.editHearingBtn.isDisplayed();
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

}

module.exports = new ViewHearingPage();
