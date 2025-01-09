const CreateCaseStartPage = require('../pageObjects/createCaseStartPage.js');
let CreateCaseWizardPage = require('../pageObjects/createCaseWizardPage.js');
let AppealCreatedPage = require('../pageObjects/appealCreatedPage.js');
let CaseCreatedPage = require('../pageObjects/caseCreatedPage.js');
let ProbatePage = require('../pageObjects/probatePage.js');
let DivorcesPage = require('../pageObjects/divorcesPage.js');
let FrUserPage = require('../pageObjects/frUserPage.js');
let ApplyForProbatePage = require('../pageObjects/applyForProbatePage.js');
const headerPage = require('../pageObjects/headerPage');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
let TestData = require('../../utils/TestData.js');
var { When } = require('cucumber');
var { Then } = require('cucumber');
Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
CustomError = require('../../utils/errors/custom-error.js');
var FRCase = require('../pageObjects/FRCase');
var ProbateCase = require('../pageObjects/ProbateCase');

var CaseManager = require('../pageObjects/common/CaseManager');

var { Then, When, Given } = require('@cucumber/cucumber');


  let createCaseStartPage = new CreateCaseStartPage();
  let createWizardPage = new CreateCaseWizardPage();
  let appealCreatedPage = new AppealCreatedPage();
  let probatePage = new ProbatePage();
  let divorcesPage = new DivorcesPage();
  let frUserPage = new FrUserPage();
  let applyForProbatePage = new ApplyForProbatePage();

  let frCase = new FRCase();
  let probateCase = new ProbateCase();

  let caseManager = new CaseManager();

  When('I click on create case button', async function () {
    //await caseListPage.clickCreateNewCaseButton();
    await headerPage.clickCreateCase();
  });

  Then('Create case page should be displayed', async function () {
    expect(await new CreateCaseStartPage().amOnPage()).to.be.true;
  });

  When(/^I enter mandatory probate fields jurisdiction,case type,event and click on start button$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await createCaseStartPage.selectJurisdiction(TestData.probatejurisdiction);
    //await createCaseStartPage.selectCaseType();
    //await createCaseStartPage.selectEvent();
    await createCaseStartPage.clickStartButton();
  });

  Then(/^I should navigate to Case details page$/, async function () {
    expect(await new CreateCaseWizardPage().amOnPage()).to.be.true;
  });

  When(/^I Enter mandatory case details and click on continue button$/, async function () {
    browser.sleep(LONG_DELAY);
    await createWizardPage.clickContinueButton();
  });

  Then(/^I should be on Appeal created page$/, async function () {
    browser.sleep(SHORT_DELAY);
    expect(await new AppealCreatedPage().amOnPage()).to.be.true;
  });

  When(/^I enter event details and click on submit button$/, async function () {
    await appealCreatedPage.enterIntoTextFieldEvent(TestData.eventSummary);
    await appealCreatedPage.enterIntoTextFieldEventDes(TestData.eventDescription);
    await appealCreatedPage.submitCase();
  });

  Then(/^case should be created successfully$/, async function () {
    browser.sleep(LONG_DELAY);
    expect(await new CaseCreatedPage().amOnPage()).to.be.true;
  });

  When(/^I click on cancel button$/, async function () {
    await appealCreatedPage.clickCancelButton();
  });
  Then(/^I should be display the expert ui case list page$/, async function (){
    //await caseListPage.clickCreateNewCaseButton();
  });
  When(/^I click on previous button$/, async function (){
    await appealCreatedPage.clickPreviousButton();
  });

  Then(/^I should be display the Case details page$/, async function (){
    expect(await new CreateCaseWizardPage().amOnPage()).to.be.true;
  });

  Then(/^I should navigate to apply for probate page$/, async function () {
    browser.sleep(AMAZING_DELAY);
    expect(await new ProbatePage().amOnPage()).to.be.true;
  });

  When(/^I Enter mandatory details and click on save and continue button$/, async function () {
    browser.sleep(LONG_DELAY);
    await probatePage.enterFirmName();
    await probatePage.enterPostCodeTextField();
    browser.sleep(LONG_DELAY);
    await probatePage.selectanAddress();
    browser.sleep(AMAZING_DELAY);
    await probatePage.enterReference();
    await probatePage.enterEmailAddress();
    browser.sleep(AMAZING_DELAY);
    await probatePage.clickOnSaveAndContinue();
  });

  Then(/^I should be on check your answers page$/, async function () {
    browser.sleep(LONG_DELAY);
    expect(await new ApplyForProbatePage().amOnPage()).to.be.true;
  });

  When(/^I click on save and continue button$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await applyForProbatePage.clickOnSaveAndContinue();
  });

  Then(/^I should navigate to reason for the divorce page$/, async function () {

  });
  When(/^I enter mandatory divorces fields jurisdiction,case type,event and click on start button$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await createCaseStartPage.selectJurisdiction(TestData.divorcesjurisdiction);
    //await createCaseStartPage.selectCaseType(TestData.divorcescaseType);
    //await createCaseStartPage.selectEvent(TestData.divorceseevent);
    await createCaseStartPage.clickStartButton();
  });

  When(/^I enter mandatory fr fields jurisdiction,case type,event and click on start button$/, async function () {
    await createCaseStartPage.selectJurisdiction('Family Divorce');
    await createCaseStartPage.selectCaseType('Financial Remedy Consented');
    await createCaseStartPage.selectEvent('Consent Order Application');
    await createCaseStartPage.clickStartButton();
  });
