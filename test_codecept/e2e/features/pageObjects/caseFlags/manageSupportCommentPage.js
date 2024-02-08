

class ManageSupportCommentPage {
    constructor() {
        this.container = $('ccd-update-flag')

        this.fieldMapping = {
            'Tell us why the support is no longer needed': element(by.xpath(`//ccd-update-flag//label[contains(text(),'Tell us why the support is no longer needed')]`)),
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Tell us why the support is no longer needed':
                const ele = element(by.xpath(`//ccd-update-flag//label[contains(text(),'Tell us why the support is no longer needed')]/../..//textarea`))
                await ele.sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = ManageSupportCommentPage
