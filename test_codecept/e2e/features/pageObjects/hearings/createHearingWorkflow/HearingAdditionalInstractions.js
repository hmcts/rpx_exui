
class HearingAdditionalInstructionsPage {
    constructor() {
        this.pageContainer = $('exui-hearing-additional-instructions');

        this.instructionsInput = $('#additionalInstructionsTextarea')

        this.fieldMapping = {
            "Enter any additional instructions for the hearing": $("#additionalInstructionsTextarea")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "Enter any additional instructions for the hearing":
                await this.instructionsInput.sendKeys(value)
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

}

module.exports = HearingAdditionalInstructionsPage;
