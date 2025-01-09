

class UpdateFlagPage {
    constructor(updateFlagFor) {
        this.container = element(by.xpath(`//ccd-update-flag//label[contains(text(),'${updateFlagFor}')]`))

        this.updateFlagFor = updateFlagFor;
        this.fieldMapping = {
            "Flag status": element(by.xpath(`//div[contains(@id,'flag-status-container')]`)),
            "Describe reason for status change": $('#flagStatusReasonChange'),
            "I need to add a translation": element(by.xpath(`//label[contains(text(),'I need to add a translation')]/..//input`))
        }
        this.fieldMapping[`${this.updateFlagFor} comments`] = element(by.xpath(`//ccd-update-flag//label[contains(text(),'${updateFlagFor} comments')]`))
        this.fieldMapping[`${this.updateFlagFor} status`] = element(by.xpath(`//ccd-update-flag//h1[contains(@id,'update-flag-status-heading')][contains(text(),'${updateFlagFor} status')]`))

        this.flagStatusInactiveButton = element(by.xpath(`//div[contains(@id,'flag-status-container-v1')]//button`))
    }


    async inputValue(field, value) {

        switch(field){
            case `${this.updateFlagFor} comments`:
                const commentsEle = element(by.xpath(`//ccd-update-flag//label[contains(text(),'${field}')]/../textarea`))
                await commentsEle.sendKeys(value)
                break;
            case `${this.updateFlagFor} status`:
                const statusEle = element(by.xpath(`//ccd-update-flag//h1[contains(@id,'update-flag-status-heading')]/../..//label[contains(text(),'${value}')]/..//input`))
                await statusEle.click()
                break;
            case "Describe reason for status change":
                await this.fieldMapping[field].sendKeys(value);
                break;
            case "I need to add a translation":
                await this.fieldMapping[field].click();
                break;
            case "Flag status":
                await this.flagStatusInactiveButton.click()
                break;
            default:
                throw new Error(`${field} not confired in test page object`)
        }

       
    }


}
module.exports = UpdateFlagPage

