
var ShareCasePage = require('../pageObjects/shareCasePage');
var ShareCaseCheckAndConfirmPage = require('../pageObjects/shareCaseCheckAndConfirmPage');

const BrowserWaits = require('../../support/customWaits');

var { Then, When, Given } = require('@cucumber/cucumber');
const { browser } = require('protractor');


var shareCasePage = new ShareCasePage();
var shareCaseCheckAndConfirmPage = new ShareCaseCheckAndConfirmPage();

Then('I see Share Case page is displayed', async function () {
  expect(await shareCasePage.amOnPage()).to.be.true;
});

Then('I see Share case page has {int} cases listed', async function (selectedCasesCount) {
  expect(await shareCasePage.casesCount(), 'Cases count listed does not match expected').to.be.equal(selectedCasesCount);
});

Then('I see message {string} with all cases deselected', async function (message) {
  expect(await shareCasePage.getMessageDisplayedInNoCasesDisplayed(), 'Message does not match with expected').to.be.equal(message);
});

When('I click deselect button for case {int} from share case page', async function (caseNumber) {
  await shareCasePage.clickDeselectCase(caseNumber);
});

When('I click back link in share case page', async function () {
  await shareCasePage.clickBackLink();
});

Then('I see share case page, case {int} has details collpased', async function (caseNum) {
  await BrowserWaits.waitForCondition(async () => {
    console.log('Retry Checking selected details collapsed');
    return !(await shareCasePage.isCaseContentDisplayed(caseNum));
  });
  expect(await shareCasePage.isCaseContentDisplayed(caseNum)).to.be.false;
});

Then('I see share case page, case {int} has details expanded', async function (caseNum) {
  await BrowserWaits.waitForCondition(async () => {
    return (await shareCasePage.isCaseContentDisplayed(caseNum));
  });
  expect(await shareCasePage.isCaseContentDisplayed(caseNum)).to.be.true;
});

When('I click case {int} expand/collapse icon in share case page', async function (caseNum) {
  await shareCasePage.clickCaseDetailsExpandCollapseBtn(caseNum);
});

When('I click OpenAll/CloseAll in share case page', async function () {
  await shareCasePage.clickOpenOrCloseAllLink();
});

Then('I see OpenAll/CloseAll text displayed as {string} in share case page', async function (linkText) {
  expect(await shareCasePage.getLinkTextForOpenOrCloseAlllink()).to.include(linkText);
});

When('I enter text {string} in user email in share case page', async function (text) {
  await shareCasePage.enterUserEmailToSelect(text);
});

Then('I see users list filtered with containing text {string}', async function (text) {
  let useremailsArr = await shareCasePage.getFilteredUserNameEmails();
  for(let i = 0; i < useremailsArr.length; i++){
    expect(useremailsArr[i]).to.include(text);
  }
});

Then('I see user Add button is enabled in share case page', async function () {
  expect(await shareCasePage.isAddButtonEnabled()).to.be.true;
});

Then('I see user Add button is disabled in share case page', async function () {
  expect(await shareCasePage.isAddButtonEnabled()).to.be.false;
});

When('I select a user not shared with atleast one case listed in share case page', async function () {
  await shareCasePage.selectUserWithEmail_Not_SharedWithAtLeastOneCase();
});

When('I select a user already shared with atleast one case listed in share case page', async function () {
  await shareCasePage.selectUserWithEmail_SharedWithAtLeastOneCase();
});

When('I click Add user button in share case page', async function () {
  await shareCasePage.clickAddUserbutton();
});

Then('I see last added user is marked as to be added in cases', async function () {
  expect(await shareCasePage.isLastAddedUserListedInAllCases(), 'case(s) in share case list does not have user in list').to.be.true;
  expect(await shareCasePage.isLastAddedUserMarkedTobeAddedInAnyCase(), 'case(s) in share case list not marked to be . added').to.be.true;
});

When('I click Remove link for a user already shared a case', async function () {
  await shareCasePage.clickRemoveForAUserInListedCases();
});

Then('I see a user is marked to be removed in a listed case', async function () {
  expect(await shareCasePage.isAnyUserMarkedToBeRemoved(), 'case(s) in share case list does not have a user marked to be removed').to.be.true;
});

Then('I see share case changes persisted in displayed in Share Case page', async function () {
  let issuesList = await shareCasePage.validateShareCaseChangesPersisted();
  expect(issuesList.length, 'issues with changes persist : ' + JSON.stringify(issuesList)).to.equal(0);
});

When('I click continue in share case page', async function () {
  await shareCasePage.clickContinueButton();
});

//Share Case Confirm Selection Steps
