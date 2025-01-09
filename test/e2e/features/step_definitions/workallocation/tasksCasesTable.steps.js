var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const TaskListTable = require('../../pageObjects/workAllocation/taskListTable');
const CaseListTable = require('../../pageObjects/workAllocation/casesTable');


  const taskListTable = new TaskListTable();
  const caseListTable = new CaseListTable();

  Given('I capture task details at row {int} with reference {string}', async function(atRow, reference){
    const displayValuesAtRow = await taskListTable.getTableDisplayValuesAtRow(atRow);
    global.scenarioData[reference] = displayValuesAtRow;
    reportLogger.AddJson(displayValuesAtRow);
  });

  Given('I capture case details at row {int} with reference {string}', async function (atRow, reference) {
    const displayValuesAtRow = caseListTable.getTableDisplayValuesAtRow(atRow);
    global.scenarioData[reference] = displayValuesAtRow;
  });

  Then('I validate work allocation table {string} columns sortability', async function (waTableFor, datatable){
    const table = getWATableObject(waTableFor);
    const datatableHashes = datatable.hashes();
    for (const hash of datatableHashes){
      const lowerCaseExpectedState = hash.isSortable.toLowerCase();
      const expectedIsSortable = lowerCaseExpectedState.includes('true') || lowerCaseExpectedState.includes('yes');
      expect(await table.isHeaderSortable(hash.Columnheader), `Failed for ${hash.Columnheader} isSortable to be ${hash.isSortable}`).to.equal(expectedIsSortable);
    }
  });

  When('I click work allocation table {string} column header {string}', async function(waTableFor, columnHeader){
    const table = getWATableObject(waTableFor);
    await table.clickColumnHeader(columnHeader);
  });

  When('I click work allocation table {string} reset sort button', async function (waTableFor){
    const table = getWATableObject(waTableFor);
    await BrowserWaits.waitForSpinnerToDissappear();
    await table.clickResetSortButton();

    // await BrowserWaits.retryWithActionCallback(async () => {
    //     expect(await table.isResetSortButtonDisplayed()).to.be.false;
    // });
  });

  Then('I see work allocation table {string} reset sort button state isDisplayed is {string}', async function (waTableFor, sortButtonIsDisplayed){
    const table = getWATableObject(waTableFor);
    await BrowserWaits.retryWithActionCallback(async () => {
      const lowerCaseExpectedState = sortButtonIsDisplayed.toLowerCase().includes('true') || sortButtonIsDisplayed.toLowerCase().includes('yes');
      expect(await table.isResetSortButtonDisplayed()).to.equal(lowerCaseExpectedState);
    });
  });

  Then('I see work allocation table {string} column {string} is sorted in {string}', async function (waTableFor, columnName, sortOrder){
    const table = getWATableObject(waTableFor);
    await BrowserWaits.retryWithActionCallback(async () => {
      const actualSortstate = await table.getColumnSortState(columnName);
      expect(actualSortstate.toLowerCase()).to.include(sortOrder.toLowerCase());
    }, null, 1);
  });

  Then('I see work allocation table {string} default column sorted by {string} for user type {string}', async function (waTableFor, sortState, userType, datatable){
    const table = getWATableObject(waTableFor);

    const dataTableRowHash = datatable.rowsHash();
    const defaultSortColumnForUserType = dataTableRowHash[userType];
    const expectedSortState = sortState.toLowerCase();
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await table.getColumnSortState(defaultSortColumnForUserType)).to.include(expectedSortState);
    });
  });

  function getWATableObject(waTableFor){
    const tableName = waTableFor.toLowerCase();
    if (tableName === 'tasks'){
      return taskListTable;
    } else if (tableName === 'cases'){
      return caseListTable;
    }else{
      throw new Error(`${waTableFor} is not recognised WA table`);
    }
  }
