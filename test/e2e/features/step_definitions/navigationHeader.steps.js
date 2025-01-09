const headerPage = require('../pageObjects/headerPage');
const browserWaits = require('../../support/customWaits');
const cucumberReporter = require('../../support/reportLogger');
var { Then, When, Given } = require('@cucumber/cucumber');
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const constants = require('../../support/constants');
const featureToggleUtil = require('../../../ngIntegration/util/featureToggleUtil');
const browserUtil = require('../../../ngIntegration/util/browserUtil');
const headerpage = require('../pageObjects/headerPage');
const config = require('../../config/conf.js');
const reportLogger = require('../../support/reportLogger');
const { LOG_LEVELS } = require('../../support/constants');

const appTestData = require('../../config/appTestConfig');


  Then('I see header tab Task list', async function () {
    expect(await headerPage.isTabPresent('Task list'), 'Task list tab is not present').to.be.true;
  });

  Then('I see header tab Task manager', async function () {
    expect(await headerPage.isTabPresent('Task manager'), 'Task manager tab is not present').to.be.true;
  });

  When('I click on primary navigation header {string}', async function (headerTabLabel) {
    await headerPage.clickPrimaryNavigationWithLabel(headerTabLabel);
  });

  When('I click on header tab Task list', async function () {
    await headerPage.clickTaskList();
  });

  When('I click on header tab Task manager', async function () {
    await headerPage.clickTaskManager();
  });

  When('I click on primary navigation header tab {string}', async function (headerTabLabel) {
    await headerPage.clickPrimaryNavigationWithLabel(headerTabLabel);
  });

  When('I validate primary navigation items count {int}', async function (count) {
    let actual = await headerPage.getMenuItemsCount();
    expect(actual, `expected menu items displayed to be ${count} actual ${actual} `).to.equal(count);
  });

  When('I click on primary navigation header tab {string}, I see selected tab page displayed', async function (headerTabLabel) {
    await browserWaits.retryWithActionCallback(async () => {
      try{
        await headerPage.clickPrimaryNavigationWithLabel(headerTabLabel);
        expect(await headerPage.isPrimaryTabPageDisplayed(headerTabLabel)).to.be.true;
      }catch(err){
        await headerPage.refreshBrowser();
        throw new Error(err);
      }
    });
  });

  Then('I see navigation header tab page {string}', async function(headerTab){
    expect(await headerPage.isPrimaryTabPageDisplayed(headerTab)).to.be.true;
  });

  Then('I see primary navigation tab {string} in header', async function (headerlabel) {
    try{
      await browserWaits.waitForConditionAsync(async () => {
        return await headerPage.isTabPresent(headerlabel);
      });
    }catch(err){

    }

    expect(await headerPage.isTabPresent(headerlabel), headerlabel + ' tab is not present in ' + await headerPage.getPrimaryTabsDisplayed()).to.be.true;
  });

  Then('I see primary navigation tabs {string} in main header', async function (navigationTabs) {
    await browserWaits.retryWithActionCallback(async () => {
      await browserUtil.waitForLD();
      try{
        const softAssert = new SoftAssert();
        const navigationTabsArr = navigationTabs.split(',');

        for (let i = 0; i < navigationTabsArr.length; i++) {
          const headerlabel = navigationTabsArr[i].trim();
          try {
            await browserWaits.retryWithActionCallback(async () => {
              return await headerPage.isTabPresentInMainNav(headerlabel);
            });
          } catch (err) {
            reportLogger.AddMessage(`Expected main nav tab "${headerlabel}" not present in "${navigationTabsArr}"`, LOG_LEVELS.Error);
          }
          softAssert.setScenario('Nav header in main tab ' + headerlabel);
          await softAssert.assert(async () => expect(await headerPage.isTabPresentInMainNav(headerlabel), headerlabel + ' tab is not present main nav in ' + await headerPage.getPrimaryTabsDisplayed()).to.be.true);
        }
        softAssert.finally();
      }catch(err){
        await headerPage.refreshBrowser();
        throw new Error(err);
      }
    });
  });

  Then('I do not see primary navigation tabs does not exist excluding {string}', async function (displayedTabs, allTabsDatatable) {
    await browserUtil.waitForLD();
    const tableHashes = allTabsDatatable.hashes();
    const displayedTabArr = [];
    for (const dusplayedTab of displayedTabs.split(',')){
      displayedTabArr.push(dusplayedTab.trim());
    }
    const navigationTabsArr = [];
    for (const hash of tableHashes){
      if (!displayedTabArr.includes(hash.Tabs)){
        navigationTabsArr.push(hash.Tabs);
      }
    }

    cucumberReporter.AddMessage('Tabs not to be displaued ' + navigationTabsArr, LOG_LEVELS.Info);
    await browserWaits.retryWithActionCallback(async () => {
      try {
        const softAssert = new SoftAssert();
        for (let i = 0; i < navigationTabsArr.length; i++) {
          const headerlabel = navigationTabsArr[i].trim();
          try {
            await browserWaits.waitForConditionAsync(async () => {
              return !(await headerPage.isTabPresentInMainNav(headerlabel));
            });
          } catch (err) {

          }
          softAssert.setScenario('Nav header in main tab ' + headerlabel);
          await softAssert.assert(async () => expect(await headerPage.isTabPresentInMainNav(headerlabel), headerlabel + ' tab is present main nav in ' + await headerPage.getPrimaryTabsDisplayed()).to.be.false);
        }
        softAssert.finally();
      } catch (err) {
        await browser.get(config.config.baseUrl);
        throw new Error(err);
      }
    });
  });

  Then('I see primary navigation tabs {string} in right side header column', async function (navigationTabs) {
    await browserWaits.retryWithActionCallback(async () => {
      await browserUtil.waitForLD();
      try{
        const softAssert = new SoftAssert();
        const navigationTabsArr = navigationTabs.split(',');

        for (let i = 0; i < navigationTabsArr.length; i++) {
          const headerlabel = navigationTabsArr[i].trim();
          try {
            await browserWaits.waitForConditionAsync(async () => {
              return await headerPage.isTabPresentInMainNav(headerlabel);
            });
          } catch (err) {

          }
          softAssert.setScenario('Nav header in main tab ' + headerlabel);
          await softAssert.assert(async () => expect(await headerPage.isTabPresentInRightNav(headerlabel), headerlabel + ' tab is not present main nav in ' + await headerPage.getPrimaryTabsDisplayed()).to.be.true);
        }
        softAssert.finally();
      }catch(err){
        await browser.get(config.config.baseUrl);
        throw new Error(err);
      }
    });
  });

  Then('I do not see primary navigation tab {string} in header', async function (headerlabel) {
    try{
      await browserWaits.waitForConditionAsync(async () => {
        return !(await headerPage.isTabPresent(headerlabel));
      });
    }catch(err){

    }

    expect(await headerPage.isTabPresent(headerlabel), headerlabel + ' tab is not expected to present ' + await headerPage.getPrimaryTabsDisplayed()).to.be.false;
  });

  Then('I validate header displayed for user type {string}', async function(userType){
    await browserWaits.retryWithActionCallback(async () => {
      await browserUtil.waitForLD();
      try{
        await browserWaits.retryWithActionCallback(async () => {
          try {
            await headerPage.validateHeaderDisplayedForUserType(userType);
          } catch (err) {
            await headerpage.clickManageCases();
            throw new Error(err);
          }
        });
      }catch(err){
        const baseUrl = process.env.TEST_URL ? process.env.TEST_URL : 'http://localhost:3000/';
        await browser.get(baseUrl);
        await headerpage.click();
        await browserUtil.waitForLD();
        throw new Error(err);
      }
    });
  });

  Then('I validate 16-digit Case reference search box isDisplayed? is {string}', async function(isDisplayed){
    isDisplayed = isDisplayed.toLowerCase();
    expect(await headerPage.caseReferenceSearchBox.isPresent()).to.equal(isDisplayed.includes('yes') || isDisplayed.includes('true'));
  });

  Then('I validate primary navigation headers not displayed', async function () {
    const tabsDisplayed = await headerPage.getPrimaryTabsDisplayed();
    expect(tabsDisplayed.length).to.equal(0);
  });

  When('If env is {string}, I enter {string} in  case ref in header 16 digit ref search', async function (env, input) {
    if (appTestData.getTestEnvFromEnviornment() === env){
      await browserWaits.waitForSpinnerToDissappear();
      await headerPage.headerCaseRefSearch.searchInput(input);
    }
  });

  When('I click find in case ref in header 16 digit ref search', async function () {
    await browserWaits.retryWithActionCallback(async () => {
      await headerPage.headerCaseRefSearch.clickFind();
    });
  });
