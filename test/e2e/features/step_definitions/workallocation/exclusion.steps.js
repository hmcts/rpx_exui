var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');

const ArrayUtil = require('../../../utils/ArrayUtil');

const exclusionWorkFlow = require('../../pageObjects/workAllocation/exclusionRolesWorkFlow');


  Then('I see Add an exclusion work flow page {string} is displayed', async function (workFlowPage) {
    let workFlowPageObject = getWorkflowPageObject(workFlowPage);

    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await workFlowPageObject.isDisplayed(), `${workFlowPage} work flow page not displayed`).to.be.true;
      expect(await workFlowPageObject.getHeaderText(), `${workFlowPage} work flow page header not matching`).to.include(workFlowPage);
      expect(await workFlowPageObject.getHeaderCaption(), `${workFlowPage} work flow page header caption not matching`).to.include('Add an exclusion');
    });
  });

  When('I select Choose who the exclusion is for option {string} in add exclusion work flow', async function (whoTheExclusionIsForOption) {
    await exclusionWorkFlow.chooseWhoExclusion.selectRadioOption(whoTheExclusionIsForOption);
  });

  When('I click continue in add exclusion work flow page {string}', async function (workFlowPage) {
    await exclusionWorkFlow.workFlowContainer.clickContinue();
  });

  When('I select Choose the person\'s role option {string} in add exclusion work flow', async function (excludeRoleOption) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await exclusionWorkFlow.choosePersonRole.selectRadioOption(excludeRoleOption);
    });
  });

  When('I enter description {string} in add exclusion Describe the exclusion page', async function (exclusionDescription) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await exclusionWorkFlow.describeExclusion.enterExclusionDescription(exclusionDescription);
    });
  });

  When('I search with text {string} in Find the person page of exclusion work flow', async function (searchText) {
    await exclusionWorkFlow.findPersonPage.inputSearchTerm(searchText);
  });

  When('I search for caseworker from reference {string} in Find the person page of exclusion work flow', async function (caseworkerRef) {
    const caseWorker = global.scenarioData[caseworkerRef];
    await exclusionWorkFlow.findPersonPage.inputSearchTerm(caseWorker.firstName);
  });

  Then('I see following options returned to Select in Find person search result of exclusions work flow', async function (resultsDatatable) {
    const dataTablehashes = resultsDatatable.hashes();
    let retryCounter = 0;
    await BrowserWaits.retryWithActionCallback(async () => {
      await BrowserWaits.waitForSeconds(0.5);
      retryCounter++;
      for (let i = 0; i < dataTablehashes.length; i++) {
        const expectedPerson = dataTablehashes[i]['Person'];
        const personExpectedIsReturned = await exclusionWorkFlow.findPersonPage.isPersonReturned(expectedPerson);
        expect(personExpectedIsReturned, `${expectedPerson} is expected to retun in find person search is not retuned.`).to.be.true;
      }
    });
  });

  Then('I see caseworker from reference {string} returned to Select in Find person search result of exclusions work flow', async function(caseworkerRef){
    const caseworker = global.scenarioData[caseworkerRef];
    await BrowserWaits.retryWithActionCallback(async () => {
      const personExpectedIsReturned = await exclusionWorkFlow.findPersonPage.isPersonReturned(caseworker.email);
    });
  });

  When('I select Person {string} from Find person search result in exclusions work flow', async function (selectPerson) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await exclusionWorkFlow.findPersonPage.selectPerson(selectPerson);
    });
  });

  Then('I see Person {string} is selected in Find person exclusions work flow', async function (selectPerson) {
    await exclusionWorkFlow.findPersonPage.isPersonSelected(selectPerson);
  });

  When('I select caseworker with reference {string} from Find person search result in exclusions work flow', async function (caseworkerRef) {
    const caseworker = global.scenarioData[caseworkerRef];
    await exclusionWorkFlow.findPersonPage.selectPerson(caseworker.email);
  });

  function getWorkflowPageObject(workFlowPage) {
    let workFlowPageObject = null;

    if (workFlowPage === 'Choose who the exclusion is for') {
      workFlowPageObject = exclusionWorkFlow.chooseWhoExclusion;
    } else if (workFlowPage === 'Choose the person\'s role') {
      workFlowPageObject = exclusionWorkFlow.choosePersonRole;
    } else if (workFlowPage === 'Find the person') {
      workFlowPageObject = exclusionWorkFlow.findPersonPage;
    } else if (workFlowPage === 'Describe the exclusion') {
      workFlowPageObject = exclusionWorkFlow.describeExclusion;
    } else if (workFlowPage === 'Check your answers') {
      workFlowPageObject = exclusionWorkFlow.checkYourAnswers;
    } else {
      throw new Error(`work flow page "${workFlowPage}" is not recognised or not implemented in test step definition.`);
    }
    return workFlowPageObject;
  }
