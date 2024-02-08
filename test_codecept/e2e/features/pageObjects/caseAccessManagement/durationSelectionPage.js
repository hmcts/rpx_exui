
const BrowserWaits = require('../../../support/customWaits');
class SpecificAccessDuration {

    constructor() {
        this.container = $('exui-specific-access-duration');
        
        this.fieldMapping = {
            "How long do you want to give access to this case for?": element(by.xpath(`//h1[contains(text(),'How long do you want to give access to this case for?')]/..//div[contains(@class,'govuk-radios--conditional')]`)),
            "Access Starts": $(`#conditional-specific-access-3:not(.govuk-radios__conditional--hidden) .date-input-container`),
            "Access Ends": $(`#conditional-specific-access-3:not(.govuk-radios__conditional--hidden) .date-input-container`)
        }

    }
    
    async inputValues(field,value){
        switch(field){
            case "How long do you want to give access to this case for?":
                const ele = element(by.xpath(`//h1[contains(text(),'How long do you want to give access to this case for?')]/..//div[contains(@class,'govuk-radios--conditional')]//label[contains(text(),'${value}')]/..//input`))
                await ele.click()
                break;
            case "Access Ends":
                const values = value.split('-')
                const day = element(by.xpath(`//legend[contains(text(),'Access Ends')]/..//div[contains(@id,'endDate-date')]//label/span[contains(text(),'Day')]/../../..//input`))
                const month = element(by.xpath(`//legend[contains(text(),'Access Ends')]/..//div[contains(@id,'endDate-date')]//label/span[contains(text(),'Month')]/../../..//input`))
                const year = element(by.xpath(`//legend[contains(text(),'Access Ends')]/..//div[contains(@id,'endDate-date')]//label/span[contains(text(),'Year')]/../../..//input`))

                await day.sendKeys(values[0])
                await month.sendKeys(values[1])
                await year.sendKeys(values[2])
                break;
            default:
                throw new Error(`${field} not configured`)

        }
    }


    





}

module.exports = SpecificAccessDuration
