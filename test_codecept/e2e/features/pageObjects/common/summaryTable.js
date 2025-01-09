
class SummaryTable{

    constructor(pageElementTag){
        this.pageElementTag = pageElementTag
        this.summaryContainer = $(`${this.pageElementTag ? this.pageElementTag : ''} .govuk-summary-list`);
    }

    getTableKeyElementXpath(key) {
        return `//*[contains(@class,'govuk-summary-list__key')][contains(text(),'${key}')]`
    }

    getTableValueElementXpath(forKey) {
        const keyElement = this.getTableKeyElementXpath(forKey)
        return `${keyElement}/../*[contains(@class,'govuk-summary-list__value')]`
    }

    getTableChangeLinkElementXpath(forKey) {
        const keyElement = this.getTableKeyElementXpath(forKey)
        return `${keyElement}/../*[contains(@class,'govuk-summary-list__actions')]//a`
    }

    getTableActionsElementXpath(forKey) {
        const keyElement = this.getTableKeyElementXpath(forKey)
        return `${keyElement}/../*[contains(@class,'govuk-summary-list__actions')]`
    }

    getTableAmendedElementXpath(forKey) {
        const keyElement = this.getTableKeyElementXpath(forKey)
        return `${keyElement}/..//exui-amendment-label//strong`;
    }

    async isFieldDisplayed(forKey) {
        const e = element(by.xpath(this.getTableKeyElementXpath(forKey)))
        return await e.isDisplayed();
    }

    async getValueForField(forKey) {
        const e = element(by.xpath(this.getTableValueElementXpath(forKey)))
        return await e.getText();
    }

    async getValuesForField(forKey) {
        const values = []
        const elements = element.all(by.xpath(this.getTableValueElementXpath(forKey)+'/div'))
        const count = await elements.count();
        for(let i = 0; i < count; i++){
            const e = await elements.get(i)
            values.push(await e.getText())
        }
        return values;
    }

    async isChangeLinkDisplayedForField(forKey) {
        const e = element(by.xpath(this.getTableChangeLinkElementXpath(forKey)))
        return await e.isDisplayed();
    }

    async clickChangeLinkForField(forKey){
        const e = element(by.xpath(this.getTableChangeLinkElementXpath(forKey)))
        await e.click();
    }

    async isAmendedFlagDisplayedForField(forKey){
        const e = element(by.xpath(this.getTableAmendedElementXpath(forKey)))
        return await e.isDisplayed();
    }

}

module.exports = SummaryTable 
