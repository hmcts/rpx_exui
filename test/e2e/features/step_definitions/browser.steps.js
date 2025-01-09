
const BrowserWaits = require('../../support/customWaits');
const ArrayUtil = require('../../utils/ArrayUtil');
var { Then, When, Given } = require('@cucumber/cucumber');
const { browser } = require('protractor');

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const browserutil = require('../../../ngIntegration/util/browserUtil');
const headerPage = require('../../../e2e/features/pageObjects/headerPage');


  Given('I save current window handle reference {string}', async function (windowReference) {
    global.scenarioData['window.' + windowReference] = await browser.driver.getWindowHandle();
  });

  Given('I navigate to page route {string}', async function (pageRoute) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await headerPage.navigateToRoute(pageRoute);
    });
  });

  Then('I see page with css locator {string}', async function(cssLocator){
    await BrowserWaits.waitForElement($(cssLocator), 60*1000);
  });

  Given('I set debug text {string} in element with css selector {string}', async function(debugtext, cssSelector){
    await browserutil.addTextToElementWithCssSelector(cssSelector, debugtext, true);
  });

  Then('I validate debug text {string} not present in element with css selector {string}', async function (debugtext, cssSelector){
    expect(await browserutil.isTextPresentInElementWithCssSelector(cssSelector, debugtext)).to.be.false;
  });

  Given('I navigate to home page', async function () {
    await browserutil.gotoHomePage();
    await BrowserWaits.retryWithActionCallback(async () => {
      await headerPage.waitForPrimaryNavDisplay();
      await browserutil.waitForLD();
      await headerPage.clickAppLogoLink();
    });
  });

  Given('I navigate page route {string}', async function (routeUrl) {
    await browser.get(routeUrl);
    await BrowserWaits.retryWithActionCallback(async () => {
      await headerPage.waitForPrimaryNavDisplay();
      await browserutil.waitForLD();
    });
  });

  Given('I navigate page route {string}, wait for locator {string}', async function (routeUrl, locator) {
    await browser.get(routeUrl);
    await BrowserWaits.retryWithActionCallback(async () => {
      await headerPage.waitForPrimaryNavDisplay();
      await browserutil.waitForLD();
      await BrowserWaits.waitForElement($(locator));
    });
  });

  Then('I validate route guard route {string} with locator {string}, is route allowed? {string}', async function(routeUrl, routePageLocator, isRouteAllowed){
    const exuiRoot = $('exui-root');
    const routePageElement = $(routePageLocator);

    const boolRouteAllowed = isRouteAllowed.toLowerCase().includes('yes') || isRouteAllowed.toLowerCase().includes('true');

    await browser.get(routeUrl);
    if (boolRouteAllowed){
      await BrowserWaits.retryWithActionCallback(async () => {
        await headerPage.waitForPrimaryNavDisplay();
        await browserutil.waitForLD();
        await BrowserWaits.waitForElement(routePageElement);
      });
    }else{
      expect(exuiRoot).to.equal(null);
    }
  });
