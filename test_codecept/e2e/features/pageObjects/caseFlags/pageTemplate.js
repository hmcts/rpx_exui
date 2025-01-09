

class TemplatePage {
    constructor() {
        this.container = $('app-company-house-details')

        this.fieldMapping = {
            'Enter the name of the organisation': $('#company-name'),
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Enter the name of the organisation':
                await this.fieldMapping[field].sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = TemplatePage
