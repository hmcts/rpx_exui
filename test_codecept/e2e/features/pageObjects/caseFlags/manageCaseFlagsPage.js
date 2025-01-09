

class ManageCaseFlagsPage {
    constructor() {
        this.container = $('ccd-manage-case-flags')

        this.fieldMapping = {
            'Manage case flags': element(by.xpath(`//ccd-manage-case-flags//h1[contains(text(),'Manage case flags')]`)),
            'Manage case flags1': element(by.xpath(`//ccd-manage-case-flags//h1`)),
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Manage case flag':
                const flagDetails = value.split('-')
                const ele = element(by.xpath(`//ccd-manage-case-flags//label[contains(text(),'${flagDetails[0].trim()}')]/span[contains(text(),'${flagDetails[1].trim()}')]`))
                await ele.click()
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = ManageCaseFlagsPage

