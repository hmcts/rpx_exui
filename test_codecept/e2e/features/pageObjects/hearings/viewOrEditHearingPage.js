
const SummaryTable = require('../common/summaryTable')

class ViewOrEditHearingPage{

    constructor(){
        this.container = $('exui-hearing-view-edit-summary')
        this.headerElement = $('exui-hearing-view-edit-summary exui-hearing-summary h1')

        this.summaryTable = new SummaryTable('exui-hearing-view-edit-summary')
        this.submitUpdatedRequestBtn = $('')
        this.multiValueFields = [
            'Reasonable adjustments',
            'Does the hearing need to take place on a specific date?'
        ]
        
    }

    async getHeader(){
        return await this.headerElement.getText()
    }

    async isKeyFieldDisplayed(field){
        return await this.summaryTable.isFieldDisplayed(field)
    }

    async getKeyFieldValue(field) {
        let values = [];

        if (this.multiValueFields.includes(field)){
            values = await this.summaryTable.getValuesForField(field)
        }else{
            values.push(await this.summaryTable.getValueForField(field))
        }

        if (values.length === 0){
            values.push(await this.summaryTable.getValueForField(field))
        }
        return values;
    }

    async isChangeLinkDisplayedForKeyField(field){
        return await this.summaryTable.isChangeLinkDisplayedForField(field)
    }

    async getActionColumnTextForKeyField(field) {
        const actionColumnElement = this.summaryTable.getTableActionsElementXpath(field)
        return await element(by.xpath(actionColumnElement)).getText()
    }

    async clickChangeLinkForField(field) {
        return await this.summaryTable.clickChangeLinkForField(field)
    }

    async isAmendedFlagDisplayedForKeyField(field, value) {
        return await this.summaryTable.isAmendedFlagDisplayedForField(field)
    }

    async getSectionHeadingLabel(heading){
        const e = element(by.xpath(`//h2[contains(text(),'${heading}')]//exui-amendment-label`))
        const isDisplayed = await e.isDisplayed();
        return isDisplayed ? await e.getText() : '';
    }

}

module.exports = new ViewOrEditHearingPage();
