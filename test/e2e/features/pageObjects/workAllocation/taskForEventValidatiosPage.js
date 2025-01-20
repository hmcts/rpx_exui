
class TaskForEventCompletionValidationPage{
  constructor(){
    const validationPages = [
      'app-no-tasks-available',
      'app-multiple-tasks-exist',
      'app-task-assigned',
      'app-case-event-completion-task-reassigned',
      'app-case-event-completion-task-cancelled',
      'app-case-event-completion-task-completed',
      'app-case-event-completion-task-terminated'
    ];
    this.validatioPages = $(validationPages.join(','));

    this.summaryHeading = $('.govuk-error-summary h2');
    this.summaryBody = $('.govuk-error-summary__body');

    this.errorDetailsContainer = $('div.govuk-form-group--error');
    this.errorDetailsHeader = $('div.govuk-form-group--error h2');
    this.errorDetailsMessage = $('div.govuk-form-group--error');
    this.errorDetailsNavLink = $('div.govuk-form-group--error a');

    this.continueButton = $('ccd-case-event-completion button');
    this.cancelButton = $('ccd-case-event-completion a.govuk-button');
  }

  async isPageDisplayed(){
    const isPresent = await this.validatioPages.isPresent();
    if (isPresent){
      return await this.validatioPages.isDisplayed();
    }
    return isPresent;
  }
}

module.exports = new TaskForEventCompletionValidationPage();
