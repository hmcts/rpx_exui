

const SelectFlagLocationPage = require('./selectFlagLocationPage')
const SelectFlagTypePage = require('./selectFlagTypePage')
const AddCommentsPage = require('./addCommentsPage')

const ManageCaseFlagsPage = require('./manageCaseFlagsPage')
const UpdateFlagPage = require('./updateFlagPage')
const SearchLanguageInterpreterPage = require('./searchLanguageInterpreterPage')
const SelectSupportLocationPage = require('./selectSupportlocationPage')
const SelectSupportTypePage = require('./selectSupportTypePage')
const ManageSupportRequestPage = require('./manageSupportRequestPage')
const AddSupportCommentsPage = require('./addSupportCommentsPage')
const ManageSupportCommentPage = require('./manageSupportCommentPage')
const ConfirmFlagStatusPage = require('./confirmFlagStatusPage')
const UpdateFlagAddTranslationPage = require('./updateFlagAddTranslationPage')
class CaseFlagsWorkflow{

    constructor(){
        this.nextButton = element(by.xpath(`//button[contains(text(),'Next')]`))
        this.pages = {
            "Where should this flag be added?" : new SelectFlagLocationPage(),
            "Select flag type" : new SelectFlagTypePage(),
            "Add comments for this flag" : new AddCommentsPage(),
            "Manage case flags" : new ManageCaseFlagsPage(),
            "Language Interpreter": new SearchLanguageInterpreterPage(),
            "Who is the support for?": new SelectSupportLocationPage(),
            "Select support type": new SelectSupportTypePage(),
            "Which support is no longer needed?" : new ManageSupportRequestPage(),
            "Tell us more about the request": new AddSupportCommentsPage(),
            "Tell us why the support is no longer needed": new ManageSupportCommentPage(),
            "Confirm the status of the flag": new ConfirmFlagStatusPage(),
            "Add translations to flag" : new UpdateFlagAddTranslationPage()

        }
    }

    addAndGetSelectFlagTypePage(flagType){
        this.pages[flagType] = new SelectFlagTypePage(flagType)
    }

    addAndGetUpdateFlagPage(updateForFlag) {
        this.pages[updateForFlag] = new UpdateFlagPage(updateForFlag)
    }

}

module.exports = new CaseFlagsWorkflow();
