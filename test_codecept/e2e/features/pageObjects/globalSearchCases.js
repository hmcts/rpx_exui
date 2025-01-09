
const BrowserWaits = require('../../support/customWaits');

const headerPage = require('./headerPage');

class DateSearchField{
    constructor(fieldname){
        this.day = element(by.xpath(`//xuilib-gov-uk-date//fieldset/legend[contains(text(),'${fieldname}')]/..//input[contains(@name,'day')]`));
        this.month = element(by.xpath(`//xuilib-gov-uk-date//fieldset/legend[contains(text(),'${fieldname}')]/..//input[contains(@name,'month')]`));
        this.year = element(by.xpath(`//xuilib-gov-uk-date//fieldset/legend[contains(text(),'${fieldname}')]/..//input[contains(@name,'year')]`));

        this.errorMessage = element(by.xpath(`//xuilib-gov-uk-date//fieldset/legend[contains(text(),'${fieldname}')]/..//xuilib-gov-uk-error-message//span`));
    }

     async getErrorMessageText(){
        return await this.errorMessage.getText();
    }

    async isErrorMessageDisplayed(){
        return await this.errorMessage.isDisplayed();
    }

    async getDayValue(){
        return await this.day.getAttribute('value');
    }

    async getMonthValue(){
        return await this.month.getAttribute('value');
    }
    async getYearValue(){
        return await this.year.getAttribute('value');
    }

    async isHeaderSearchDisplayed(){
        return await headerPage.headerSearch.container.isDisplayed();
    }

     async inputHeaderSearchFiled(inputVal){
        await headerPage.headerSearch.input.clear();
        await headerPage.headerSearch.input.sendKeys(inputVal);

    }

    async clickHeaderSearchFind(){
        await headerPage.headerSearch.button.click();
    }

}


class InputSearchField{
    constructor(fieldid){
        this.input = element(by.xpath(`//xuilib-gov-uk-input//input[@id = '${fieldid}']`));
        this.label = element(by.xpath(`//xuilib-gov-uk-input//input[@id = '${fieldid}']/../xuilib-gov-label/label`));
        this.hintText = element(by.xpath(`//xuilib-gov-uk-input//input[@id = '${fieldid}']/../span[contains(@class ,'govuk-hint')]`));
        this.errorMessage = element(by.xpath(`//xuilib-gov-uk-input//input[@id = '${fieldid}']/../xuilib-gov-uk-error-message`));

    }

    async getInputFieldValue(){
        return await this.input.getAttribute('value');
    }

    async inputText(inputVal){
        await this.input.clear();
        if(inputVal !== ''){
            await this.input.sendKeys(inputVal);
        }
    }

    async getLabel(){
        return await this.label.getText();
    }

    async getHintText(){
        return await this.hintTex.getText();
    }

    async getErrorMessageText(){
        return await this.errorMessage.getText();
    }

    async isErrorMessageDisplayed(){
        return await this.errorMessage.isDisplayed();
    }

 


}



class GlobalSearchCasesPage{
    constructor(){
        this.pageHeader = element(by.xpath("//h1[contains(text(),'Search cases')]"));

        this.caseReference = $('input#caseRef');
        this.otherReference = new InputSearchField('otherRef');//$("//xuilib-gov-uk-input//input[@id = 'otherRef']);
        this.fullName = new InputSearchField('fullName');//$("//xuilib-gov-uk-input//input[@id = 'fullName']);
        this.firstLineOfAddress = new InputSearchField('addressLine1');//$("//xuilib-gov-uk-input//input[@id = 'addressLine1']);
        this.postCode = new InputSearchField('postcode');//$("//xuilib-gov-uk-input//input[@id = 'postcode']);
        this.emailAddress = new InputSearchField('email');//$("//xuilib-gov-uk-input//input[@id = 'email']);

        this.dateOfBirth = new DateSearchField('Date of birth');

        this.dateOfdeath = new DateSearchField('Date of death');

        this.servicesSelect = element(by.xpath(`//xuilib-gov-select//select[@id = 'servicesList']`));

        this.errorSummaryContainer = $('.govuk-error-summary');
        this.errorSummaryHeader = $('.govuk-error-summary h2');
        this.errorSummary = $('.govuk-error-summary govuk-error-summary__body ui');


        this.searchButton = $('exui-case-reference-search-box button');
    }

    async amOnPage(){
        try{
            await BrowserWaits.waitForElement(this.pageHeader);
            return true;

        }catch(err){
            return false
        }
    }

    async getServicesFieldsOptions() {
        const options = this.servicesSelect.$$('option');
        const optionsCount = await options.count();
        const optionValues = [];

        for (let i = 0; i < optionsCount; i++) {
            const optionElement = await options.get(i);
            optionValues.push(await optionElement.getText());
        }
        return optionValues;
    }


}


module.exports = new GlobalSearchCasesPage();
