
const browser = require("../../../../codeceptCommon/browser")
const browserWaits = require('../../../support/customWaits')

class CaseFlagsCaseSetup{


    constructor(){

    }

    async inputField(comolexField, inputField, value){
        const complexFieldXapth = `//ccd-write-complex-type-field//h2[contains(text(),'${comolexField}')]/../..`
        const inputFieldXpath = `//ccd-field-write//span[contains(text(),'${inputField}')]/../..//input`
        await element(by.xpath(`${complexFieldXapth}${inputFieldXpath}`)).sendKeys(value)
    }

    async createCase(version, inputs) {
        await browser.get(`${process.env.TEST_URL}/cases/case-create/DIVORCE/xuiCaseFlags${version.toLowerCase().includes('v1') ? 'V1' : '2.1'}/createCase/createCasetestDataSetup`)
        await browserWaits.waitForElement($('ccd-case-edit-page'))
        
        for(const field of inputs){
            await this.inputField(field.party, field.fieldName, field.value)
            
        }

        await element(by.xpath(`//button[contains(text(),'Continue')]`)).click()
        const caseSubmitButtom = element(by.xpath(`//button[contains(text(),'Test submit')]`))
        await browserWaits.waitForElement(caseSubmitButtom)
        await caseSubmitButtom.click()
    }
}

module.exports = new CaseFlagsCaseSetup()
