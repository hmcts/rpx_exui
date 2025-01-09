
const CucumberReportLogger = require('../../support/reportLogger');

var { Then, When, Given } = require('@cucumber/cucumber');
const BrowserWaits = require('../../support/customWaits');
const caseDetailsPage = require('../pageObjects/caseDetailsPage');

const caseDetailsBasicViewPage = require('../pageObjects/caseAccessManagement/caseDetailsBasicView');


  Then('I see case details tab label {string} is displayed is {string}', async function (tabLabel, boolString) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.equal(boolString.toLowerCase().includes('true'));
    });
  });

  Then('I see case details tab label {string} is selected is {string}', async function (tabLabel, boolString) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.equal(boolString.toLowerCase().includes('true'));
    });
  });

  Then('I see case details tab label {string} displayed', async function(tabLabel){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.be.true;
    });
  });

  Then('I see case details tab label {string} not displayed', async function (tabLabel) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.be.false;
    });
  });

  Then('I see case details tab with label {string} is selected', async function (tabLabel){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.be.true;
    });
  });

  Then('I see case details tab with label {string} is not selected', async function (tabLabel) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.be.false;
    });
  });

  When('I click tab with label {string} in case details page', async function (tabLabel) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await caseDetailsPage.clickTabWithLabel(tabLabel);
    });
  });

  Then('I see case details page displayed with tab {string} selected', async function(tabLabel){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.amOnPage(), 'Not on case details page').to.be.true;
      expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel), `Tab with label "${tabLabel}" is not present or displayed`).to.be.true;
      expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel), `Tab with label "${tabLabel}" is not selected`).to.be.true;
    });
  });

  Then('I see case details page with message banner {string}', async function(expectedBannerMessage){
    await BrowserWaits.retryWithActionCallback(async () => {
      const actualBannerMessage = await caseDetailsPage.messageBanner.getBannerMessagesDisplayed();
      expect(actualBannerMessage.join(',')).to.includes(expectedBannerMessage);
    });
  });

  Then('I see case details basic view and request access page', async () => {
    await BrowserWaits.waitForElement(caseDetailsBasicViewPage.container);
  });

  Then('I see case details basic view displays banner with message {string}', async (message) => {
    await BrowserWaits.waitForElement(caseDetailsBasicViewPage.bannerMessageContainer);
    const bannerMessage = await caseDetailsBasicViewPage.bannerMessageContainer.getText();
    expect(bannerMessage).to.contains(message);
  });

  Then('I see case details basic view displays case property {string} with values {string}', async (attribute, value) => {
    await BrowserWaits.waitForElement(caseDetailsBasicViewPage.bannerMessageContainer);
    expect(await caseDetailsBasicViewPage.isRowDisplayedWithAttribute(attribute), 'Attribute not displayed').to.be.true;
    expect(await caseDetailsBasicViewPage.getAttributeValues(attribute)).to.contains(value);
  });

  When('I click request access button in case basic view page', async () => {
    await caseDetailsBasicViewPage.requestAccessButton.click();
  });
