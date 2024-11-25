
var CreateCaseStartPage = require('../createCaseStartPage');
var BrowserWaits = require('../../../support/customWaits');
const date = require('moment');
var path = require('path');
var cucumberReporter = require('../../../../codeceptCommon/reportLogger');
const reportLogger = require('../../../../codeceptCommon/reportLogger')
var CaseEditPage = require('../caseEditPage');
const BrowserUtil = require('../../../../ngIntegration/util/browserUtil');
const App = require('./application');
const BrowserLogs = require('../../../support/browserLogs');
const config = require('../../../config/functional.conf');

const headerPage = require('../headerPage');
const { LOG_LEVELS } = require('../../../support/constants');
class CaseManager {

    constructor() {
        this.app = new App();
        this.manageCasesHeaderLink = $('.hmcts-header__link');
        this.caseListContainer = $('exui-case-list');

        this.caseCreateheaderLink = element(by.xpath('//a[contains(@class ,"hmcts-primary-navigation__link")][contains(text(),"Create case")]'));

        this.continueBtn = new Button('button', 'Continue');

        this.submitBtn = element(by.xpath('//button[contains(text(),\'Submit\')]'));
        this.previousBtn = $("form .button-secondary");
        this.cancelLink = $("form .cancel a");

        this.formFields = 'ccd-case-edit-form>div';
        this.ccdCaseDetails = $('ccd-case-viewer');
        this.ccdCaseEdit = $('ccd-case-edit')
        this.caseDetailsPage = $('exui-case-details-home');
        this.exuiCaseHomeComp = $("exui-case-home");
        this.checkYourAnswers = $(".check-your-answers");

        this.caseNextStepSelect = $("select#next-step");
        this.nextStepGoButton = $(".event-trigger button");
        this.createCaseStartPage = new CreateCaseStartPage();
        this.caseEditPage = new CaseEditPage();
        this.createCaseContainer= $("ccd-create-case-filters form");

        this.eventTimestamp = element(by.xpath('//tbody/tr[1]/td[2]/div[1]'));

        this.errorsContainer = $('.govuk-error-summary');
    }

    async cancelCaseCreation(){
        await BrowserWaits.waitForElement(this.ccdCaseEdit);
        var thisPageUrl = await browser.getCurrentUrl();
        await BrowserWaits.waitForElement(this.cancelLink);
        await this.cancelLink.click();
        await BrowserWaits.waitForPageNavigation(thisPageUrl);
    }

    async clickPreviousButton(){
        await BrowserWaits.waitForElement(this.previousBtn);
        var thisPageUrl = await browser.getCurrentUrl();
        await this.previousBtn.click();
        await BrowserWaits.waitForPageNavigation(thisPageUrl);
    }

    async clickSubmit(){
      await this.submitBtn.click();
    }

    async getTimestampDisplayed(){
      await BrowserWaits.waitForElement(this.eventTimestamp);
      return await this.eventTimestamp.getText();
    }

    async _waitForSearchComponent(){
        await BrowserWaits.waitForElement(this.createCaseContainer);
    }

    async startCaseCreation(jurisdiction, caseType, event){
        await BrowserWaits.retryWithActionCallback(async ()=> {
            let retryOnJurisdiction = 0;
            await BrowserWaits.retryWithActionCallback(async () => {
                try {
                    await BrowserWaits.waitForSpinnerToDissappear();
                    await this.createCaseStartPage.selectJurisdiction(jurisdiction);
                }
                catch (error) {
                    await BrowserLogs.printBrowserLogs();
                    cucumberReporter.AddMessage("Jurisdiction option not found after 30sec. Retrying again with browser refresh",LOG_LEVELS.Warn);
                    retryOnJurisdiction++;
                    await headerPage.refreshBrowser();
                    throw new Error(error);

                }
            });



            await this.createCaseStartPage.selectCaseType(caseType);
            await this.createCaseStartPage.selectEvent(event);

            var thisPageUrl = await browser.getCurrentUrl();

            let startCasePageRetry = 0;
            await BrowserWaits.retryWithActionCallback(async () => {
                try {
                    await BrowserWaits.waitForSpinnerToDissappear();
                    await this.createCaseStartPage.clickStartButton();
                    const nextPageUrl = await BrowserWaits.waitForPageNavigation(thisPageUrl);
                }
                catch (err) {
                    const nextPageUrl = await BrowserWaits.waitForPageNavigation(thisPageUrl);
                    if (nextPageUrl.includes("service-down")) {
                        await browser.get(config.config.baseUrl + "cases/case-filter")
                        await cucumberReporter.AddScreenshot(global.screenShotUtils);
                        cucumberReporter.AddMessage("Service error occured Retrying again ", LOG_LEVELS.Warn);
                        throw new Error("Service error occured Retrying again ");
                    }
                    cucumberReporter.AddMessage("Case start page not displayed in  30sec. Retrying again " + err, LOG_LEVELS.Error);
                    startCasePageRetry++;
                    throw new Error(err);
                }
            });

        });
   }

    async createCase( caseData,isAccessibilityTest,tcTypeStatus) {
        this.caseData = caseData;

        var isCheckYourAnswersPage = false;
        let pageCounter = 0;

        var checkYouranswers = $(".check-your-answers");
        isCheckYourAnswersPage = await checkYouranswers.isDisplayed();
        while (!isCheckYourAnswersPage) {
            let page = tcTypeStatus ? pageCounter : "null";
            await BrowserWaits.retryWithActionCallback(async () => {
                let isNextPageDisplayed = await this._formFillPage(page);
                if (!isNextPageDisplayed){
                    throw Error(`Contnue to next page not success, retrying`)
                }
            });

            await BrowserWaits.waitForSeconds(2)
            isCheckYourAnswersPage = await checkYouranswers.isDisplayed();
            pageCounter++;
        }
        //reset api response to null for next event
        this.caseEditPage.caseEventApiResponse = null;
    }

    async createCaseWithInvalidDate(caseData, isAccessibilityTest, tcTypeStatus) {
        this.caseData = caseData;

        let page = tcTypeStatus ? 0 : "null";

        for(let i=0; i<2; i++) {
            page = tcTypeStatus ? i : "null";

            await BrowserWaits.retryWithActionCallback(async () => {
                let isNextPageDisplayed = await this._formFillPage(page);
                if (!isNextPageDisplayed) {
                    return;
                }
            });

            await BrowserWaits.waitForSeconds(2);
        }

        this.caseEditPage.caseEventApiResponse = null;
    }

    async submitCase(isAccessibilityTest){
        var checkYouranswers = $(".check-your-answers");
        var isCheckYourAnswersPage = await checkYouranswers.isPresent();
        if (isCheckYourAnswersPage) {
            var submit = element(by.xpath('//button[@type= "submit"]'));
            await BrowserWaits.waitForElement(submit);
            // await browser.executeScript('arguments[0].scrollIntoView()',
            //     submit.getWebElement());

            var thisPageUrl = await browser.getCurrentUrl();

            await BrowserWaits.retryWithActionCallback(async () => {
                await submit.click();
                await BrowserWaits.waitForPageNavigation(thisPageUrl)
            });
        }else{
            throw new  Error("Not in case creation check your answers page");
        }
    }

    async startNextStep(stepName, isAccessibilityTest){
        await BrowserWaits.waitForElement(this.exuiCaseHomeComp);
        await BrowserWaits.waitForElement(this.caseNextStepSelect);

        var nextStepSelect = element(by.xpath("//*[@id='next-step']"));
        var nextStepSelectoption = null;
        if (stepName) {
          cucumberReporter.AddMessage('About to select ' + stepName, LOG_LEVELS.Debug);
          await nextStepSelect.select(stepName)
        } else {
            nextStepSelectoption = element(by.xpath("//option[text() = \'' + stepName + '\']"));
            const someStepEventName = await nextStepSelectoption.getText();
            cucumberReporter.AddMessage('Using logic to select ' + someStepEventName, LOG_LEVELS.Debug);
            await nextStepSelect.select(someStepEventName)
        }
        const currentPageUrl = await browser.getCurrentUrl()
        reportLogger.AddMessage(`on page with URL: ${currentPageUrl}`)
        await BrowserWaits.retryWithActionCallback(async () => {
            await this.nextStepGoButton.click();
            // await BrowserWaits.waitForElement($('exui-case-details-home'));
            await BrowserWaits.waitForPageNavigation(currentPageUrl)
        })
    }

    async AmOnCaseDetailsPage(){
        await BrowserWaits.retryWithActionCallback(async () => {
            await this.ccdCaseDetails.wait();
            expect(await this.ccdCaseDetails.isPresent()).to.be.true;
        });
    }

    async AmOnCCDCaseEditPage() {
        await BrowserWaits.retryWithActionCallback(async () => {
            try{
                await BrowserWaits.waitForElement(this.ccdCaseEdit);
                expect(await this.ccdCaseEdit.isPresent()).to.be.true;
            }catch(err){

                await this.createCaseStartPage.clickStartButton();
                throw new Error(err);
            }

        });
    }

    async AmOnChekYourAnswersPage() {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await this.checkYourAnswers.isPresent()).to.be.true;
        });
    }

    async _formFillPage(pageCounter) {
        var currentPageElement = $('ccd-case-edit-page');
        await BrowserWaits.waitForElement(currentPageElement);
        if(pageCounter!="null") {
           if(pageCounter>=1) pageCounter++;
            await this.caseEditPage.wizardPageFormFieldValidations(pageCounter);
        }
        var fields = element.all(by.css(this.formFields));
        for (let count = 0; count < await fields.count(); count++) {
            var isHiddenElement = await fields.get(count);

            var isHidden = await isHiddenElement.getAttribute("hidden");
            if (isHidden) {
                continue;
            }

            var fieldElement = await fields.get(count)
            var field = await fieldElement.element(by.xpath('./*'));
            var readWriteField = await field.getTagName();

            if (readWriteField.toLowerCase() === "ccd-field-write") {
                var ccdField = await field.element(by.xpath("./div//*"));
                await this._writeToField(ccdField);
            }
        }

        var continieElement = element(by.xpath('//button[@type= "submit"]'));
        // await browser.executeScript('arguments[0].scrollIntoView()',
        //     continieElement.getWebElement())

        await BrowserWaits.waitForElement(continieElement);
        // browser.waitForAngular();
        // await BrowserWaits.waitForElementClickable(continieElement);

        var thisPageUrl = await browser.getCurrentUrl();
        cucumberReporter.AddMessage("Submitting page: " + thisPageUrl, LOG_LEVELS.Debug);

        let retryCounter = 0;
        let isErrorDisplayed = false;
        await BrowserWaits.retryWithActionCallback(async () => {
            // await browser.handlePopups();
            await continieElement.click();
            await BrowserWaits.waitForSeconds(2);
            isErrorDisplayed = await this.errorsContainer.isDisplayed();
            // browser.waitForAngular();
            if (!isErrorDisplayed){
                await BrowserWaits.waitForPageNavigation(thisPageUrl);
            }
        });

        var nextPageUrl = await browser.getCurrentUrl();
        cucumberReporter.AddMessage("Next page: " + nextPageUrl, LOG_LEVELS.Debug);
        return nextPageUrl !== thisPageUrl;

    }
    async excludeFieldValues(fieldName){
        let excludedValues = ["Building and Street","Address Line 2", "Address Line 3", "Town or City", "County", "Postcode/Zipcode","Country"]
        var found = excludedValues.includes(fieldName);
        return found;
    }

    async _writeToField(ccdField,parentFieldName) {
        const isElementDisplayed = await ccdField.isDisplayed();
        if (!isElementDisplayed) {
            return;
        }
        var ccdFileTagName = await ccdField.getTagName();
        ccdFileTagName = ccdFileTagName.toLowerCase();
        var fieldName = "";
        var fieldName1 = "";
        try {
            if (ccdFileTagName.includes("ccd-write-collection-field")){
                console.log("collection field name");
                fieldName = await (await ccdField.$('h2.heading-h2')).getText();
                fieldName = fieldName.trim();
                console.log("collection field name is" + fieldName);

            }else{
                const ele = ccdField.$('.form-label')
                if (await ele.isDisplayed()){
                    fieldName = await ele.getText();
                }else{
                    fieldName = "nolabel"
                }

            }
        }
        catch (err) {
            console.log(err);
        }

        if(parentFieldName){
            let status = await this.excludeFieldValues(fieldName);
            if(status) return;
        }

        fieldName1 = fieldName;
        fieldName = parentFieldName ? `${parentFieldName}.${fieldName}` : fieldName;
        console.log("===> Case Field : " + fieldName);
        switch (ccdFileTagName) {
            case "ccd-write-text-field":
                let e = await ccdField.$('input.form-control');
                let textvalue = this._fieldValue(fieldName);
                if (textvalue != "test Enter a UK postcode.Postcode/Zipcode")
                    await e.sendKeys(textvalue !== '' ? textvalue : 'test');
                cucumberReporter.AddMessage(fieldName + " : " + textvalue, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, textvalue);
                break;
            case "ccd-write-text-area-field":
                let e1 = await ccdField.$('textarea.form-control');
                let textAreaValue = this._fieldValue(fieldName);
                await e1.sendKeys(textAreaValue)
                cucumberReporter.AddMessage(fieldName + " : " + textAreaValue, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, textAreaValue);
                break;
            case "ccd-write-money-gbp-field":
                let e2 = await ccdField.$('input.form-control');
                let gbpvalue = 300;
                await e2.sendKeys(gbpvalue);
                cucumberReporter.AddMessage(fieldName + " : " + gbpvalue, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, gbpvalue);
                break;
            case "ccd-write-number-field":
                let e3 = await ccdField.$('input.form-control');
                let numberfield = "1234567";
                await e3.sendKeys(numberfield);
                cucumberReporter.AddMessage(fieldName + " : " + numberfield, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, numberfield);
                break;
            case "ccd-write-phone-uk-field":
                let e4 = await ccdField.$('input.form-control');
                let phone_uk = '07889999111';
                await e4.sendKeys(phone_uk);
                cucumberReporter.AddMessage(fieldName + " : " + phone_uk, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, phone_uk);
                break;
            case "ccd-write-address-field":
                await BrowserWaits.retryWithActionCallback(async () => {
                    await ccdField.$('.form-control').clear();
                    await ccdField.$('.form-control').sendKeys("SW1");
                    await ccdField.$('button').click();
                    var addressSelectionField = ccdField.$('select.form-control')

                    // await addressSelectionField.clickSelectOption(2)

                    await BrowserWaits.waitForElement(addressSelectionField);
                    var addressToSelectOption = addressSelectionField.$("option:nth-of-type(2)");
                    await BrowserWaits.retryWithActionCallback(async () => {
                        var addressOptions = await addressSelectionField.getSelectOptions();
                        if (addressOptions.length <= 1){
                            throw new Error('')
                        }
                    })
                    // await BrowserWaits.waitForElement(addressToSelectOption);
                    // const optionText = await addressToSelectOption.getText()
                    await addressSelectionField.selectOptionAtIndex(2);
                    cucumberReporter.AddMessage(fieldName + " : 2nd option selected", LOG_LEVELS.Debug);
                });

                break;
            case "ccd-write-email-field":
                await ccdField.$('input.form-control').sendKeys("test@autotest.com ");
                cucumberReporter.AddMessage(fieldName + " : test@autotest.com", LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, "test@autotest.com");
                break;
            case "ccd-write-yes-no-field":
                await ccdField.$('.multiple-choice input').click();
                // cucumberReporter.AddMessage(fieldName + " : " + await await ccdField.$('.multiple-choice input').getText());
                let yesOrNoFieldElement = ccdField.$$('.multiple-choice label');
                let selectionYesorNoValue = await yesOrNoFieldElement.get(0).getText();
                cucumberReporter.AddMessage(fieldName + " : " + selectionYesorNoValue, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, selectionYesorNoValue);
                break;
            case "ccd-write-fixed-list-field":
                var selectOption = this._fieldValue(fieldName);
                var selectOptionElement = await ccdField.$('option:nth-of-type(2)');
                // if (selectOption !== "" && !selectOption.includes(fieldName)) {
                //     selectOptionElement = ccdField.element(by.xpath("//option[contains(text() , '" + selectOption+"')]"));

                // }
                let selectFieldId = await ccdField.$('select');

                await selectFieldId.selectOptionAtIndex(2);

                let id = await selectFieldId.getAttribute('id');
                // let selectionOptionValue = await selectOptionElement.getAttribute('value');
                // cucumberReporter.AddMessage(fieldName + " : " + selectionOptionValue, LOG_LEVELS.Debug);
                // this._appendFormPageValues(fieldName1, selectionOptionValue);
                break;
            case "ccd-write-date-field":
            case "ccd-write-date-container-field":
                var dateValue = this._fieldValue(fieldName);
                if(dateValue.includes(fieldName) || dateValue === ""){
                    dateValue = date().format('DD-MM-YYYY');
                }
                var today = dateValue.split("-");
                await ccdField.$('.form-group-day input').sendKeys(today[0]);
                await ccdField.$('.form-group-month input').sendKeys(today[1]);
                await ccdField.$('.form-group-year input').sendKeys(today[2]);
                cucumberReporter.AddMessage(fieldName + " : " + dateValue, LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, dateValue);
                break;

            case "ccd-write-document-field":
                await BrowserWaits.retryWithActionCallback(async () => {
                    var fileToUpload ="dummy.pdf";
                    await (await ccdField.$('input.form-control')).uploadFile(fileToUpload);
                    const statusMessageELement = await ccdField.$("span.error-message")
                    let statusMessage = "";

                    await BrowserWaits.waitForCondition(async () => {
                        let isStatusDisplayed = await statusMessageELement.isDisplayed();
                        if (isStatusDisplayed){
                            statusMessage = await statusMessageELement.getText();
                        }
                        console.log(`file upload status : Status message is displayed : ${isStatusDisplayed} : ${statusMessage}` );
                        return !isStatusDisplayed || statusMessage.includes("error");
                    });

                    let isStatusDisplayed = await statusMessageELement.isDisplayed();
                    if (isStatusDisplayed) {
                        statusMessage = await statusMessageELement.getText();
                    }

                    let uploadError = isStatusDisplayed || statusMessage.includes("error");
                    if (uploadError) {
                        var fileToUpload1 = path.resolve(__dirname, "../../../documents/dummy1.pdf");
                        await (await ccdField.$('input.form-control')).sendKeys(fileToUpload1);

                        throw new Error(`file upload error occured : Status message is displayed : ${isStatusDisplayed} : ${statusMessage}` );
                    }
                    cucumberReporter.AddMessage(fieldName + " : dummy.pdf", LOG_LEVELS.Debug);
                    this._appendFormPageValues(fieldName1, "dummy.pdf");
                    // await browser.sleep(5000);
                });
                break;
            case "ccd-write-multi-select-list-field":
                var selectionFields = await ccdField.$$(".multiple-choice input");
                var selectionFieldsCount = await selectionFields.count();
                for (var count = 0; count < selectionFieldsCount; count++) {
                    const checkBoxElement = await selectionFields.get(count);
                    const isAlreadyChecked = await checkBoxElement.isChecked();
                    if (!isAlreadyChecked){
                        await checkBoxElement.click();
                    }

                }
                cucumberReporter.AddMessage(fieldName + " : all options selected", LOG_LEVELS.Debug);
                break;

            case "ccd-write-fixed-radio-list-field":
                var selectionRadioFields = await ccdField.$$(".multiple-choice input");
                var selectionFieldsCount = await selectionRadioFields.count();
                let radioElement = await selectionRadioFields.get(0)
                let isChecked = await radioElement.isChecked();
                if (!isChecked){
                    await radioElement.click();
                }
                const multipleChoiceLabels = await ccdField.$$(".multiple-choice label");
                const mcFirstLabel = await multipleChoiceLabels.get(0)
                cucumberReporter.AddMessage(fieldName + " : first option selected : " + await mcFirstLabel.getText(), LOG_LEVELS.Debug);
                this._appendFormPageValues(fieldName1, await mcFirstLabel.getText());
                break;
            case "ccd-write-complex-type-field":
                cucumberReporter.AddMessage(fieldName + " : complex field values");
                var writeFields = await ccdField.$$("ccd-field-write");
                for (var fieldcounter = 0; fieldcounter < await writeFields.count(); fieldcounter++){
                    var isHidden = await (await writeFields.get(fieldcounter)).getAttribute("hidden");
                    if (isHidden){
                       continue;
                    }
                    var ccdSubField = await (await writeFields.get(fieldcounter)).element(by.xpath("./div/*"));
                    await this._writeToField(ccdSubField, fieldName)
                }
                cucumberReporter.AddMessage(fieldName + " : complex field values", LOG_LEVELS.Debug);
                break;
            case "ccd-write-collection-field":
                cucumberReporter.AddMessage(fieldName + " : complex write collection values", LOG_LEVELS.Debug);
                var addNewBtn = await ccdField.$(".panel button");
                for(let i = 0 ; i < 3;i++){
                    await addNewBtn.click();
                    var writeFields = await ccdField.$$(".panel > .form-group > .form-group>ccd-field-write");
                    var writeFieldsCount = await writeFields.count();

                    for (var count = 0; count < writeFieldsCount; count++) {
                        var ccdSubField = await (await writeFields.get(count)).element(by.xpath("./div/*"));
                        var subFieldText = await ccdSubField.getText();
                        await this._writeToField(ccdSubField, `${fieldName}[0]`)
                    }

                    cucumberReporter.AddMessage(fieldName + " : complex write collection values", LOG_LEVELS.Debug);
                }

                break;
            default:
                console.log("Unknown field type : " + ccdFileTagName);

                cucumberReporter.AddMessage(fieldName + " : unknown ccd field container " + ccdFileTagName + ". Please check if container is missing in test config or changed", LOG_LEVELS.Debug);

        }
    }

    _fieldValue(fieldName) {
        var value = "fieldName";
        console.log("Read field value : " + fieldName);
        if (this.caseData[fieldName]) {
            value = this.caseData[fieldName];
        } else if (fieldName.includes('Optional')){
            value = "";
        }else{
            value = "test "+fieldName
        }
        return value;
    }

    async _appendFormPageValues(key, value, page) {
        if (key || value) {
            this.checkURanswerPageVal = this.checkURanswerPageVal ? this.checkURanswerPageVal : [];
            let label;
            let keyVal;
            if (key.includes('Optional')) {
                label = key.split(" (Optional)");
            }
            let objKey = label ? label[0] : key;

            if (typeof (value) === 'number') {
                keyVal = value.toString();
            }
            let objValue = keyVal ? keyVal : value;
            this.checkURanswerPageVal.push({ [objKey]: objValue })
        }
        if (page == "caseEditPage") {
            return this.checkURanswerPageVal;
        }
    }


}
module.exports = CaseManager;
