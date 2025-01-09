
var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const WACasesListTable = require('../../pageObjects/workAllocation/casesTable');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');

const ArrayUtil = require('../../../utils/ArrayUtil');


  const casesListTable = new WACasesListTable();

  Then('I validate work allocation cases table columns displayed', async function (datatable) {
    const columnHeadersHash = datatable.hashes();
    const expectdColHeaders = await ArrayUtil.map(columnHeadersHash, (headerhash) => headerhash.ColumnHeader);
    const actualHeadeColumns = await casesListTable.getColumnHeaderNames();
    expect(actualHeadeColumns.length, `Actual Cols ||${actualHeadeColumns}|| !== Expected Cols ||${expectdColHeaders}|| `).to.equal(expectdColHeaders.length);
    expect(actualHeadeColumns, `Actual Cols ||${actualHeadeColumns}|| !== Expected Cols ||${expectdColHeaders}|| `).to.include.members(expectdColHeaders);
  });

  Then('I validate work allocation table columns are links', async function (datatable) {
    const columnHeadersHash = datatable.hashes();
    const expectdLinkCols = await ArrayUtil.map(columnHeadersHash, (headerhash) => headerhash.ColumnHeader);

    const actualHeadeColumns = await casesListTable.getColumnHeaderNames();

    const actuallinkColumns = await ArrayUtil.filter(actualHeadeColumns, (headerCol) => {
      return casesListTable.isColValForCaseALink(headerCol, 1);
    });

    expect(actuallinkColumns.length, `Actual Cols ||${actuallinkColumns}|| !== Expected Cols ||${expectdLinkCols}|| `).to.equal(expectdLinkCols.length);
    expect(actuallinkColumns).to.include.members(expectdLinkCols);
  });

  When('I click work allocation cases column link {string} at row {int}', async function (colName, rowPos) {
    await casesListTable.clickCaseColLink(colName, rowPos);
  });

  Then('I validate work allocation cases count in page {int}', async function (casesCount) {
    expect(parseInt(await casesListTable.getCaseListCountInTable()), 'Cases count does not match expected ').to.equal(casesCount);
    if (casesCount === 0) {
      expect(await casesListTable.isTableFooterDisplayed(), 'Cases list table footer is not displayed').to.be.true;
      expect(await casesListTable.getTableFooterMessage(), 'Cases list table footer message when 0 tasks are displayed').to.equal('You have no assigned tasks.');
    } else {
      expect(await casesListTable.isTableFooterDisplayed(), 'Cases list table footer is displayed').to.be.false;
    }
  });

  Then('I validate work allocation cases table pagination controls, is displayed state is {string}', async function (isDisplauyed) {
    expect(await casesListTable.isPaginationControlDisplayed()).to.equal(isDisplauyed.toLowerCase() == 'true');
  });

  Then('I validate work allocation cases pagination results text displayed as {string}', async function (pagnationResultText) {
    expect(await casesListTable.getPaginationResultText()).to.include(pagnationResultText);
  });

  When('I click work allocation case column link {string} at row {int}', async function (colName, rowPos) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await casesListTable.clickCaseColLink(colName, rowPos);
    });
  });

