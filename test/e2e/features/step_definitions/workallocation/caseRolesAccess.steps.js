var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');
const workAllocationDateUtil = require('../../pageObjects/workAllocation/common/workAllocationDateUtil');
const ArrayUtil = require('../../../utils/ArrayUtil');

const checkYourAnswersPage = require('../../pageObjects/workAllocation/common/checkYourAnswersPage');


  Then('I see Roles and access page is displayed', async function(){
    expect(await caseRolesAndAccessPage.isPageDisplayed()).to.be.true;
  });

  Then('I validate for role category {string} case roles table displayed status is {string} in case roles and access page', async function (roleCategory, displayStatus){
    await BrowserWaits.retryWithActionCallback(async () => {
      const role = roleCategory.toLowerCase().replace(' ', '');
      const expectedIsDisplayed = displayStatus.toLowerCase().includes('true');
      if (role.includes('judicia')) {
        expect(await caseRolesAndAccessPage.judicialRolesAccessTable.isTableDisplayed()).to.equal(expectedIsDisplayed);
      } else if (role.includes('legalops')) {
        expect(await caseRolesAndAccessPage.legalOpsRolesAccessTable.isTableDisplayed()).to.equal(expectedIsDisplayed);
      } else if (role.includes('exclusion')) {
        expect(await caseRolesAndAccessPage.exclusionTable.isTableDisplayed()).to.equal(expectedIsDisplayed);
      } else {
        throw new Error(`${role} is not recognised or not implemented in test`);
      }
    });
  });

  Then('I validate for role category {string} case roles no data message displayed status is {string} in case roles and access page', async function (roleCategory, displayStatus) {
    const role = roleCategory.toLowerCase().replace(' ', '');
    const expectedIsDisplayed = displayStatus.toLowerCase().includes('true');
    if (role.includes('judicia')) {
      expect(await caseRolesAndAccessPage.judicialRolesAccessTable.isNoDataSummaryMessageDisplayed()).to.equal(expectedIsDisplayed);
    } else if (role.includes('legalops')) {
      expect(await caseRolesAndAccessPage.legalOpsRolesAccessTable.isNoDataSummaryMessageDisplayed()).to.equal(expectedIsDisplayed);
    } else if (role.includes('exclusion')) {
      expect(await caseRolesAndAccessPage.exclusionTable.isNoDataSummaryMessageDisplayed()).to.equal(expectedIsDisplayed);
    } else {
      throw new Error(`${role} is not recognised or not implemented in test`);
    }
  });

  Then('I validate for role category {string} in case roles and access message displayed as {string}', async function (roleCategory, message) {
    const role = roleCategory.toLowerCase().replace(' ', '');
    if (role.includes('judicia')) {
      expect(await caseRolesAndAccessPage.judicialRolesAccessTable.getNoDataSummaryMessage()).to.contains(message);
    } else if (role.includes('legalops')) {
      expect(await caseRolesAndAccessPage.legalOpsRolesAccessTable.getNoDataSummaryMessage()).to.contains(message);
    } else if (role.includes('exclusion')) {
      expect(await caseRolesAndAccessPage.exclusionTable.getNoDataSummaryMessage()).to.contains(message);
    } else {
      throw new Error(`${role} is not recognised or not implemented in test`);
    }
  });

  Then('I validate case roles table has headers for role category {string} in case roles and access page', async function(roleCategory, headerColumnsDatatab){
    const headerNameHashes = headerColumnsDatatab.hashes();
    await BrowserWaits.retryWithActionCallback(async () => {
      for (const headerHash of headerNameHashes) {
        expect(await caseRolesAndAccessPage.isTableColumnDisplayedForAccessRoleType(roleCategory, headerHash.headerName), `${headerHash.headerName} column is not displayedin case role table for role ${roleCategory}`).to.be.true;
      }
    });
  });

  Then('I validate case roles table for role category {string} has data', async function (roleCategory, rowsDatatabale) {
    const rowHashes = rowsDatatabale.hashes();
    let rowNum = 0;
    for (const rowHash of rowHashes) {
      rowNum++;
      const headerNames = Object.keys(rowHash);
      for (const headerName of headerNames){
        let expectedValue = rowHash[headerName];
        if (headerName === 'Start' || headerName === 'End'){
          if (expectedValue !== ''){
            expectedValue = workAllocationDateUtil.getDurationDateDisplayString(expectedValue);
          }else{
            expectedValue = '';
          }
        } else if (headerName === 'Added'){
          const addedDate = new Date();
          expectedValue = workAllocationDateUtil.getDurationDateDisplayString(expectedValue);
        }
        expect(await caseRolesAndAccessPage.getTableColumnValueForAccessRoleType(roleCategory, rowNum, headerName), `${headerName} column value does not match ${roleCategory}`).to.contains(expectedValue);
      }
    }
  });

  When('I click add link for role category {string} in case roles and access page', async function (roleType){
    await BrowserWaits.retryWithActionCallback(async () => {
      await caseRolesAndAccessPage.clickAllocateRoleLinkForCategory(roleType);
    });
  });

  Then('I validate add link for role category {string} is displayed in Roles and access page', async function (roleCategory) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseRolesAndAccessPage.isAllocateRoleLinkPresentForCategory(roleCategory)).to.be.true;
    });
  });

  Then('I validate add link for role category {string} is not displayed in Roles and access page', async function (roleCategory) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await caseRolesAndAccessPage.isAllocateRoleLinkPresentForCategory(roleCategory)).to.be.false;
    });
  });

  When('I click Add link for exclusions in roles and access page', async function (roleType){
    await BrowserWaits.retryWithActionCallback(async () => {
      await caseRolesAndAccessPage.clickAddExclusionLink();
    });
  });

  Then('I click Add link for exclusions is displayed in Roles and access page', async function(){
    return caseRolesAndAccessPage.isExclusionAddLinkPresent();
  });

  Then('I validate case roles {string} link displayed status is {string} for category {string}', async function (linkText, isDisplayedAsString, roleCategory){
    const caseRolesTable = caseRolesAndAccessPage.getTableForRoleACcessType(roleCategory);
    const rolesCount = await caseRolesTable.getRowsCount();
    const expectedDisplayedStatus = isDisplayedAsString.toLowerCase().includes('true');
    for (let i = 1; i <= rolesCount; i++){
      expect(await caseRolesTable.isLinkWithTextPresentAtRow(i, linkText), `${linkText} at row ${i} expected to display ${expectedDisplayedStatus} check failed.`).to.equal(expectedDisplayedStatus);
    }
  });

  When('I click manage link for role category {string} at row {int} in Roles and access page', async function(roleCategory, atRow){
    const caseRolesTable = caseRolesAndAccessPage.getTableForRoleACcessType(roleCategory);
    await caseRolesTable.clickLinkWithTextAtRow(atRow, 'Manage');
  });

  Then('I validate actions row for role category {string} at row {int} is {string} in Roles and access page', async function(roleCategory, atRow, isDisplayedString){
    const expectedDisplayStatus = !isDisplayedString.toLowerCase().replace(' ', '').includes('not');

    await BrowserWaits.retryWithActionCallback(async () => {
      const caseRolesTable = caseRolesAndAccessPage.getTableForRoleACcessType(roleCategory);
      expect(await caseRolesTable.isActionRowDisplayed(atRow)).to.equal(expectedDisplayStatus);
    });
  });

  Then('I validate actions row for role category {string} has action links in Roles and access page', async function (roleCategory, actionLinksdatatable){
    const caseRolesTable = caseRolesAndAccessPage.getTableForRoleACcessType(roleCategory);

    for (const tableHash of actionLinksdatatable.hashes()){
      const actionLink = tableHash['ActionLinks'];
      expect(await caseRolesTable.isManageActionLinkDisplayed(actionLink), `${actionLink} is not displayed`).to.be.true;
    }
  });

  When('I click action row link {string} for role category {string} in Roles and access page', async function(actionLabel, roleCategory){
    const caseRolesTable = caseRolesAndAccessPage.getTableForRoleACcessType(roleCategory);

    await caseRolesTable.clickManageActionLink(actionLabel);
  });

  Then('I see Remove allocation page with caption {string} is displayed', async function(pageCaption){
    expect(await checkYourAnswersPage.getHeaderText()).to.include(pageCaption);
  });

  Then('I see Remove allocation page with hint text {string} is displayed', async function (hintText) {
    expect(await checkYourAnswersPage.getHintText()).to.include(hintText);
  });

  When('I click delete link at row {int} for exclusion in roles and access page', async function(atRow){
    await caseRolesAndAccessPage.exclusionTable.clickLinkWithTextAtRow(atRow, 'Delete');
  });

  Then('I see delete exclusion page with header {string} and caption {string}', async function(header, caption){
    await BrowserWaits.retryWithActionCallback(async () => {
      await checkYourAnswersPage.waitForPage();
      const actualHeader = await checkYourAnswersPage.getHeaderText();
      const actualCaption = await checkYourAnswersPage.getHeaderCaption();
      expect(actualHeader, 'Header text does not match').to.include(header);
      expect(actualCaption, 'Caption did not match').to.include(caption);
    });
  });
