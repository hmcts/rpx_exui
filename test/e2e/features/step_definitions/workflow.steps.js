
const BrowserWaits = require('../../support/customWaits');
const ArrayUtil = require('../../utils/ArrayUtil');
var { Then, When, Given } = require('@cucumber/cucumber');

const reassignTaskWorkFlow = require('../pageObjects/workAllocation/reassignTaskWorkflow');
const workflowUtil = require('../pageObjects/common/workflowUtil');


  Then('I am in workflow page {string}', async function(workFlowPage){
    await BrowserWaits.retryWithActionCallback(async () => {
      await workflowUtil.waitForWorkflowPage(workFlowPage);
      global.scenarioData['workflow'] = workFlowPage;
    });
  });
