

class UpdateFlagAddTranslationPage {
    constructor() {
        this.container = $('ccd-update-flag-add-translation-form')

        this.fieldMapping = {
            'Other description': element(by.xpath(`//label[contains(text(),'Other description')]/..//textarea`)),
            "Other description (Welsh)": element(by.xpath(`//label[contains(text(),'Other description (Welsh)')]/..//textarea`)),
            "Flag comments": element(by.xpath(`//label[contains(text(),'Flag comments')]/..//textarea`)),
            "Flag comments (Welsh)": element(by.xpath(`//label[contains(text(),'Flag comments (Welsh)')]/..//textarea`))

        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Other description':
            case 'Other description (Welsh)':
            case 'Flag comments':
            case 'Flag comments (Welsh)':
                await this.fieldMapping[field].sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = UpdateFlagAddTranslationPage
