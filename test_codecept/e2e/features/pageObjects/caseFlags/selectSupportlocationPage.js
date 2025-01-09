

class SelectSupportLocationPage {
    constructor() {
        this.container = $('ccd-select-flag-location')

        this.fieldMapping = {
            'Who is the support for?': element(by.xpath(`//ccd-select-flag-location//h1[contains(text(),'Who is the support for?')]`))
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Who is the support for?':
                const ele = element(by.xpath(`//ccd-select-flag-location//h1[contains(text(),'Who is the support for?')]/../..//label[contains(text(),'${value}')]/..//input`))
                await ele.click()
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = SelectSupportLocationPage
