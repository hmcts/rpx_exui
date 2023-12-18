class HearingStagePage {
    constructor() {
        this.pageContainer = $('exui-hearing-stage');
        this.hearingStagesListContainer = $('#hearing-stage')

        this.fieldMapping = {
            "What stage is this hearing at?": $('#hearing-stage')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "What stage is this hearing at?":
                await this.selectHearingStage(value)
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

    async validatePage() {
        expect(await this.hearingStagesListContainer.isDisplayed(), 'Hearing stages list not displayed').to.be.true
    }

    async selectHearingStage(stage) {
        const ele = element(by.xpath(`//fieldset[@id='hearing-stage']//label[contains(text(),'${stage}')]/../input`))
        await ele.click()
    }

}

module.exports = HearingStagePage;
