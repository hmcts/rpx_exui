var CaseManager = require('../pageObjects/common/CaseManager');
const BrowserWaits = require('../../support/customWaits');
const CucumberReportLogger = require('../../support/reportLogger');
var CaseEditPage = require('../pageObjects/caseEditPage');

var { Then, When, Given } = require('@cucumber/cucumber');


  let caseEditPage = new CaseEditPage();
  let caseManager = new CaseManager();

  Then('Validate workbasket inputs against the API response', async function () {
    let reqPath = 'data/internal/case-types/xuiTestCaseType/work-basket-inputs';
    await caseEditPage.validateWorkbasketInputs(reqPath);
  });

  Then('Validate workbasket inputs complex values against the API response', async function () {
    let reqPath = 'data/internal/case-types/xuiTestCaseType/work-basket-inputs';
    await caseEditPage.validateWorkbasketInputsComplexValues(reqPath);
  });

  Then('validating the case list header against the api response', { timeout: 120 * 1000 }, async function () {
    let reqPath = 'data/internal/searchCases?ctid=xuiTestCaseType&use_case=WORKBASKET&view=WORKBASKET&state=caseAdded&page=1';
    let expectedList = await caseEditPage.caseResultsThTitleApiRes(reqPath);
    if (expectedList) {
      let e = $('.case-list-component ccd-search-result h2');
      await BrowserWaits.waitForElement(e);
      await BrowserWaits.waitForElementTime($('ccd-search-result .pagination-top'), 120000);
      let actualList = await caseEditPage.workBasketHeaders(0);
      expect(actualList).to.eql(expectedList);
    }
  });

  Then('Validate search inputs against the API response', async function () {
    let reqPath = 'data/internal/case-types/xuiTestCaseType/search-inputs';
    await caseEditPage.validateSearchInputs(reqPath);
  });

  Then('Validating the search inputs case list headers against api response', { timeout: 120 * 1000 }, async function () {
    let reqPath = 'data/internal/searchCases?ctid=xuiTestCaseType&use_case=SEARCH&view=SEARCH&page=1';
    let expectedList = await caseEditPage.caseResultsThTitleApiRes(reqPath);
    if (expectedList) {
      let e = $('exui-search-case ccd-search-result h2');
      await BrowserWaits.waitForElement(e);
      await BrowserWaits.waitForElementTime($('ccd-search-result .pagination-top'), 120000);
      let actualList = await caseEditPage.workBasketHeaders(0);
      expect(actualList).to.eql(expectedList);
    }
  });

  Then('I should be able to see tabs in case details page', async function () {
    await caseEditPage.seeCaseDetailsPageTabs();
  });

  Then('I should be validate tab details in case details page', async function () {
    await caseEditPage.caseDetailsCheck();
  });

  Then('Validate Case event next step trigger actions', async function () {
    let apiRes = await caseEditPage.nextStepTriggerApiRes();
    let expectedList = await caseEditPage.nextStepTriggerActions();
    expect(expectedList).to.deep.include.members(apiRes);
  });

  Then('Validate Case event update populating form page', async function () {
    await caseEditPage.clickNextStepTriggerActions();
  });

  Then('Validate create case form pages fields against the api response', async function () {
    var caseData = {
      'Reference': '1610530255167708',
      'Appicant Postcode': 'SW19 8JW'
    };
    await caseManager.createCase(caseData, false, true);
  });

  Then('I should be able to fill the form pages', async function () {
    var caseData = {
      'Reference': '1610530255167708',
      'Appicant Postcode': 'SW19 8JW'
    };
    await caseManager.createCase(caseData, false);
  });

  Then('Should be able to see check your answers summary page links', async function () {
    await caseEditPage.validateSummeryPageLinks();
  });

  Then('Validate check your answer summery page', async function () {
    let data = await caseManager._appendFormPageValues('', '', 'caseEditPage');
    await caseEditPage.validateCheckYouranswerPage(data);
  });

  Then('Validate mandatory fields functionality', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      await caseEditPage.validateMandatoryFields();
    });
  });

  Then('Validate event pages display show condition logic', async function(){
    await caseEditPage.eventPageDisplayShowCondition();
  });
