

class AddSupportCommentsPage {
    constructor() {
        this.container = $('ccd-add-comments')

        this.fieldMapping = {
            'Tell us more about the request': element(by.xpath(`//ccd-add-comments//label[contains(text(),'Tell us more about the request')]`)),
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Tell us more about the request':
                const ele = element(by.xpath(`//ccd-add-comments//label[contains(text(),'Tell us more about the request')]/../..//textarea`))
                await ele.sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = AddSupportCommentsPage
