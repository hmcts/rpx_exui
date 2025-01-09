var { Then, When, Given } = require('@cucumber/cucumber');
const reportLogger = require('../../../support/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');
const caseRolesAndAccessPage = require('../../pageObjects/workAllocation/caseRolesAccessPage');

const ArrayUtil = require('../../../utils/ArrayUtil');

const exclusionWorkFlow = require('../../pageObjects/workAllocation/exclusionRolesWorkFlow');
const allocateRoleWorkFlow = require('../../pageObjects/workAllocation/workFlow');
const checkYourAnswersPage = require('../../pageObjects/workAllocation/common/checkYourAnswersPage');

const workAllocationDateUtil = require('../../pageObjects/workAllocation/common/workAllocationDateUtil');


  Then('I see Check your answers page has total {int} questions', async function (expectedQuestionsCount) {
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await checkYourAnswersPage.getTotalQuestionsCount()).to.equal(expectedQuestionsCount);
    });
    expect(await checkYourAnswersPage.getTotalQuestionsCount()).to.equal(expectedQuestionsCount);
  });

  Then('I see Check your answers page has questions and answers with change link', async function (datatable) {
    CheckYourAnswersValidation(datatable, true);
  });

  Then('I see Check your answers page has questions and answers without change link', async function (datatable) {
    CheckYourAnswersValidation(datatable, false);
  });

  When('I click change link for question {string} in check your answers page', async function (question) {
    await checkYourAnswersPage.clickChangeForQuestion(question);
  });

  When('I click button with label {string} in add exclusion work Check your answers page', async function (submitBtnLabel) {
    const continuebuttonText = await exclusionWorkFlow.workFlowContainer.getContinueButtonLabel();
    expect(continuebuttonText).to.include(submitBtnLabel);
    await exclusionWorkFlow.workFlowContainer.clickContinue();
  });

  When('I click button with label {string} in work flow  Check your answers page', async function (submitBtnLabel) {
    const continuebuttonText = await allocateRoleWorkFlow.workFlowContainer.getContinueButtonLabel();
    expect(continuebuttonText).to.include(submitBtnLabel);
    await allocateRoleWorkFlow.workFlowContainer.clickContinue();
  });

  async function CheckYourAnswersValidation(datatable, isChangeLinkPresent){
    const questionAnswersTable = datatable.hashes();
    for (let i = 0; i < questionAnswersTable.length; i++) {
      const question = questionAnswersTable[i]['Question'];
      let expectedAnswer = questionAnswersTable[i]['Answer'];

      if (question.toLowerCase().includes('duration of role') &&
                !expectedAnswer.toLowerCase().includes('7 days') &&
                !expectedAnswer.toLowerCase().includes('indefinite')) {
        const durationString = expectedAnswer.split('to');
        const startDateByDays = durationString[0];
        const endDateByDays = durationString[1];

        let startDate = workAllocationDateUtil.getDurationDateDisplayString(startDateByDays);
        let endDate = workAllocationDateUtil.getDurationDateDisplayString(endDateByDays);

        expectedAnswer = `${startDate} to ${endDate}`;
      } else if (question.toLowerCase().includes('added')) {
        const addedDate = new Date();
        addedDate.setDate(addedDate.getDate() + parseInt(question));
        const date = addedDate.getDate() < 10 ? `0${addedDate.getDate()}` : `${addedDate.getDate()}`;
        const month = addedDate.getMonth() + 1 < 10 ? `0${addedDate.getMonth() + 1}` : `${addedDate.getMonth() + 1}`;

        expectedAnswer = `${date}/${month}/${addedDate.getFullYear()}`;
      }

      expect(await checkYourAnswersPage.isQuestionRowPresent(question), `${question} is not displayed`).to.be.true;

      const actualAnswer = await checkYourAnswersPage.getAnswerForQuestion(question);
      expect(actualAnswer, `expected answer for question ${question} does not match`).to.include(expectedAnswer);
      expect(await checkYourAnswersPage.isChangeLinkPresentForQuestion(question), `change link for ${question} visiblity does not match `).to.equal(isChangeLinkPresent);
    }
  }

