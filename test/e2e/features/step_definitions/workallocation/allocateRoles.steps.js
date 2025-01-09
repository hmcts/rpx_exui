var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');

const ArrayUtil = require('../../../utils/ArrayUtil');

const workFlowPage = require('../../pageObjects/workAllocation/workFlow');


  Then('I see Allocate role work flow page {string} with caption {string} is displayed', async function (workFlowPageType, captionHeader) {
    let workFlowPageObject = getWorkflowPageObject(workFlowPageType);
    await BrowserWaits.retryWithActionCallback(async () => {
      reportLogger.AddMessage(`getWorkflowPageObject : ${workFlowPageType} with header text ${await workFlowPageObject.getHeaderText()}`);
      expect(await workFlowPageObject.isDisplayed(), `${workFlowPageType} work flow page not displayed`).to.be.true;
      expect(await workFlowPageObject.getHeaderText(), `${workFlowPageType} work flow page header not matching`).to.include(workFlowPageType);
      expect((await workFlowPageObject.getHeaderCaption()).toLowerCase(), `${workFlowPageType} work flow page header caption not matching`).to.include(captionHeader.toLowerCase());
    });
  });

  When('I enter find person search input {string} in work flow', async function(searchInput){
    if (searchInput === ''){
      return;
    }

    await workFlowPage.findPersonPage.inputSearchTerm(searchInput);
    await BrowserWaits.retryWithActionCallback(async () => {
      const results = await workFlowPage.findPersonPage.getPersonsReturned();
      expect(results.length > 0, `No find person results returned for input "${searchInput}"`).to.be.true;
      await BrowserWaits.waitForSeconds(1);
    });
  });

  Then('I see find person search results in work flow', async function(resulEmails){
    let counter = 0;
    await BrowserWaits.retryWithActionCallback(async () => {
      if (counter > 0){
        await BrowserWaits.waitForSeconds(1);
      }
      counter++;
      const actualSearcResults = await workFlowPage.findPersonPage.getPersonsReturned();
      const expectedResultsHashes = resulEmails.hashes();

      const expectedResultsArr = [];
      for (const expectedHash of expectedResultsHashes) {
        if (expectedHash.Person !== ''){
          expectedResultsArr.push(expectedHash.Person);
        }
      }
      for (const expected of expectedResultsArr) {
        expect(actualSearcResults, `Actual : ${actualSearcResults}`).to.include(expected);
      }
    });
  });

  When('I select find person result {string} in work flow', async function(person){
    if (person !== ''){
      await workFlowPage.findPersonPage.selectPerson(person);
    }
  });

  When('I click continue in work flow page {string}', async function (workFlowPageType) {
    await workFlowPage.workFlowContainer.clickContinue();
  });

  When('I select Choose a role option {string} in work flow', async function (role) {
    await workFlowPage.chooseRolesPage.selectRadioOption(role);
  });

  When('I select Choose how to allocate option {string} in work flow', async function (howTo) {
    await workFlowPage.chooseHowToAllocateRolePage.selectRadioOption(howTo);
  });

  When('I select duration option {string} in work flow', async function(durationOption){
    await workFlowPage.durationOfRolePage.selectRadioOption(durationOption);
  });

  Then('I validate duration option {string} in work flow has caption text {string}', async function (durationOption, caption){
    const actualCaption = await workFlowPage.durationOfRolePage.getRadioOptionCaptionText(durationOption);
    expect(actualCaption).to.include(caption);
  });

  Then('I validate date input field {string} is displayed {string} in work flow page', async function (dateInputLabel, displayStatus) {
    const isDisplayed = await workFlowPage.durationOfRolePage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.equal(displayStatus.toLowerCase().includes('yes'));
  });

  Then('I validate date input field {string} displayed in work flow page', async function(dateInputLabel){
    const isDisplayed = await workFlowPage.durationOfRolePage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.be.true;
  });

  Then('I validate date input field {string} NOT displayed in work flow page', async function (dateInputLabel) {
    const isDisplayed = await workFlowPage.durationOfRolePage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.be.false;
  });

  When('I enter duration date for field {string} with current date plus {int} days in work flow', async function(dateInputField, bydays){
    let dateToEnter = new Date();
    dateToEnter.setDate(dateToEnter.getDate() + bydays);
    await workFlowPage.durationOfRolePage.enterDayInDateInputWithLabel(dateInputField, dateToEnter.getDate());
    await workFlowPage.durationOfRolePage.enterMonthInDateInputWithLabel(dateInputField, dateToEnter.getMonth()+1);
    await workFlowPage.durationOfRolePage.enterYearInDateInputWithLabel(dateInputField, dateToEnter.getFullYear());
  });

  When('I enter duration date for field {string} with current date minus {int} days in work flow', async function (dateInputField, bydays) {
    let dateToEnter = new Date();
    dateToEnter.setDate(dateToEnter.getDate() - bydays);
    await workFlowPage.durationOfRolePage.enterDayInDateInputWithLabel(dateInputField, dateToEnter.getDay());
    await workFlowPage.durationOfRolePage.enterMonthInDateInputWithLabel(dateInputField, dateToEnter.getMonth()+1);
    await workFlowPage.durationOfRolePage.enterYearInDateInputWithLabel(dateInputField, dateToEnter.getFullYear());
  });

  Then('I validate another period field {string} validation error displayed is {string}', async function(field, isDisplayed){
    expect(await workFlowPage.durationOfRolePage.isValidationErrorDisplayedForDateInput(field)).to.equal(isDisplayed.toLowerCase().includes('true'));
  });

  Then('I validate another period field {string} validation error message is {string}', async function (field, validationMessage) {
    expect(await workFlowPage.durationOfRolePage.getAnotherPeriodValidationMessageForField(field)).to.contains(validationMessage);
  });

  function getWorkflowPageObject(workFlowPageType) {
    let workFlowPageObject = null;

    if (workFlowPageType === 'Choose a role') {
      workFlowPageObject = workFlowPage.chooseRolesPage;
    } else if (workFlowPageType === 'Choose how to allocate the role') {
      workFlowPageObject = workFlowPage.chooseHowToAllocateRolePage;
    } else if (workFlowPageType === 'Find the person') {
      workFlowPageObject = workFlowPage.findPersonPage;
    } else if (workFlowPageType === 'Duration of role') {
      workFlowPageObject = workFlowPage.durationOfRolePage;
    } else if (workFlowPageType === 'Check your answers' || workFlowPageType === 'Check your changes') {
      workFlowPageObject = workFlowPage.checkYourAnswers;
    } else {
      throw new Error(`work flow page "${workFlowPageType}" is not recognised or not implemented in test step definition.`);
    }
    return workFlowPageObject;
  }

  Then('I see option {string} selected in page duration of role', async function(durationOption){
    const durationOptionInput = workFlowPage.durationOfRolePage.getRadioOptionInputElement(durationOption);
    expect(await durationOptionInput.isSelected()).to.be.true;
  });

