var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');

const ArrayUtil = require('../../../utils/ArrayUtil');
const workflowUtil = require('../../pageObjects/common/workflowUtil');

const exclusionWorkFlow = require('../../pageObjects/workAllocation/exclusionRolesWorkFlow');
const findPersonPage = require('../../pageObjects/workAllocation/common/findPersonComponent');


  Then('In workflow {string}, I see select role type page displayed with caption {string}', async function (workflow, selctRoleTypeCaption) {
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(await workFlowPage.selectRoleTypePage.amOnPage()).to.be.true;
    expect(await workFlowPage.selectRoleTypePage.headerCaption.getText()).to.contains(selctRoleTypeCaption);
  });

  Then('In workflow {string}, I see select role type page displayed with header {string}', async function (workflow, header) {
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(await workFlowPage.selectRoleTypePage.amOnPage()).to.be.true;
    expect(await workFlowPage.selectRoleTypePage.header.getText()).to.contains(header);
  });

  Then('In workflow {string}, I see select role type radio options {string}', async function (workflow, roleTypeOptions) {
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(await workFlowPage.selectRoleTypePage.amOnPage()).to.be.true;

    const selectTypeRoles = roleTypeOptions.split(',');
    for (const roleType of selectTypeRoles) {
      expect(await workFlowPage.selectRoleTypePage.getRoleTypes()).to.includes(roleType);
    }
  });

  Then('In workflow {string}, I select role type radio options {string}', async function (workflow, roleType) {
    const workFlowPage = workflowUtil.getWorlflowPageObject(workflow);
    expect(await workFlowPage.selectRoleTypePage.amOnPage()).to.be.true;

    const roleTypeElement = await await workFlowPage.selectRoleTypePage.getRoleTypeElement(roleType);
    await roleTypeElement.click();
  });
