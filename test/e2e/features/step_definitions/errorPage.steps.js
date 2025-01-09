'use strict';

var { Then, When, Given } = require('@cucumber/cucumber');

const BrowserUtil = require('../../../ngIntegration/util/browserUtil');
const errorPage = require('../pageObjects/common/errorPage');
const validationError = require('../pageObjects/common/exuiErrorMessage');

  Then('I see error page with message {string}', async function (errorMessage) {
    const errorMessageDisplayed = await errorPage.getErrorMessage();
    expect(errorMessageDisplayed).to.include(errorMessage);
  });

  Then('I see validation error with message {string}', async function (errorMessage) {
    const errorMessageDisplayed = await errorPage.getErrorMessage();
    expect(errorMessageDisplayed).to.include(errorMessage);
  });

  Then('I see field with text {string} display validation message {string}', async function (fieldText, errorMessage) {
    const actualMessage = await validationError.getFieldLevelErrorMessage(fieldText);
    expect(actualMessage).to.include(errorMessage);
  });
