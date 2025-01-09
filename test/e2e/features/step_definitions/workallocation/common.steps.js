
var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');
const TaskListTable = require('../../pageObjects/workAllocation/taskListTable');
const casesTable = require('../../pageObjects/workAllocation/casesTable');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseListPage = require('../../pageObjects/CaseListPage');

const myWorkPage = require('../../pageObjects/workAllocation/myWorkPage');
const allWorkPage = require('../../pageObjects/workAllocation/allWorkPage');

const taskActionPage = require('.././../pageObjects/workAllocation/taskActionPage');

const ArrayUtil = require('../../../utils/ArrayUtil');
const findPersonPage = require('../../pageObjects/workAllocation/common/findPersonComponent');
const taskCheckYourChangesPage = require('../../pageObjects/workAllocation/taskCheckYourChangesPage');

const workflowUtil = require('../../pageObjects/common/workflowUtil');

const taskListPage = require('../../../../e2e/features/pageObjects/workAllocation/taskListPage');
const { checkYourAnswersHeading } = require('../../../../ngIntegration/tests/pageObjects/ccdCaseEditPages');
const browserUtil = require('../../../../ngIntegration/util/browserUtil');

const taskAssignmentPersonNotAuthorisedPage = require('../../pageObjects/workAllocation/common/taskAssignmentPersonNotAuthorisedPage');


  const taskListTable = new TaskListTable();
  const waCaseListTable = new casesTable();

  Then('I see My work My Tasks page', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      await myWorkPage.amOnPage();
      await myWorkPage.amOnMyTasksTab();
    });
  });

  Then('I see My work Available tasks page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await myWorkPage.amOnPage();
      expect(await myWorkPage.isAvailableTasksDisplayed()).to.be.true;
    });
  });

  Then('I see My work My cases page', async function () {
    throw new Error('Step def not implemented');
  });

  Then('I see All work Tasks page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await allWorkPage.amOnPage();
      expect(await allWorkPage.isTasksContainerDisplayed()).to.be.true;
    });
  });

  Then('I see All work Cases page', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      await allWorkPage.amOnPage();
      expect(await allWorkPage.isCasesContainerDisplayed()).to.be.true;
    });
  });

  Then('I validate task list page results text displayed as {string}', async function (pagnationResultText) {
    expect(await taskListTable.getPaginationResultText()).to.include(pagnationResultText);
  });

  Then('I validate WA case list page results text displayed as {string}', async function (pagnationResultText) {
    expect(await waCaseListTable.getPaginationResultText()).to.include(pagnationResultText);
  });

  Then('I validate task table pagination controls, is displayed state is {string}', async function (isDisplauyed) {
    expect(await taskListTable.isPaginationControlDisplayed()).to.equal(isDisplauyed.toLowerCase() == 'true');
  });

  When('I click task list pagination link {string}', async function (paginationLinktext) {
    await BrowserWaits.waitForSeconds(1);

    await BrowserWaits.waitForConditionAsync(async () => {
      const colCount = await taskListTable.getColumnCount();
      const rowCount = await taskListTable.getTaskListCountInTable();
      return colCount > 0 && rowCount > 0;
    });
    if (paginationLinktext.toLowerCase() === 'next') {
      await taskListTable.pageNextLink.click();
    } else if (paginationLinktext.toLowerCase() === 'previous') {
      await taskListTable.pagePreviousLink.click();
    } else {
      await taskListTable.clickPaginationPageNum(paginationLinktext);
    }
  });

  When('I click WA case list pagination link {string}', async function (paginationLinktext) {
    await BrowserWaits.waitForSeconds(1);

    await BrowserWaits.waitForConditionAsync(async () => {
      const colCount = await waCaseListTable.getColumnCount();
      const rowCount = await waCaseListTable.getTaskListCountInTable();
      return colCount > 0 && rowCount > 0;
    });
    if (paginationLinktext.toLowerCase() === 'next') {
      await waCaseListTable.pageNextLink.click();
    } else if (paginationLinktext.toLowerCase() === 'previous') {
      await waCaseListTable.pagePreviousLink.click();
    } else {
      await waCaseListTable.clickPaginationPageNum(paginationLinktext);
    }
  });

  When('I click task list table header column {string}', async function(columnHeaderLabel){
    await taskListTable.clickColumnHeader(columnHeaderLabel);
  });

  Then('I validate task list table sorted with column {string} in order {string}', async function(columnheaderlabel, sortOrder){
    const columnSortVal = await taskListTable.getColumnSortState(columnheaderlabel);
    expect(columnSortVal).to.include(sortOrder.toLowerCase());
  });

  When('I click task list table header column {string}, I validate task list table sorted with column {string} in order {string}', async function (columnHeaderLabel, columnheaderlabel, sortOrder) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await taskListTable.clickColumnHeader(columnHeaderLabel);
      const columnSortVal = await taskListTable.getColumnSortState(columnheaderlabel);
      await BrowserWaits.waitForConditionAsync(async () => {
        return columnSortVal.includes(sortOrder.toLowerCase());
      }, 3000, 'Sort column state to be ' + sortOrder.toLowerCase());
    });
  });

  Then('I validate task list table columns displayed', async function (datatable) {
    const columnHeadersHash = datatable.hashes();
    const expectdColHeaders = await ArrayUtil.map(columnHeadersHash, (headerhash) => headerhash.ColumnHeader);
    const actualHeadeColumns = await taskListTable.getColumnHeaderNames();
    expect(actualHeadeColumns.length, `Actual Cols ||${actualHeadeColumns}|| !== Expected Cols ||${expectdColHeaders}|| `).to.equal(expectdColHeaders.length);
    expect(actualHeadeColumns, `Actual Cols ||${actualHeadeColumns}|| !== Expected Cols ||${expectdColHeaders}|| `).to.include.members(expectdColHeaders);
  });

  Then('I validate task list table columns displayed for user {string}', async function (userType, datatable) {
    const columnHeadersHash = datatable.hashes();

    const actualHeadeColumns = await taskListTable.getColumnHeaderNames();
    for (const headerHash of columnHeadersHash){
      const columnHeader = headerHash.ColumnHeader;
      if (headerHash[userType].toLowerCase().includes('yes') || headerHash[userType].toLowerCase().includes('true')){
        expect(actualHeadeColumns).to.include(columnHeader);
      }else{
        expect(actualHeadeColumns).to.not.include(columnHeader);
      }
    }
  });

  Then('I validate check your changes table columns displayed for user {string}', async function (userType, datatable) {
    const columnHeadersHash = datatable.hashes();

    const actualHeadeColumns = await taskCheckYourChangesPage.checkYourChangesTable.getHeaders();
    for (const headerHash of columnHeadersHash) {
      const columnHeader = headerHash.ColumnHeader;
      if (headerHash[userType].toLowerCase().includes('yes') || headerHash[userType].toLowerCase().includes('true')) {
        expect(actualHeadeColumns).to.include(columnHeader);
      } else {
        expect(actualHeadeColumns).to.not.include(columnHeader);
      }
    }
  });

  Then('I validate task list columns are links', async function(datatable){
    const columnHeadersHash = datatable.hashes();
    const expectdLinkCols = await ArrayUtil.map(columnHeadersHash, (headerhash) => headerhash.ColumnHeader);

    const actualHeadeColumns = await taskListTable.getColumnHeaderNames();

    const actuallinkColumns = await ArrayUtil.filter(actualHeadeColumns, (headerCol) => {
      return taskListTable.isColValForTaskALink(headerCol, 1);
    });

    expect(actuallinkColumns.length, `Actual Cols ||${actuallinkColumns}|| !== Expected Cols ||${expectdLinkCols}|| `).to.equal(expectdLinkCols.length);
    expect(actuallinkColumns).to.include.members(expectdLinkCols);
  });

  When('I click task column link {string} at row {int}', async function(colName, rowPos){
    await BrowserWaits.retryWithActionCallback(async () => {
      await taskListTable.clickTaskColLink(colName, rowPos);
    });
  });

  When('I click task column link {string} at row {int}, I see case details page', async function (colName, rowPos) {
    await BrowserWaits.waitForPageNavigationOnAction(async () => {
      await BrowserWaits.retryWithActionCallback(async () => {
        await taskListTable.clickTaskColLink(colName, rowPos);
      });
    });

    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseDetailsPage.amOnPage(), 'Case details page not displayed').to.be.true;
    });
  });

  Then('I see manage link displayed for task at position {int}', async function(row){
    expect(await taskListTable.isManageLinkPresent(row)).to.be.true;
  });

  Then('I see manage link not displayed for task at position {int}', async function (row) {
    expect(await taskListTable.isManageLinkPresent(row)).to.be.false;
  });

  Then('I validate manage link actions for tasks', async function (tasksDatatable) {
    const softAssert = new SoftAssert();
    const taskHashes = tasksDatatable.hashes();

    for (let i = 0; i < taskHashes.length; i++) {
      const taskActions = taskHashes[i]['actions'].split(',');
      let taskIndex = parseInt(taskHashes[i].index);
      if (taskHashes[i]['actions'] === ''){
        softAssert.setScenario(`Manage link not present for task  ${JSON.stringify(taskHashes[i])} `);
        await softAssert.assert(async () => expect(await taskListTable.isManageLinkPresent(taskIndex)).to.be.false);
        continue;
      }
      if (!(await taskListTable.isManageLinkOpenForTaskAtPos(taskIndex))){
        await taskListTable.clickManageLinkForTaskAt(taskIndex);
      }

      for (let j = 0; j < taskActions.length; j++){
        let action = taskActions[j];

        softAssert.setScenario(`Action ${action} present for task  ${JSON.stringify(taskHashes[i])} isPresent`);
        await softAssert.assert(async () => expect(await taskListTable.isTaskActionPresent(action)).to.be.true);
      }
    }
    softAssert.finally();
  });

  Then('I validate manage link actions for cases', async function (tasksDatatable) {
    const softAssert = new SoftAssert();
    const taskHashes = tasksDatatable.hashes();

    for (let i = 0; i < taskHashes.length; i++) {
      const taskActions = taskHashes[i]['actions'].split(',');
      let taskIndex = parseInt(taskHashes[i].index);
      if (taskHashes[i]['actions'] === '') {
        softAssert.setScenario(`Manage link not present for task  ${JSON.stringify(taskHashes[i])} `);
        await softAssert.assert(async () => expect(await waCaseListTable.isManageLinkPresent(taskIndex + 1)).to.be.false);
        continue;
      }
      if (!(await waCaseListTable.isManageLinkOpenForCaseAtPos(taskIndex))) {
        await waCaseListTable.clickManageLinkForCaseAt(taskIndex);
      }

      for (let j = 0; j < taskActions.length; j++) {
        let action = taskActions[j];
        softAssert.setScenario(`Action ${action} present for task  ${JSON.stringify(taskHashes[i])} isPresent`);
        await softAssert.assert(async () => expect(await waCaseListTable.isCaseActionPresent(action)).to.be.true);
      }
    }
    softAssert.finally();
  });

  When('I open Manage link for task at row {int}', async function (taskAtRow) {
    const isManageLinkOpen = await taskListTable.isManageLinkOpenForTaskAtPos(taskAtRow);
    if (!isManageLinkOpen) {
      await BrowserWaits.retryWithActionCallback(async () => {
        await taskListTable.clickManageLinkForTaskAt(taskAtRow);
        await BrowserWaits.waitForConditionAsync(async () => await taskListTable.isManageLinkOpenForTaskAtPos(taskAtRow), 2000);
      });
    }
  });

  When('I open Manage link for wa cases at row {int}', async function (taskAtRow) {
    const isManageLinkOpen = await waCaseListTable.isManageLinkOpenForCaseAtPos(taskAtRow);
    if (!isManageLinkOpen) {
      await BrowserWaits.retryWithActionCallback(async () => {
        await waCaseListTable.clickManageLinkForCaseAt(taskAtRow);
        await BrowserWaits.waitForConditionAsync(async () => await waCaseListTable.isManageLinkOpenForCaseAtPos(taskAtRow), 2000);
      });
    }
  });

  Then('I see action link {string} is present for task with Manage link open', async function(manageLinkAction){
    expect(await taskListTable.isTaskActionPresent(manageLinkAction), `Task action ${manageLinkAction} is not present`).to.be.true;
  });

  Then('I see action link {string} is present for case with Manage link open', async function (manageLinkAction) {
    expect(await waCaseListTable.isCaseActionPresent(manageLinkAction), `Case action ${manageLinkAction} is not present`).to.be.true;
  });

  When('I click action link {string} on task with Manage link open', async function (manageLinkAction){
    await taskListTable.clickTaskAction(manageLinkAction);
  });

  When('I click action link {string} on case with Manage link open', async function (manageLinkAction) {
    await waCaseListTable.clickCaseAction(manageLinkAction);
  });

  Then('I validate notification message banner is displayed in {string} page', async function(page){
    page = page.toLowerCase();
    let pageObject = null;
    if(page.includes('my work')){
      pageObject = myWorkPage;
    } else if (page.includes('all work')){
      pageObject = allWorkPage;
    } else if (page.includes('case details')) {
      pageObject = caseDetailsPage;
    } else if (page.includes('case list')) {
      pageObject = caseListPage;
    } else{
      throw new Error(`message banner validation step not implemented for page ${page}`);
    }

    expect(await pageObject.taskInfoMessageBanner.isBannerMessageDisplayed(), `Not on page  ${page} or message banner not displayed`).to.be.true;
  });

  Then('I validate notification banner messages displayed in {string} page', async function (page, messagesDatatable) {
    await BrowserWaits.retryWithActionCallback(async () => {
      const messages = messagesDatatable.hashes();
      let actualmessages = [];
      page = page.toLowerCase();
      if (page.includes('my work')) {
        actualmessages = await myWorkPage.taskInfoMessageBanner.getBannerMessagesDisplayed();
      } else if (page.includes('all work')) {
        actualmessages = await allWorkPage.taskInfoMessageBanner.getBannerMessagesDisplayed();
      } else if (page.includes('case details')) {
        actualmessages = await caseDetailsPage.messageBanner.getBannerMessagesDisplayed();
      } else if (page.includes('case list')) {
        actualmessages = await caseListPage.taskInfoMessageBanner.getBannerMessagesDisplayed();
      } else {
        throw new Error(`message banner validation step not implemented for page ${page}`);
      }

      for (let i = 0; i < messages.length; i++) {
        let matchingMsgs = await ArrayUtil.filter(actualmessages, async (msg) => msg.includes(messages[i].message));
        if (messages[i].message !== '') {
          expect(matchingMsgs.length > 0, `expected "${messages[i].message}" to be included in ${JSON.stringify(actualmessages)}`).to.be.true;
        }
      }
    });
  });

  Then('If user type {string} is {string}, I validate task details displayed in task action page', async function (currentUserType, stepForUserType, taskDetailsDatatable){
    if (currentUserType === stepForUserType){
      const taskDetails = taskDetailsDatatable.hashes()[0];

      validateTaskDetailsDisplayed(taskDetails, taskActionPage);
    } else {
      reportLogger.AddMessage(`"Step is not for scenario user ${currentUserType}" .Step is ignored`);
    }
  });

  Then('I validate task details displayed in task action page', async function (taskDetailsDatatable) {
    const taskDetails = taskDetailsDatatable.hashes()[0];

    validateTaskDetailsDisplayed(taskDetails, taskActionPage);
  });

  Then('I validate task details displayed in task action page matching reference {string}', async function (reference) {
    const taskDetails = global.scenarioData[reference]; ;

    validateTaskDetailsDisplayed(taskDetails, taskActionPage);
  });

  Then('I validate task details displayed in check your changes page', async function (taskDetailsDatatable) {
    const taskDetails = taskDetailsDatatable.hashes()[0];

    validateTaskDetailsDisplayed(taskDetails, taskCheckYourChangesPage);
  });

  Then('I validate task details displayed in check your changes page matching reference {string}', async function (reference) {
    const taskDetails = global.scenarioData[reference];

    validateTaskDetailsDisplayed(taskDetails, taskCheckYourChangesPage);
  });

  async function validateTaskDetailsDisplayed(taskDetails, actionPage){
    const softAssert = new SoftAssert();
    reportLogger.AddMessage('Task details:');
    reportLogger.AddJson(taskDetails);
    const taskColumns = Object.keys(taskDetails);
    for (let i = 0; i < taskColumns.length; i++) {
      let columnName = taskColumns[i];
      let expectColValue = taskDetails[columnName];
      softAssert.setScenario(`Validate column ${columnName} value is ${expectColValue}`);
      const columnActalValue = await actionPage.getColumnValue(columnName);
      await softAssert.assert(async () => expect(columnActalValue).to.contains(expectColValue));
    }
    softAssert.finally();
  }

  Then('I see {string} task action page', async function(actionHeader){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await taskActionPage.getPageHeader()).to.contain(actionHeader);
    });
  });

  Then('I validate task action page has description {string}', async function (actionDescription) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await taskActionPage.getActionDescription()).to.contain(actionDescription);
    });
  });

  When('I click {string} submit button in task action page', async function(actionSubmitBtnLabel){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await taskActionPage.getSubmitBtnActionLabel()).to.contain(actionSubmitBtnLabel);
      await taskActionPage.clickSubmit();
    });
  });

  When('I click Cancel link in task action page', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      await taskActionPage.clickCancelLink();
    });
  });

  When('In workflow {string}, I click cancel link', async function (workflow){
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(workFlowPage, 'workFlowPage pagee is null. test issue, include step Then I am in workflow page "xxx" ').to.be.not.null;
    await workFlowPage.workFlowContainer.clickCancelLink();
  });

  When('In workflow {string}, I click continue', async function (workflow) {
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(workFlowPage, 'workFlowPage pagee is null. test issue, include step Then I am in workflow page "xxx" ').to.be.not.null;
    await workFlowPage.workFlowContainer.clickContinue();
  });

  Then('I validate tasks count in page {int}', async function (tasksCount) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(parseInt(await taskListPage.getTaskListCountInTable()), 'Task count does not match expected ').to.equal(tasksCount);
      if (tasksCount === 0) {
        expect(await taskListPage.isTableFooterDisplayed(), 'task list table footer is not displayed').to.be.true;
      } else {
        expect(await taskListPage.isTableFooterDisplayed(), 'task list table footer is displayed').to.be.false;
      }
    });
  });

  Then('I validate WA tasks table footer displayed status is {string}', async function(displayStateBool){
    const expectedDisplayState = displayStateBool.toLowerCase().includes('true');
    expect(await taskListTable.isTableFooterDisplayed()).to.equal(expectedDisplayState);
  });

  Then('I validate WA cases table footer displayed status is {string}', async function (displayStateBool) {
    await BrowserWaits.retryWithActionCallback(async () => {
      const expectedDisplayState = displayStateBool.toLowerCase().includes('true');
      await BrowserWaits.waitForElement(waCaseListTable.tableFooter);
      expect(await waCaseListTable.isTableFooterDisplayed()).to.equal(expectedDisplayState);
    });
  });

  Then('I validate WA tasks table footer message is {string}', async function (message) {
    expect(await taskListTable.getTableFooterMessage()).to.include(message);
  });

  Then('I validate WA cases table footer message is {string}', async function (message) {
    expect(await waCaseListTable.getTableFooterMessage()).to.include(message);
  });

  Given('I have a caseworker details other than logged in user with reference {string} for service {string}', async function(caseWorkerRef, service){
    const caseworkersInSessionStorage = await browserUtil.getFromSessionStorage(`${service}-caseworkers`);
    const caseworkers = JSON.parse(caseworkersInSessionStorage);

    const loggedinuserDetailsInSessionStorage = await browserUtil.getFromSessionStorage('userDetails');
    const loggedInUser = JSON.parse(loggedinuserDetailsInSessionStorage);
    const loggedinUserIdamId = loggedInUser.uid ? loggedInUser.uid : loggedInUser.id;
    let caseWorkerForRef = null;
    for (const cw of caseworkers){
      if (cw.roleCategory === 'LEGAL_OPERATIONS' && cw.idamId !== loggedinUserIdamId){
        caseWorkerForRef = cw;
        break;
      }
    }

    reportLogger.AddJson(caseWorkerForRef);
    global.scenarioData[caseWorkerRef] = caseWorkerForRef;
  });

  Then('I see see page task assignment person not authorised page', async function(){
    try{
      await BrowserWaits.waitForElement(taskAssignmentPersonNotAuthorisedPage.container);
    }catch(err){
      throw new Error('Task assignment person authorised page is not displayed.');
    }
  });

  Then('I see see page task assignment authorisation error message {string}', async function(message){
    await BrowserWaits.waitForElement(taskAssignmentPersonNotAuthorisedPage.container);
    expect(await taskAssignmentPersonNotAuthorisedPage.message.getText()).to.includes(message);
  });

  When('I click back button in task assignment authorisation error page', async function(){
    await BrowserWaits.waitForElement(taskAssignmentPersonNotAuthorisedPage.container);
    await taskAssignmentPersonNotAuthorisedPage.backButton.click();
  });

  Then('I validate work allocation task table column {string} width less than or equal to {int}', async function(columnName, size){
    await BrowserWaits.retryWithActionCallback(async () => {
      const columnWidthActual = await taskListTable.getHeaderColumnWidth(columnName);
      reportLogger.AddMessage(`Actual column "${columnName}" width is ${columnWidthActual}`);
      expect(columnWidthActual <= size, `Size max width does not match. actual width ${columnWidthActual}`).to.be.true;
    });
  });

  Then('I validate work allocation case table column {string} width less than or equal to {int}', async function (columnName, size) {
    await BrowserWaits.retryWithActionCallback(async () => {
      const columnWidthActual = await waCaseListTable.getHeaderColumnWidth(columnName);
      reportLogger.AddMessage(`Actual column "${columnName}" width is ${columnWidthActual}`);
      expect(columnWidthActual <= size, `Size max width does not match. actual width ${columnWidthActual}`).to.be.true;
    });
  });

  Given('I unassign the task at row 1', async function(){
    const rowActions = await taskListTable.getRowActionLinksTexts();

    const unassignLinkText = rowActions.filter((t) => t.includes('Unassign'));

    if (unassignLinkText.length > 0){
      await taskListTable.clickTaskAction(unassignLinkText[0]);
      await taskActionPage.amOnPage();
      await taskActionPage.clickSubmit();
      expect(await taskActionPage.isBannerMessageDisplayed()).to.be.true;
    }
  });
