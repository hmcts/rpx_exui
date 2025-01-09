'use strict';

var { Then, When, Given } = require('@cucumber/cucumber');
const CucumberReportLogger = require('../../../e2e/support/reportLogger');
const BrowserUtil = require('../../../ngIntegration/util/browserUtil');
const errorPage = require('../pageObjects/common/errorPage');
const BrowserWaits = require('../../support/customWaits');
const globalSearchPage = require('../pageObjects/globalSearchCases');
const globalSearchResultsPage = require('../pageObjects/globalSearchResultsPage');

const headerPage = require('../pageObjects/headerPage');
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const CaseManager = require('../pageObjects/common/CaseManager');

  const caseManager = new CaseManager();
  When('I input case reference in header search field {string}', async function(caseRef){
    await headerPage.headerSearch.input.clear();
    await headerPage.headerSearch.input.sendKeys(caseRef);
  });

  When('I click find in header search', async function () {
    await headerPage.headerSearch.button.click();
  });

  When('I validate case search field is displayed in header', async function () {
    expect(await headerPage.headerSearch.container.isDisplayed()).to.be.true;
  });

  Then('I see global search Page', async function(){
    expect(await globalSearchPage.amOnPage()).to.be.true;
  });

  When('I click search button in global search page', async function(){
    await globalSearchPage.searchButton.click();
  });

  Then('I see global search results page', async function(){
    expect(await globalSearchResultsPage.amOnPage()).to.be.true;
  });

  When('I click Change search link in global search results page', async function(){
    await globalSearchResultsPage.changeSearchLink.click();
  });

  When('I click Change search link in global search results page, then I see global search Page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await globalSearchResultsPage.changeSearchLink.click();
      expect(await globalSearchPage.amOnPage()).to.be.true;
    });
  });

  When('I input field {string} with value {string} in global search Page', async function(fieldName, fieldValue){
    switch(fieldName.toLowerCase()){
      case '16-digit case reference':
        await globalSearchPage.caseReference.inputText(fieldValue);
        break;
      case 'other reference':
        await globalSearchPage.otherReference.inputText(fieldValue);
        break;
      case 'name':
        await globalSearchPage.fullName.inputText(fieldValue);
        break;
      case 'first line of address':
        await globalSearchPage.firstLineOfAddress.inputText(fieldValue);
        break;
      case 'postcode':
        await globalSearchPage.postCode.inputText(fieldValue);
        break;
      case 'email address':
        await globalSearchPage.emailAddress.inputText(fieldValue);
        break;
      default:
        throw new Error(`Field ${fieldName} is not recognised in test`);
    }
  });

  Then('I validate input field {string} has value {string} in global search page', async function(fieldName, fieldValue){
    let dateSplitArr = null;
    switch(fieldName.toLowerCase()){
      case '16-digit case reference':
        expect(await globalSearchPage.caseReference.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'other reference':
        expect(await globalSearchPage.otherReference.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'name':
        expect(await globalSearchPage.fullName.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'first line of address':
        expect(await globalSearchPage.firstLineOfAddress.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'postcode':
        expect(await globalSearchPage.postCode.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'email address':
        expect(await globalSearchPage.emailAddress.getInputFieldValue()).to.includes(fieldValue);
        break;
      case 'date of birth':
        if(fieldValue === ''){
          expect(await globalSearchPage.dateOfBirth.getDayValue()).to.equal('');
          expect(await globalSearchPage.dateOfBirth.getMonthValue()).to.equal('');
          expect(await globalSearchPage.dateOfBirth.getYearValue()).to.equal('');
        }else{
          dateSplitArr = fieldValue.split('-');
          expect(await globalSearchPage.dateOfBirth.getDayValue()).to.includes(dateSplitArr[0]);
          expect(await globalSearchPage.dateOfBirth.getMonthValue()).to.includes(dateSplitArr[1]);
          expect(await globalSearchPage.dateOfBirth.getYearValue()).to.includes(dateSplitArr[2]);
        }

        break;
      case 'date of death':
        if(fieldValue === ''){
          expect(await globalSearchPage.dateOfdeath.getDayValue()).to.equal('');
          expect(await globalSearchPage.dateOfdeath.getMonthValue()).to.equal('');
          expect(await globalSearchPage.dateOfdeath.getYearValue()).to.equal('');
        }else{
          dateSplitArr = fieldValue.split('-');
          expect(await globalSearchPage.dateOfdeath.getDayValue()).to.includes(dateSplitArr[0]);
          expect(await globalSearchPage.dateOfdeath.getMonthValue()).to.includes(dateSplitArr[1]);
          expect(await globalSearchPage.dateOfdeath.getYearValue()).to.includes(dateSplitArr[2]);
        }

        break;
      default:
        throw new Error(`Field ${fieldName} is not recognised in test`);
    }
  });

  When('I input date field {string} with format DD-MM-YYYY {string} in global search page', async function(fieldName, fieldValue){
    const dateValues = fieldValue.split('-');
    if(fieldValue !== '' && dateValues.length !== 3){
      throw new Error(`Date value ${fieldValue} not in expected format DD-MM-YYYY`);
    }
    switch(fieldName.toLowerCase()){
      case 'date of birth':
        await globalSearchPage.dateOfBirth.day.clear();
        await globalSearchPage.dateOfBirth.month.clear();
        await globalSearchPage.dateOfBirth.year.clear();
        if(fieldValue !== ''){
          await globalSearchPage.dateOfBirth.day.sendKeys(dateValues[0]);
          await globalSearchPage.dateOfBirth.month.sendKeys(dateValues[1]);
          await globalSearchPage.dateOfBirth.year.sendKeys(dateValues[2]);
        }

        break;
      case 'date of death':
        await globalSearchPage.dateOfdeath.day.clear();
        await globalSearchPage.dateOfdeath.month.clear();
        await globalSearchPage.dateOfdeath.year.clear();

        if(fieldValue !== ''){
          await globalSearchPage.dateOfdeath.day.sendKeys(dateValues[0]);
          await globalSearchPage.dateOfdeath.month.sendKeys(dateValues[1]);
          await globalSearchPage.dateOfdeath.year.sendKeys(dateValues[2]);
        }
        break;

      default:
        throw new Error(`Field ${fieldName} is not recognised in test`);
    }
  });

  Then('I see error message {string} for field {string} in global search Page', async function(errormessage, fieldName){
    switch(fieldName.toLowerCase()){
      case '16-digit case reference':
        expect(await globalSearchPage.caseReference.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.caseReference.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'othere reference':
        expect(await globalSearchPage.otherReference.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.otherReference.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'full name':
        expect(await globalSearchPage.fullName.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.fullName.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'first line of address':
        expect(await globalSearchPage.firstLineOfAddress.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.firstLineOfAddress.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'postcode':
        expect(await globalSearchPage.postCode.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.postCode.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'email address':
        expect(await globalSearchPage.emailAddress.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.emailAddress.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'date of birth':
        expect(await globalSearchPage.dateOfBirth.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.dateOfBirth.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'date of death':
        expect(await globalSearchPage.dateOfdeath.isErrorMessageDisplayed()).to.be.true;
        expect(await globalSearchPage.dateOfdeath.getErrorMessageText()).to.includes(errormessage);
        break;
      case 'services':
        // expect(await globalSearchPage.ser.isErrorMessageDisplayed()).to.be.true;
        // expect(await globalSearchPage.otherReference.getErrorMessage()).to.includes(errormessage);
        break;
      default:
        throw new Error(`Field ${fieldName} is not recognised in test`);
    }
    expect(await globalSearchPage.errorSummaryContainer.isPresent() && await globalSearchPage.errorSummaryContainer.isDisplayed()).to.be.true;
    expect(await globalSearchPage.errorSummaryContainer.getText()).to.includes(errormessage);
    await CucumberReportLogger.AddScreenshot(global.screenshotUtils);
  });

  Then('I see error message {string} in global search Page', async function (errormessage) {
    expect(await globalSearchPage.errorSummaryContainer.isPresent() && await globalSearchPage.errorSummaryContainer.isDisplayed()).to.be.true;
    expect(await globalSearchPage.errorSummaryContainer.getText()).to.includes(errormessage);
  });

  Then('I validate global search results displayed count {int}', async function(count){
    let i = 0;
    await BrowserWaits.retryWithActionCallback(async (i) => {
      CucumberReportLogger.AddMessage(`Waiting for ${i*2} sec before validation`);
      await BrowserWaits.waitForSeconds(i* 2);
      expect(await globalSearchResultsPage.getTableRowsCount()).to.equal(count);
      i++;
    });
  });

  Then('I validate global search results displayed', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect((await globalSearchResultsPage.getTableRowsCount()) > 0, 'No results returned or displayed').to.be.true;
    });
  });

  Then('I validate global search results values', async function(datatable){
    const datatableHashes = datatable.hashes();
    for (const tableHash of datatableHashes){
      const columns = Object.keys(tableHash);
      const rowNum = tableHash.Row_Num;

      for (const column of columns){
        if (column === 'Row_Num'){
          //do nothing - test support col
        } else if (column === 'ACTION_LINK_COLUMN'){
          const linkElement = await globalSearchResultsPage.getTableRowColumnElement(rowNum, column);
          const linkText = await linkElement.getText();
          expect(linkText).to.equal(tableHash[column]);
        }else{
          const coltext = await globalSearchResultsPage.getTableRowColumnValue(rowNum, column);
          expect(coltext).to.includes(tableHash[column]);
        }
      }
    }
  });

  Then('I validate global search results values displayed', async function (datatable) {
    const datatableHashes = datatable.hashes();
    for (const tableHash of datatableHashes) {
      const column = tableHash.name;

      const coltext = await globalSearchResultsPage.getTableRowColumnValue(1, column);
      expect(coltext.length > 0, `Column ${column} value not displayed`).to.be.true;
    }
    const linkElement = await globalSearchResultsPage.getTableRowColumnElement(1, 'ACTION_LINK_COLUMN');
    const linkText = await linkElement.getText();

    const possibleLinks = ['Challenged access', 'Specific access', 'View'];
    expect(possibleLinks.includes(linkText), `Link displayed as ${linkText}, expected one of ${possibleLinks}`).to.be.true;
  });

  When('I click action link {string} at row {int} in global search results page', async function (actionLink, rowNum) {
    const linkElement = await globalSearchResultsPage.getTableRowColumnElement(rowNum, 'ACTION_LINK_COLUMN');
    const linkText = await linkElement.getText();
    expect(linkText).to.equal(actionLink);

    await linkElement.$('a').click();
  });

  Then('I validate global search no results page is displayed', async function(){
    expect(await globalSearchResultsPage.isNoResultsPageDisplayed()).to.be.true;
  });

  Then('I validate global searh no results page displays message {string}', async function(message){
    expect(await globalSearchResultsPage.getNoResultsPageMessage()).to.includes(message);
  });

  Then('I validate global search no results back link displayed', async function(){
    expect(await globalSearchResultsPage.noResultsPageBackLink.isDisplayed()).to.be.true;
  });

  When('I click global search no results back link', async function () {
    await globalSearchResultsPage.noResultsPageBackLink.click();
  });

  Then('I validate global search results pagination link {string} is enabled', async function(paginationLink){
    if (paginationLink.toLowerCase().includes('next')){
      expect(await globalSearchResultsPage.nextpageLink.getTagName()).to.equal('a');
    }else{
      expect(await globalSearchResultsPage.previousPageLink.getTagName()).to.equal('a');
    }
  });

  Then('I validate global search results pagination link {string} is disabled', async function (paginationLink) {
    if (paginationLink.toLowerCase().includes('next')) {
      expect(await globalSearchResultsPage.nextpageLink.getTagName()).to.equal('span');
    } else {
      expect(await globalSearchResultsPage.previousPageLink.getTagName()).to.equal('span');
    }
  });

  When('I click global search results pagination link {string}', async function(paginationLink){
    if (paginationLink.toLowerCase().includes('next')) {
      await globalSearchResultsPage.nextpageLink.click();
    } else {
      await globalSearchResultsPage.previousPageLink.click();
    }
  });

  Then('I validate field services has following values in global search page', async function(datatable){
    const optionValues = await globalSearchPage.getServicesFieldsOptions();
    const datatableHashes = datatable.hashes();

    for (const hash of datatableHashes){
      expect(optionValues).to.includes(hash.value);
    }
  });

  Then('I validate valid global search case reference searches', async function(datatable){
    const scenarios = datatable.hashes();
    const softAssert = new SoftAssert();
    for (const scenario of scenarios){
      await headerPage.clickPrimaryNavigationWithLabel('Search');
      expect(await globalSearchPage.amOnPage()).to.be.true;

      softAssert.setScenario(`${scenario.ScenarioDescription} : ${scenario.caseReference}`);
      await headerPage.headerSearch.input.clear();
      await headerPage.headerSearch.input.sendKeys(scenario.caseReference);
      await headerPage.headerSearch.button.click();

      await softAssert.assert(async () => expect(await caseManager.caseDetailsPage.isPresent()).to.be.true);
    }
    softAssert.finally();
  });

  Then('I validate invalid global search case reference searches', async function (datatable) {
    const scenarios = datatable.hashes();
    const softAssert = new SoftAssert();
    for (const scenario of scenarios) {
      await headerPage.clickPrimaryNavigationWithLabel('Search');
      expect(await globalSearchPage.amOnPage()).to.be.true;

      softAssert.setScenario(`${scenario.ScenarioDescription} : ${scenario.caseReference}`);
      await headerPage.headerSearch.input.clear();
      await headerPage.headerSearch.input.sendKeys(scenario.caseReference);
      await headerPage.headerSearch.button.click();

      await softAssert.assert(async () => expect(await globalSearchResultsPage.noResultsPageContainer.isPresent()).to.be.true);
    }
    softAssert.finally();
  });
