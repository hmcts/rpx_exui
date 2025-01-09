

class SelectSupportTypePage {
    constructor(flagType) {
        this.container = $('ccd-select-flag-type')

        this.flagType = flagType;
        this.fieldMapping = {
        }
        this.fieldMapping[this.flagType] = element(by.xpath(`//ccd-select-flag-type//h1[contains(text(),'${this.flagType}')]`))
    }


    async inputValue(field, value) {

        if (field.includes('Enter a flag type')) {
            const ele = element(by.xpath(`//label[contains(text(),'Enter a flag type')]/..//input`))
            await ele.sendKeys(value)
        } else {
            const ele = element(by.xpath(`//ccd-select-flag-type//h1[contains(text(),'${this.flagType}')]/../..//label[contains(text(),'${value}')]/..//input`))
            await ele.click()
        }
    }


}
module.exports = SelectSupportTypePage

