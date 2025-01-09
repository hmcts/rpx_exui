let SearchPage = require('../pageObjects/searchPage.js');
let CaseListPage = require('../pageObjects/CaseListPage');

let TestData = require('../../utils/TestData.js');
const headerPage = require('../pageObjects/headerPage');
Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
CustomError = require('../../utils/errors/custom-error.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY, LOG_LEVELS } = require('../../support/constants');
const CucumberReporter = require('../../support/reportLogger');
const BrowserWaits = require('../../support/customWaits');
const browserUtil = require('../../../ngIntegration/util/browserUtil');
var { Then, When, Given } = require('@cucumber/cucumber');
const { browser } = require('protractor');
const config = require('../../utils/config/config.js');

const RuntimeTestData = require('../../support/runtimeTestData');


let searchPage= new SearchPage();
let caseListPage = new CaseListPage();
When(/^I click on search button$/, async function () {
  await headerPage.clickFindCase();
});

When('I click on Case list', async function(){
  let attemptCounter = 0;
  await BrowserWaits.retryWithActionCallback(async () => {
    if (attemptCounter > 0){
      await headerPage.refreshBrowser();
      await browserUtil.waitForLD();
    }
    attemptCounter++;
    await BrowserWaits.waitForSpinnerToDissappear();
    await headerPage.clickCaseList();
  });
});

Then(/^Search page should be displayed$/, async function () {
  await BrowserWaits.retryWithActionCallback(async () => {
    try{
      expect(await new SearchPage().amOnPage()).to.be.true;
    }catch(err){
      await headerPage.clickFindCase();
    }
  });
});

When(/^I enter mandatory fields jurisdiction,case type and click on apply button$/, async function () {
  browser.sleep(AMAZING_DELAY);
  await searchPage.selectJurisdiction(TestData.jurisdiction);
  browser.sleep(AMAZING_DELAY);
  await searchPage.selectCaseType(TestData.caseTypeIndex);

  await searchPage.clickApplyButton();
});

When('I enter search fields jurisdiction {string} case type {string}', async function (jurisdiction, caseType) {
  await BrowserWaits.retryWithActionCallback(async () => {
    try{
      await searchPage.selectJurisdiction(jurisdiction);
      await searchPage.selectCaseType(caseType);
    }catch(err){
      await CucumberReporter.AddScreenshot(global.screenShotUtils);
      await CucumberReporter.AddMessage('Retrying with page refresh', LOG_LEVELS.Info);
      const currentUrl = await browser.getCurrentUrl();
      if (currentUrl.includes('service-down')){
        await CucumberReporter.AddMessage('Service error occured, clicking find case again', LOG_LEVELS.Error);
        await headerPage.clickFindCase();
      }else{
        await CucumberReporter.AddMessage('Refreshing page', LOG_LEVELS.Info);
        await headerPage.refreshBrowser();
      }
      throw new Error(err);
    }
  });
});

When('I enter search fields jurisdiction {string} case type {string} and click apply', async function (jurisdiction, caseType) {
  await BrowserWaits.retryWithActionCallback(async () => {
    try {
      await searchPage.selectJurisdiction(jurisdiction);
      await searchPage.selectCaseType(caseType);
      await BrowserWaits.waitForElementClickable(searchPage.applyButton);
      await searchPage.clickApplyButton();
    } catch (err) {
      await CucumberReporter.AddScreenshot(global.screenShotUtils);
      await CucumberReporter.AddMessage('Retrying with page refresh', LOG_LEVELS.Info);
      const currentUrl = await browser.getCurrentUrl();
      if (currentUrl.includes('service-down')) {
        await CucumberReporter.AddMessage('Service error occured, clicking find case again', LOG_LEVELS.Warn);
        await headerPage.clickFindCase();
      } else {
        await CucumberReporter.AddMessage('Refreshing page', LOG_LEVELS.Info);
        await headerPage.refreshBrowser();
      }
      throw new Error(err);
    }
  });
});

When('I reset case search fields', async function(){
  await searchPage.clickResetButton();
});

When('I click apply to perform case search', async function () {
  const caseListContainer = $('exui-case-list');
  const searchCasesContainer = $('exui-search-case');

  let isCaseListPage = await caseListContainer.isPresent();
  let isSearchCasesPage = await searchCasesContainer.isPresent();

  await BrowserWaits.retryWithActionCallback(async () => {
    try{
      if (isSearchCasesPage){
        await searchPage.clickApplyButton();
      } else if (isCaseListPage){
        await caseListPage.clickApplyButton();
      }else{
        throw new Error('Not case list or search page to perform filter apply action on workbasket or search inputs.');
      }
    }catch(err){
      CucumberReporter.AddMessage('Retrying steps select inputs and click apply', LOG_LEVELS.Info);

      if (isSearchCasesPage) {
        const caseTypeToSelect = RuntimeTestData.searchCasesInputs.casetype;
        for (const caseType of RuntimeTestData.searchCasesInputs.casetypes) {
          if (caseType !== caseTypeToSelect) {
            await searchPage.selectCaseType(caseType);
            break;
          }
        }
        await BrowserWaits.waitForSeconds(2);
        await searchPage.selectCaseType(caseTypeToSelect);
      } else if (isCaseListPage) {
        const caseTypeToSelect = RuntimeTestData.workbasketInputs.casetype;
        for (const caseType of RuntimeTestData.workbasketInputs.casetypes) {
          if (caseType !== caseTypeToSelect) {
            await caseListPage.selectCaseType(caseType);
            break;
          }
        }
        await BrowserWaits.waitForSeconds(2);
        await caseListPage.selectCaseType(caseTypeToSelect);
      }
      throw new Error(err);
    }
  });
});

When('I open first case in search results', async function () {
  await searchPage.openFirstCaseInResults();
});

Then('I see results returned', async function () {
  const caseListContainer = $('exui-case-list');
  const searchCasesContainer = $('exui-search-case');

  let isCaseListPage = await caseListContainer.isPresent();
  let isSearchCasesPage = await searchCasesContainer.isPresent();

  await BrowserWaits.retryWithActionCallback(async () => {
    try{
      await searchPage.waitForAtleastOneSearchResult();
      await expect(await searchPage.hasSearchReturnedResults()).to.be.true;
    }catch(err){
      CucumberReporter.AddMessage('Retrying steps select inputs and click apply', LOG_LEVELS.Warn);

      if (isSearchCasesPage){
        const caseTypeToSelect = RuntimeTestData.searchCasesInputs.casetype;
        for (const caseType of RuntimeTestData.searchCasesInputs.casetypes) {
          if (caseType !== caseTypeToSelect) {
            await searchPage.selectCaseType(caseType);
            break;
          }
        }
        await BrowserWaits.waitForSeconds(2);
        await searchPage.selectCaseType(caseTypeToSelect);

        await searchPage.clickApplyButton();
      } else if (isCaseListPage){
        const caseTypeToSelect = RuntimeTestData.workbasketInputs.casetype;
        for (const caseType of RuntimeTestData.workbasketInputs.casetypes) {
          if (caseType !== caseTypeToSelect) {
            await caseListPage.selectCaseType(caseType);
            break;
          }
        }
        await BrowserWaits.waitForSeconds(2);
        await caseListPage.selectCaseType(caseTypeToSelect);

        await caseListPage.clickSearchApplyBtn();
      }

      throw new Error(err);
    }
  });
});

Then(/^Case details should be displayed based on selected search criteria$/, async function () {
  var searchPage = new SearchPage();
  expect(await searchPage.amOnPage()).to.be.true;
  expect(await searchPage.hasSearchReturnedResults()).to.be.true;
});

When(/^I select the search criteria details and click on reset button$/, async function () {
  await searchPage.selectJurisdiction(TestData.jurisdiction);
  await searchPage.selectCaseType(TestData.caseTypeIndex);
  await searchPage.clickResetButton();
});
Then(/^search criteria details should be reset$/, async function () {
  expect(await new SearchPage().amOnPage()).to.be.true;
  await searchPage.waitForSearchWithNoResults();
  expect(await searchPage.hasSearchReturnedResults()).to.be.false;
});
