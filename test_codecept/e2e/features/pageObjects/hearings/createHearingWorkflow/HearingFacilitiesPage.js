
const GovUKTable = require('../../common/govUkTable')
const partyCaseFlags = require('./partyCaseFlagsTable')
class HearingFacilitiesPage {
    constructor() {
        this.pageContainer = $('exui-hearing-facilities')

        this.fieldMapping = {
            "Will additional security be required?": $('#addition-security-confirmation'),
            "Will additional security be required?-Yes": $('#additionalSecurityYes'),
            "Will additional security be required?-No": $('#additionalSecurityNo'),
            "Select any additional facilities required": $('#facilitiesList')
        }

    }

    async inputValue(field, value) {
        switch (field) {
            case "Will additional security be required?":
                if (value.toLowerCase().includes('yes')) {
                    await this.fieldMapping["Will additional security be required?-Yes"].click()
                } else {
                    await this.fieldMapping["Will additional security be required?-No"].click()
                }
                break;
            case "Select any additional facilities required":
                const facilities = value.split(',')
                for (let val of facilities){
                    await this.clickAdditionalFacilityCheckbox(val.trim())
                }
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }


    async isAdditionalSecurityRequired(booleanValue) {
        if (booleanValue) {
            await this.fieldMapping["Will additional security be required?-Yes"].click()
        } else {
            await this.fieldMapping["Will additional security be required?-No"].click()
        }
    }

    async clickAdditionalFacilityCheckbox(facility) {
        const ele = element(by.xpath(`//div[@id='checkbox-addition-facility']//label[contains(text(),'${facility}')]/../input`))
        await ele.click()
    }

    async getPartiesWithCaseFlagsDisplayed() {
       
        return await partyCaseFlags.getPartiesWithCaseFlagsDisplayed();
    }

    async getCaseFlagsDisplayedForParty(partyName) {
      
        return await partyCaseFlags.getCaseFlagsDisplayedForParty(partyName);;
    }
}

module.exports = HearingFacilitiesPage;
