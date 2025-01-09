
class HearingLinkPage{
    constructor() {
        this.pageContainer = $('exui-hearing-link');

        this.hearingLink_yes = $(".govuk-form-group input[name='hearingLink'][value='yes']")
        this.hearingLink_no = $(".govuk-form-group input[name='hearingLink'][value='no']")

        this.fieldMapping = {
            "Will this hearing need to be linked to other hearings?": $(".govuk-form-group input[name='hearingLink']")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "Will this hearing need to be linked to other hearings?":
                if(value.toLowerCase().includes('yes')){
                    await this.hearingLink_yes.click();
                }else{
                    await this.hearingLink_no.click();
                }
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

}

module.exports = HearingLinkPage;
