

class SelectFlagLocationPage{
    constructor(){
        this.container = $('ccd-select-flag-location')

        this.fieldMapping = {
            'Where should this flag be added?': element(by.xpath(`//ccd-select-flag-location//h1[contains(text(),'Where should this flag be added?')]`))
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Where should this flag be added?':
                const ele = element(by.xpath(`//ccd-select-flag-location//h1[contains(text(),'Where should this flag be added?')]/../..//label[contains(text(),'${value}')]/..//input`))
                await ele.click()
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = SelectFlagLocationPage
