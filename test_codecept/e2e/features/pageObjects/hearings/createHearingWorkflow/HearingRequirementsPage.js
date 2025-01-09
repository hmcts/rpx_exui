const GovUKTable = require('../../common/govUkTable')
const partyCaseFlags = require('./partyCaseFlagsTable')

class HearingRequirementsPage {
    constructor() {
        this.pageContainer = $('exui-hearing-requirements')
    }

    async getPartiesWithCaseFlagsDisplayed() {

        return await partyCaseFlags.getPartiesWithCaseFlagsDisplayed();
    }

    async getCaseFlagsDisplayedForParty(partyName) {

        return await partyCaseFlags.getCaseFlagsDisplayedForParty(partyName);;
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed();
    }
}

module.exports = HearingRequirementsPage;
