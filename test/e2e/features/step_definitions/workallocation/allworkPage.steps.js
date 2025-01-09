var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const allWorkPage = require('../../pageObjects/workAllocation/allWorkPage');

const ArrayUtil = require('../../../utils/ArrayUtil');


  const filtersToIgnore = {
    'Priority': 'Is out of scope and will be removed as part of https://tools.hmcts.net/jira/browse/EUI-4809',
    'Task type': 'Is to be includes only in 2.1 till the it will be ignored in test',
    'Person': 'Change in component, test needs update to validate new component'
  };

  Then('I see filter {string} is displayed in all work page', async function(filterItem){
    if (Object.keys(filtersToIgnore).includes(filterItem)){
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }
    expect(await allWorkPage.isFilterItemDisplayed(filterItem)).to.be.true;
  });

  Then('I see filter {string} is not displayed in all work page', async function (filterItem) {
    if (Object.keys(filtersToIgnore).includes(filterItem)) {
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }
    expect(await allWorkPage.isFilterItemDisplayed(filterItem)).to.be.false;
  });

  Then('I see filter {string} is enabled in all work page', async function (filterItem) {
    if (Object.keys(filtersToIgnore).includes(filterItem)) {
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }
    expect(await allWorkPage.isFilterItemEnbled(filterItem)).to.be.true;
  });

  Then('I see filter {string} is disabled in all work page', async function (filterItem) {
    if (Object.keys(filtersToIgnore).includes(filterItem)) {
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }
    expect(await allWorkPage.isFilterItemEnbled(filterItem)).to.be.false;
  });

  Then('I validate filter item {string} select or radio options present in all work page', async function (filterItem, datatable){
    const actualOption = await allWorkPage.getFilterSelectOrRadioOptions(filterItem);

    const hashes = datatable.hashes();
    for (const hash of hashes){
      expect(actualOption).to.includes(hash.option);
    }
  });

  Then('I validate filter item {string} select or radio has option {string} in all work page', async function (filterItem, filterOptions) {
    const actualOption = await allWorkPage.getFilterSelectOrRadioOptions(filterItem);
    reportLogger.AddMessage(`${filterItem} options displayed : ${JSON.stringify(actualOption)}`);

    for (const option of filterOptions.split(',')) {
      expect(actualOption).to.includes(option);
    }
  });

  When('I select filter item {string} select or radio option {string} in all work page', async function (filterItem, option) {
    if (Object.keys(filtersToIgnore).includes(filterItem)) {
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }

    const optionElement = await allWorkPage.setFilterSelectOrRadioOptions(filterItem, option);
  });

  When('I input filter item {string} input text {string} in all work page', async function (filterItem, inputText) {
    if (Object.keys(filtersToIgnore).includes(filterItem)) {
      reportLogger.AddMessage(`${filterItem} in test ignored for reason : ${filtersToIgnore[filterItem]}`);
      return;
    }
    await allWorkPage.inputFilterItem(filterItem, inputText);
  });

  When('I click Apply filter button in all work page', async function(){
    await allWorkPage.filterApplyBtn.click();
  });

  Then('I validate Apply filter button in enabled in all work page', async function () {
    expect(await allWorkPage.filterApplyBtn.isEnabled()).to.be.true;
  });

  Then('I validate Apply filter button in disabled in all work page', async function () {
    expect(await allWorkPage.filterApplyBtn.isEnabled()).to.be.false;
  });

  When('I click Reset filter button in all work page', async function () {
    await allWorkPage.filterResetBtn.click();
  });

  Then('I see location search input is enabled in all work filters', async function () {
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isPresent(), 'Search input not present').to.be.true;
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isDisplayed(), 'Search input not displayed').to.be.true;
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isEnabled(), 'Search input not enabled').to.be.true;
  });

  Then('I see location search input is disabled in all work filters', async function () {
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isPresent(), 'Search input not present').to.be.true;
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isDisplayed(), 'Search input not displayed').to.be.true;
    expect(await allWorkPage.FILTER_ITEMS['Location search'].isEnabled(), 'Search input not disabled').to.be.false;
  });

  When('I enter location search {string} in all work filter', async function (searchTerm) {
    await allWorkPage.FILTER_ITEMS['Location search'].clear();
    await allWorkPage.FILTER_ITEMS['Location search'].sendKeys(searchTerm);
  });

  Then('I see location search results in all work filter', async function (dataTable) {
    const locationsHashes = dataTable.hashes();
    const expectdLocations = [];
    for (const locationsHash of locationsHashes){
      expectdLocations.push(locationsHash.location);
    }
    await BrowserWaits.retryWithActionCallback(async () => {
      const actualResults = await allWorkPage.getSearchResults();
      for (const expectedLoc of expectdLocations) {
        expect(await allWorkPage.isSearchResultPresent(expectedLoc), `Search result ${expectedLoc} not found in actual results "${actualResults}"`).to.be.true;
      }
    });
  });

  When('I select location search result {string} in all work filter', async function (location) {
    await allWorkPage.selectSearchResult(location);
  });

  Then('I see location {string} selected in all work filter', async function (expectedValue) {
    const inputValue = await allWorkPage.FILTER_ITEMS['Location search'].getAttribute('value');
    expect(inputValue).to.includes(expectedValue);
  });

