

class ConfirmFlagStatusPage {
    constructor() {
        this.container = $('ccd-confirm-flag-status')

        this.fieldMapping = {
            'Confirm the status of the flag': element(by.xpath(`//ccd-confirm-flag-status//h1[contains(text(),'Confirm the status of the flag')]`)),
            "Describe reason for status": $('#statusReason')
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Confirm the status of the flag':
                const ele = element(by.xpath(`//ccd-confirm-flag-status//h1[contains(text(),'Confirm the status of the flag')]/../..//label[contains(text(),'${value}')]/..//input`))
                await ele.click()
                break;
            case "Describe reason for status":
                await this.fieldMapping[field].sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = ConfirmFlagStatusPage
