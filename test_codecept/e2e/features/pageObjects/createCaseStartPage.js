Dropdown = require('./webdriver-components/dropdown.js')
Button = require('./webdriver-components/button.js')

const { LOG_LEVELS } = require('../../support/constants.js');
var BrowserWaits = require('../../support/customWaits');
const CucumberRepprter = require('../../../codeceptCommon/reportLogger');

class CreateCaseStartPage {

  constructor(){
    this.caseCaseFilterContainer = $('exui-filter-case ccd-create-case-filters');
    this.header = '#content h1';
    this._jurisdiction = new Dropdown('#cc-jurisdiction');
    this._caseType = new Dropdown('#cc-case-type');
    this._event = new Dropdown('#cc-event');
    this._submitButton = $('#content button');
    this._jurisdictionSelector = '#cc-jurisdiction' ;

    this._startBtn = element(by.xpath("//button[text() = 'Start']"));

    this.jurisdictionOptions = $$('#cc-jurisdiction option');

  }

  

  async selectJurisdiction(jurisdiction){


    var e = element(by.xpath("//*[@id = 'cc-jurisdiction']"));
    const options = await e.getSelectOptions();
    const matchingOption = options.find(opt => opt.includes(jurisdiction))
    await e.select(matchingOption)
    // await BrowserWaits.waitForElement(e);
    // await e.click();
     
  }

  async selectCaseType(caseType){
    
    var e = element(by.xpath("//*[@id = 'cc-case-type']"));
    const options = await e.getSelectOptions();
    const matchingOption = options.find(opt => opt.includes(caseType))
    await e.select(matchingOption)

    // await this._caseType.selectFromDropdownByText(option);
  }

  async selectEvent(option){
    
    var e = element(by.xpath("//*[@id = 'cc-event']"));
    const options = await e.getSelectOptions();
    const matchingOption = options.find(opt => opt.includes(option))
    await e.select(matchingOption)
      // await this._event.selectFromDropdownByText(option);
  }

  async startCaseCreation(jurisdiction,caseType,event){

    this.selectJurisdiction(jurisdiction);

    this.selectCaseType(caseType);
    this.selectEvent(event);
  }

  async clickStartButton() {
    await this._submitButton.wait();
    await this._submitButton.click();

    // await BrowserWaits.waitForElementClickable(this._startBtn);
    // await browser.executeScript('arguments[0].scrollIntoView()',
    //   this._startBtn.getWebElement());
    // await this._startBtn.click();


  }

  async getPageHeader(){
    await BrowserWaits.waitForElement($(this.header));
    return await $(this.header).getText();
  }

  async amOnPage(){
    try{
      await BrowserWaits.waitForElement(this.caseCaseFilterContainer);
      return true;
    }catch(err){
      await CucumberRepprter.AddMessage("Create case page not displayed " + err.message + " : " + err.stack), LOG_LEVELS.Error;
      return false;
    }

    
  }

  async getLoadedJurisdictionsCount(){
    return await this.jurisdictionOptions.count();
  }

}

module.exports = CreateCaseStartPage;
