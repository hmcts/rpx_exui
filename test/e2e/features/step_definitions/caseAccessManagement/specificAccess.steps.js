var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');

const ArrayUtil = require('../../../utils/ArrayUtil');

const workFlowPage = require('../../pageObjects/caseAccessManagement/SARWorkflow');


  const reviewSARPage = workFlowPage.reviewRequestPage;
  const durationSelectionPage = workFlowPage.durationSelectionPage;

  Then('I see Review specific access page with header {string} is displayed', async function (header) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await reviewSARPage.container.isDisplayed(), 'Review page not displayed').to.be.true;
      expect(await reviewSARPage.header.getText(), 'does not match').to.include(header);
    });
  });

  Then('I validate Review specific access page access request details', async function (datatable) {
    const requestDetails = datatable.rowsHash();
    await BrowserWaits.retryWithActionCallback(async () => {
      const actualRequestDetails = await reviewSARPage.getAccessRequestDetails();
      const expectedRowHeaders = Object.keys(requestDetails);
      const actualRowHeaders = Object.keys(actualRequestDetails);
      expectedRowHeaders.forEach((expectedRowKey) => {
        expect(actualRowHeaders, 'Missing request details row').to.includes(expectedRowKey);
        expect(actualRequestDetails[expectedRowKey], `${expectedRowKey} request details missmatch `).to.includes(requestDetails[expectedRowKey]);
      });
    });
  });

  Then('I validate Review specific access page radio options for actions', async function (datatable) {
    const radioOptions = datatable.hashes();
    const expectedOptions = radioOptions.map((hashOption) => hashOption.option);

    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await reviewSARPage.chooseRadioOptionsContainer.isDisplayed(), 'Action radio options not displayed').to.be.true;
      expectedOptions.forEach(async (expectedOption) => {
        expect(await reviewSARPage.chooseRadioOptionsContainer.isRadioOptionPresent(expectedOption), `${expectedOption} not present`).to.be.true;
      });
    });
  });

  Then('I see Approve specific access work flow page {string} with caption {string} is displayed', async function (header, captionHeader) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await durationSelectionPage.isDisplayed(), `${header} work flow page not displayed`).to.be.true;
      expect(await durationSelectionPage.getHeaderText(), `${header} work flow page header not matching`).to.include(header);
      expect(await durationSelectionPage.getHeaderCaption(), `${header} work flow page header caption not matching`).to.include(captionHeader);
    });
  });

  When('I click continue in specific access request work flow', async function () {
    await workFlowPage.continueBtn.click();
  });

  When('I select duration option {string} in approve speific access request work flow', async function (durationOption) {
    await durationSelectionPage.selectRadioOption(durationOption);
  });

  Then('I validate duration option {string} has caption text {string} in approve speific access request work flow', async function (durationOption, caption) {
    const actualCaption = await durationSelectionPage.getRadioOptionCaptionText(durationOption);
    expect(actualCaption).to.include(caption);
  });

  Then('I validate date input field {string} is displayed {string} in approve pecific access  request work flow page', async function (dateInputLabel, displayStatus) {
    const isDisplayed = await durationSelectionPage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.equal(displayStatus.toLowerCase().includes('yes'));
  });

  Then('I validate date input field {string} displayed in approve pecific access request work flow page', async function (dateInputLabel) {
    const isDisplayed = await durationSelectionPage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.be.true;
  });

  Then('I validate date input field {string} NOT displayed in approve pecific access request work flow page', async function (dateInputLabel) {
    const isDisplayed = await durationSelectionPage.isDateInputWithLabelDisplayed(dateInputLabel);
    expect(isDisplayed).to.be.false;
  });

  When('I enter duration date for field {string} with current date plus {int} days in SAR work flow', async function (dateInputField, bydays) {
    let dateToEnter = new Date();
    dateToEnter.setDate(dateToEnter.getDate() + bydays);
    await durationSelectionPage.enterDayInDateInputWithLabel(dateInputField, dateToEnter.getDate());
    await durationSelectionPage.enterMonthInDateInputWithLabel(dateInputField, dateToEnter.getMonth() + 1);
    await durationSelectionPage.enterYearInDateInputWithLabel(dateInputField, dateToEnter.getFullYear());
  });

  When('I enter duration date for field {string} with current date minus {int} days in SAR work flow', async function (dateInputField, bydays) {
    let dateToEnter = new Date();
    dateToEnter.setDate(dateToEnter.getDate() - bydays);
    await durationSelectionPage.enterDayInDateInputWithLabel(dateInputField, dateToEnter.getDay());
    await durationSelectionPage.enterMonthInDateInputWithLabel(dateInputField, dateToEnter.getMonth() + 1);
    await durationSelectionPage.enterYearInDateInputWithLabel(dateInputField, dateToEnter.getFullYear());
  });

  Then('I validate another period field {string} validation error displayed is {string} in SAR work flow', async function (field, isDisplayed) {
    expect(await durationSelectionPage.isValidationErrorDisplayedForDateInput(field)).to.equal(isDisplayed.toLowerCase().includes('true'));
  });

  Then('I validate another period field {string} validation error message is {string} in SAR work flow', async function (field, validationMessage) {
    expect(await durationSelectionPage.getAnotherPeriodValidationMessageForField(field)).to.contains(validationMessage);
  });

  Then('I see option {string} selected in duration selection of approve speific access request work flow', async function (durationOption) {
    const durationOptionInput = durationSelectionPage.getRadioOptionInputElement(durationOption);
    expect(await durationOptionInput.isSelected()).to.be.true;
  });

  Then('I validate SAR page, error message displayed for option to select', async function(){
    expect(await reviewSARPage.chooseRadioOptionsContainer.isValidationErrorMessageDisplayed(), 'Inline error message not displayed').to.be.true;
  });

  When('I select SAR action radio option {string}', async function(option){
    await reviewSARPage.chooseRadioOptionsContainer.selectRadioOption(option);
  });

  Then('I validate date input field {string} is displayed {string} in SAR work flow page', async function(datInputField, state){
    const expectedVisibility = state.toLowerCase().includes('yes') || state.toLowerCase().includes('true');
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await durationSelectionPage.isDateInputWithLabelDisplayed(datInputField)).to.equal(expectedVisibility);
    });
  });

  Then('I see SAR action {string} confirmation page', async function(action){
    // step definition code here
    if(action.toLowerCase() === 'approved'){
      await workFlowPage.approveConfirmationPage.waitForContainer();
      const header = await workFlowPage.approveConfirmationPage.header.getText();
      const detailsParaText = await workFlowPage.approveConfirmationPage.detailsPara.getText();

      expect(header).to.includes('Access approved');
      expect(detailsParaText).to.includes('The requester has been granted access to this case.');
    }

    if (action.toLowerCase() === 'denied' || action.toLowerCase() === 'reject') {
      await workFlowPage.rejectConfirmationPage.waitForContainer();

      const header = await workFlowPage.rejectConfirmationPage.header.getText();
      const detailsParaText = await workFlowPage.rejectConfirmationPage.detailsPara.getText();

      expect(header).to.includes('Request for access denied');
      expect(detailsParaText).to.includes('The requester has been denied access to this case.');
    }
  });

  Then('I validate SAR, request more information page displayed', async function () {
    expect(await workFlowPage.requestMoreInfoPage.isDisplayed()).to.be.true;
  });

  When('I am in SAR request more information page, enter in text area {string}', async function (moreInfotext) {
    await workFlowPage.requestMoreInfoPage.enterInTextArea(moreInfotext);
  });

