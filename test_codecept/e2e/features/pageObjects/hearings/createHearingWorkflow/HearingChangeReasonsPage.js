
class HearingChangeReasonsPage{
     
    constructor(){
        this.pageContainer = $('exui-hearing-change-reasons')

        this.fieldMapping = {
            "Provide a reason for changing this hearing": $('#hearing-option-container')
        }
    }


    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }
    
    async inputValue(field, value) {
        switch (field) {
            case "Provide a reason for changing this hearing":
                const reasons = value.split(',')
                for (let val of reasons) {
                    await this.clickReasonCheckbox(val.trim())
                }
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async clickReasonCheckbox(facility) {
        const ele = element(by.xpath(`//label[contains(text(),'${facility}')]/../input`))
        await ele.click()
    }

}

module.exports = HearingChangeReasonsPage


