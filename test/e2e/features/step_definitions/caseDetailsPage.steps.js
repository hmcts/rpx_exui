
var CaseListPage = require('../pageObjects/CaseListPage');
const CucumberReportLogger = require('../../support/reportLogger');

var { Then, When, Given } = require('@cucumber/cucumber');
const { browser } = require('protractor');
const BrowserWaits = require('../../support/customWaits');
const caseDetailsPage = require('../../../ngIntegration/tests/pageObjects/caseDetailsPage');


  Then('I see case details challenged access request page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await BrowserWaits.waitForElement(await caseDetailsPage.challengedAccessRequestContainer);
      expect(await caseDetailsPage.challengedAccessRequestContainer.isDisplayed()).to.be.true;
    });
  });

  Then('I see case details specific access request page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await BrowserWaits.waitForElement(await caseDetailsPage.specificAccessRequestContainer);
      expect(await caseDetailsPage.specificAccessRequestContainer.isDisplayed()).to.be.true;
    });
  });
