var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const taskForEventCompletionValidationPage = require('../../pageObjects/workAllocation/taskForEventValidatiosPage');


  Then('I see task event validation error page', async function (datatable) {
    const rowshash = datatable.rowsHash();

    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await taskForEventCompletionValidationPage.isPageDisplayed()).to.be.true;

      const summaryHeader = await taskForEventCompletionValidationPage.summaryHeading.getText();
      const summaryMessage = await taskForEventCompletionValidationPage.summaryBody.getText();

      const detailsHeader = await taskForEventCompletionValidationPage.errorDetailsHeader.getText();
      const detailMessage = await taskForEventCompletionValidationPage.errorDetailsMessage.getText();
      const messageLink = await taskForEventCompletionValidationPage.errorDetailsNavLink.getText();

      if (rowshash['Summary header']) {
        expect(summaryHeader).to.include(rowshash['Summary header']);
      }

      if (rowshash['Summary message']) {
        expect(summaryMessage).to.include(rowshash['Summary message']);
      }

      if (rowshash['Details header']) {
        expect(detailsHeader).to.include(rowshash['Details header']);
      }
      if (rowshash['Details message']) {
        expect(detailMessage).to.include(rowshash['Details message']);
      }
      if (rowshash['Link']) {
        expect(messageLink).to.include(rowshash['Link']);
      }
    });
  });

  When('I click continue in task event validation message page', async function(){
    await taskForEventCompletionValidationPage.continueButton.click();
  });

  When('I click cancel in task event validation message page', async function () {
    await taskForEventCompletionValidationPage.cancelButton.click();
  });
