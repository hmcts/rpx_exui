
const CucumberReportLogger = require('../../support/reportLogger');

var { Then, When, Given } = require('@cucumber/cucumber');
const ArrayUtil = require('../../utils/ArrayUtil');
const BrowserWaits = require('../../support/customWaits');
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const errorPageObject = require('../pageObjects/common/errorPage');
const MessageBanner = require('../pageObjects/messageBanner');
const exuiErrorMessage = require('../pageObjects/common/exuiErrorMessage');
const headerPage = require('../pageObjects/headerPage');


  const messageBanner = new MessageBanner($('exui-root'));
  Then('I see error message of type {string} displayed with message {string}', async function(errorType, errorMessage){
    const errorTypePage = errorType.toLowerCase();

    await BrowserWaits.retryWithActionCallback(async () => {
      if (errorTypePage.includes('page')) {
        expect(await errorPageObject.isContainerDisplayed()).to.be.true;
        expect(await errorPageObject.getErrorMessage()).to.include(errorMessage);
      } else if (errorTypePage.includes('banner')) {
        expect(await messageBanner.isBannerMessageDisplayed()).to.be.true;
        const bannerMessages = await messageBanner.getBannerMessagesDisplayed();
        const matchingMessages = await ArrayUtil.filter(bannerMessages, async (msg) => {
          return msg.includes(errorMessage);
        });
        expect(matchingMessages.length > 1, `${errorMessage} is not displayed, Actual message(s) ${bannerMessages}`).to.be.true;
      } else if (errorTypePage.includes('message')){
        expect(await exuiErrorMessage.isDisplayed()).to.be.true;
        expect(await exuiErrorMessage.isMessageDisplayedInSummary(errorMessage), 'Message diaplayed does noyt include expected').to.be.true;
      } else {
        throw new Error(`${errorType} is not recognised or not implemented in step definition of tests`);
      }
    });
  });

  Then('I validate for error messge type {string}, if it is banner message I see page {string} displayed', async function (errorType, page){
    await BrowserWaits.retryWithActionCallback(async () => {
      if (errorTypePage.includes('page')) {
        return;
      } else if (errorTypePage.includes('banner')) {
        expect(await messageBanner.isBannerMessageDisplayed()).to.be.true;
        expect(await headerPage.isPrimaryTabPageDisplayed(page)).to.be.true;
      } else {
        throw new Error(`${errorType} is not recognised or not implemented in step definition of tests`);
      }
    });
  });

