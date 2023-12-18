
class HearingRequirementsPage {
    constructor() {
        this.pageContainer = $('exui-hearing-requirements')
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed();
    }
}

module.exports = HearingRequirementsPage;
