

class AddCommentsPage {
    constructor() {
        this.container = $('ccd-add-comments')

        this.fieldMapping = {
            'Add comments for this flag': element(by.xpath(`//ccd-add-comments//label[contains(text(),'Add comments for this flag')]`)),
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Add comments for this flag':
                const ele = element(by.xpath(`//ccd-add-comments//label[contains(text(),'Add comments for this flag')]/../..//textarea`))
                await ele.sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = AddCommentsPage
