
const HearingRequirementsPage = require('./HearingRequirementsPage')
const HearingFacilitiesPage = require('./HearingFacilitiesPage')
const HearingStagePage = require('./HearingStagePage')
const ParticipantAttendancePage = require('./ParticipantAttendancePage')
const HearingVenueDetails = require('./HearingVenueDetails')
const HearingJudgePage = require('./HearingJudgePage')
const HearingPanelPage = require('./HearingPanelPage')
const HearingTimingPage = require('./HearingTimingPage')
const HearingLinkPage = require('./HearingLinkPage')
const HearingAdditionalInstructionsPage = require('./HearingAdditionalInstractions');
const HearingCreateEditSummaryPage = require('./HearingCreateEditSummaryPage')
const HearingSubmitConfirmationPage = require('./HearingSubmitConfirmationPage')
const HearingWelshPage = require('./hearingWelshPage')
const HearingChangeReasonsPage = require('./HearingChangeReasonsPage')
class CreateHearingWorkflow{

    constructor(){
        this.continueBtn = element(by.xpath("//button[contains(text(),'Continue')]"))
        this.submitBtn = element(by.xpath("//button[contains(text(),'Submit request')]"))
        this.backLink = $('exui-request-hearing a.govuk-back-link')

        this.pageHeading = $('h1.govuk-heading-l');

        this.createhearingContainer = $('exui-request-hearing')

        this.pages = {
            "Hearing requirements": new HearingRequirementsPage(),
            "Do you require any additional facilities?": new HearingFacilitiesPage(),
            "What stage is this hearing at?": new HearingStagePage(),
            "Participant attendance": new ParticipantAttendancePage(),
            "What are the hearing venue details?": new HearingVenueDetails(),
            "Does this hearing need to be in Welsh?" : new HearingWelshPage(),
            "Do you want a specific judge?": new HearingJudgePage(),
            "Do you require a panel for this hearing?" : new HearingPanelPage(),
            "Length, date and priority level of hearing" : new HearingTimingPage(),
            "Will this hearing need to be linked to other hearings?": new HearingLinkPage(),
            "Enter any additional instructions for the hearing": new HearingAdditionalInstructionsPage(),
            "Check your answers before sending your request": new HearingCreateEditSummaryPage(),
            "Hearing request submitted": new HearingSubmitConfirmationPage(),
            "Provide a reason for changing this hearing": new HearingChangeReasonsPage()
        }

    }

    async isCreateHearingWorkflowDIsplayed(){
        return await this.createhearingContainer.isDisplayed();
    }

    async clickSubmitRequest(){
        await this.submitBtn.click();
    }

}


module.exports = new CreateHearingWorkflow();
