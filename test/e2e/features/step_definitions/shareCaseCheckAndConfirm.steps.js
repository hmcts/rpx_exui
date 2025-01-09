
var ShareCaseCheckAndConfirmPage = require('../pageObjects/shareCaseCheckAndConfirmPage');
const BrowserWaits = require('../../support/customWaits');

var { Then, When, Given } = require('@cucumber/cucumber');
const { browser } = require('protractor');


  var shareCaseCheckAndConfirmPage = new ShareCaseCheckAndConfirmPage();

  //Share Case Confirm Selection Steps

  Then('I see Share Case check and confirm page', async function () {
    expect(await shareCaseCheckAndConfirmPage.amOnPage(), 'Share Case Check and confirm page not displayed').to.be.true;
  });

  Then('I see Share Case changes are listed as modified in share case page', async function () {
    let issues = await shareCaseCheckAndConfirmPage.validateShareCaseChangesForListedCases();
    expect(issues.length, 'Share Case check and confirm not matching expected : ' + JSON.stringify(issues)).to.equal(0);
  });

  When('I click back link in Share Case check and confirm page', async function () {
    await shareCaseCheckAndConfirmPage.clickBack();
  });

  When('I click change link for case at pos {int} in Share Case check and confirm page', async function (casePos) {
    await shareCaseCheckAndConfirmPage.clickChangeLinkForCase(casePos);
  });

  When('I click Confirm button in Share Case check and confirm page', async function () {
    await shareCaseCheckAndConfirmPage.clickConfirmBtn();
  });

  Then('I see success message for Share case changes', async function () {
    expect(await shareCaseCheckAndConfirmPage.isSubmissionSuccessful(), 'Share Case changes submission is not successful').to.be.true;
  });
