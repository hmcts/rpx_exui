const reportLogger = require("../../../../../codeceptCommon/reportLogger");

class HearingCreateEditSummaryPage {
  constructor() {
    this.pageContainer = $('exui-hearing-create-edit-summary');

    this.fieldMapping = {
           
    }
  }

  async isDisplayed() {
    return await this.pageContainer.isDisplayed()
  }

  async clickChangeLinkForField(field){
    const fieldLocators = this.getRowElementLocators(field);
      const changeLinkForField = element(by.xpath(fieldLocators.changeLinkElement))
      await changeLinkForField.click();
  }

  getRowElementLocators(field){
  
      return {
          nameElement: `//div[contains(@class,'govuk-summary-list')]//div[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]`,
          valueElement: `//div[contains(@class,'govuk-summary-list')]//div[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]/../div[contains(@class,'govuk-summary-list__value')]/div`,
          changeLinkElement: `//div[contains(@class,'govuk-summary-list')]//div[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]/../div[contains(@class,'govuk-summary-list__actions')]/a`
      }
    }

  async validateSummaryFieldWithValueDisplayed(section, field, value){

      let fieldLevelLocators = this.getRowElementLocators(field)

      let sectionElementLocator = `//exui-hearing-summary//h2[contains(text(),'${section}')]`

    
      expect(await element(by.xpath(fieldLevelLocators.nameElement)).isDisplayed(), `field ${field} not displayed`).to.be.true
      const valuesList = value.split(',');
      for(let val of valuesList){
          expect(await element(by.xpath(fieldLevelLocators.valueElement)).getText(), `field ${field} value ${val} not included`).includes(val.trim())
      }

      if (section.trim() !== "") {
          expect(await element(by.xpath(sectionElementLocator)).isDisplayed(), `hearing section ${section} not displayed`).to.be.true
          expect(await element(by.xpath(fieldLevelLocators.changeLinkElement)).isDisplayed(),`hearing field ${field} change link not displayed`).to.be.true
      } else {
          expect(await element(by.xpath(fieldLevelLocators.changeLinkElement)).isDisplayed(), `case field ${field} change link displayed`).to.be.false
      }
  }

}

module.exports = HearingCreateEditSummaryPage;

