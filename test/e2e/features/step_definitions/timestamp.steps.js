var CaseManager = require('../pageObjects/common/CaseManager');

var { Then, When, Given } = require('@cucumber/cucumber');


  let caseManager = new CaseManager();

  When('I Add Comment to the case', async function () {
    await caseManager.startNextStep('Add Comment');
    await caseManager.clickSubmit();
  });

  Then('I see the event with the current timestamp', async function () {
    let currentDate = new Date();
    expect(await caseManager.getTimestampDisplayed()).to.be.contain(currentDate.toLocaleTimeString());
  });

