
var HearingRecordingsCase = require('../pageObjects/hearingRecordingsCase');
const headerPage = require('../pageObjects/headerPage');
const browserWaits = require('../../support/customWaits');
const cucumberReporter = require('../../support/reportLogger');
var { Then, When, Given } = require('@cucumber/cucumber');


  let hearingRecordingsCase = new HearingRecordingsCase();

  When('I click on Case Hearing Files tab', async function () {
    await browserWaits.retryWithActionCallback(async () => {
      try{
        await hearingRecordingsCase.hearingFilesTab();
        await browserWaits.waitForElement(hearingRecordingsCase.hearingFilesTabContainer);
        await cucumberReporter.AddScreenshot();
      }catch(err){
        cucumberReporter.AddMessage('Refresing browser to get missing tab');
        await headerPage.refreshBrowser();
        throw err;
      }
    });
  });

  When('I click on a file', async function () {
    try{
      await browserWaits.waitForElement(hearingRecordingsCase.hearingFilesTabContainer);
    }catch(err){
      await browserWaits.retryWithActionCallback(async () => {
        cucumberReporter.AddMessage('Case hearing tab not displayed, retrying clicking tab again');
        try {
          await hearingRecordingsCase.hearingFilesTab();
          await browserWaits.waitForElement(hearingRecordingsCase.hearingFilesTabContainer);
          await cucumberReporter.AddScreenshot();
        } catch (err) {
          cucumberReporter.AddMessage('Refresing browser to get missing tab');
          await headerPage.refreshBrowser();
          throw err;
        }
      });
    }

    await browserWaits.retryWithActionCallback(async () => {
      await hearingRecordingsCase.clickFileLink();
    });
  });

  Then('I see the file displayed in Media Viewer', async function () {
    await browserWaits.retryWithActionCallback(async () => {
      await hearingRecordingsCase.checkFile();
    });
  });
