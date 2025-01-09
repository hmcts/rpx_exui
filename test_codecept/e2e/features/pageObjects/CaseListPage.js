
const BrowserWaits = require('../../support/customWaits');
const TaskMessageBanner = require("./messageBanner");
const RuntimeTestData = require('../../support/runtimeTestData');
const CucumberReportLogger = require('../../../codeceptCommon/reportLogger');
const { LOG_LEVELS } = require('../../support/constants');
class CaseListPage{

    constructor(){
        this.caselistComponent = $('.case-list-component');

        this.jurisdictionSelectElement = $("#wb-jurisdiction");
        this.caseTypeSelectElement = $("#wb-case-type");
        this.stateSelectElement = $("#wb-case-state");

        this.searchApplyBtn = $("ccd-workbasket-filters form button:not(.button-secondary)");
        this.searchReset = $("ccd-workbasket-filters form button.button-secondary");

        this.searchFilterContainer = $("ccd-workbasket-filters form");

        this.searchResultsTopPagination = $("ccd-search-result .pagination-top");
        this.noResultsNotification = $("ccd-search-result .notification");

        this.ccdCaseSearchResult = $('ccd-search-result');
        this.caseListRows = $$("ccd-search-result>table>tbody>tr");

        //case list pagination navigation
        this.paginationInfotext = $(".pagination-top span");

        this.paginationControlsContainer = $(".ngx-pagination");
        this.previousPageLink = $(".ngx-pagination .pagination-previous a");
        this.nextPageLink = $(".ngx-pagination .pagination-next a");

        this.sortColumnsIconLinks = $$(".search-result-column-sort a.sort-widget");  

        //Case list selection feature elements
        this.tableHeaderSelectAllInput = $("ccd-search-result #select-all");
        this.caseSelectionCheckboxes = $$("td .govuk-checkboxes__input");
        this.shareCaseButton = $("#btn-share-button");
        this.resetCaseSelectionLink = $("a.search-result-reset-link");

        //ccd-case-viewer
        this.ccdCaseViewer = $("ccd-case-viewer");

        this.loadingSpinner = $(".loading-spinner-in-action");

        this.taskInfoMessageBanner = new TaskMessageBanner(".case-list-component");

    }

    async amOnPage(){
        await BrowserWaits.waitForElement(this.caselistComponent);
        await BrowserWaits.waitForElement(this.searchFilterContainer);

        return (await this.caselistComponent.isPresent()) ; 
    }

    async _waitForSearchComponent(){
        await BrowserWaits.waitForElement(this.searchFilterContainer);
        await BrowserWaits.waitForSpinnerToDissappear();
    }

    _getOptionSelectorWithText(optionText){
        let elementLocator = null;
        const options = optionText.split('|');
        let locatorString = "//option[";
        let i = 0;
        for (const option of options) {
            if (i === 0) {
                locatorString += `contains(text(), '${option.trim()}')`;
            } else {
                locatorString += `or contains(text(), '${option.trim()}')`;
            }
            i++;
        }
        elementLocator = by.xpath(locatorString + ']');

        return elementLocator
    }

    async selectJurisdiction(jurisdiction){
        await BrowserWaits.waitForSeconds(1);
        await BrowserWaits.waitForSpinnerToDissappear();
        await this._waitForSearchComponent();
        CucumberReportLogger.LogTestDataInput(`Case list page Jurisdiction : ${jurisdiction}`);
        // const optionSelector = this._getOptionSelectorWithText(jurisdiction);


        const options = await this.jurisdictionSelectElement.getSelectOptions();
        const matchingOption = options.find(opt => opt.includes(jurisdiction))

        // const optionText = await element(optionSelector).getText();
        await this.jurisdictionSelectElement.select(matchingOption);

        RuntimeTestData.workbasketInputs.jurisdiction = jurisdiction;
        RuntimeTestData.workbasketInputs.casetypes = [];
        RuntimeTestData.workbasketInputs.casetypes = await this.caseTypeSelectElement.getSelectOptions()
       
    }

    async selectCaseType(caseType) {
        await BrowserWaits.waitForSeconds(1);
        await BrowserWaits.waitForSpinnerToDissappear();
        await this._waitForSearchComponent();
        CucumberReportLogger.LogTestDataInput(`Case list page Case type : ${caseType}`);
        // const selectOption = element(this._getOptionSelectorWithText(caseType))



        const options = await this.caseTypeSelectElement.getSelectOptions();
        const matchingOption = options.find(opt => opt.includes(caseType))

        // const selectOptionText = await selectOption.getText();
        await this.caseTypeSelectElement.select(matchingOption);
        CucumberReportLogger.LogTestDataInput(`Case list page Case type : ${caseType}`);
        RuntimeTestData.workbasketInputs.casetype = caseType; 

    }

    async selectState(state) {
        await BrowserWaits.waitForSpinnerToDissappear();
        await this._waitForSearchComponent();
        CucumberReportLogger.LogTestDataInput(`Case list page event: ${state}`);



        const options = await this.stateSelectElement.getSelectOptions();
        const matchingOption = options.find(opt => opt.includes(state))

        // const optionText = await  element(this._getOptionSelectorWithText(state)).getText()
        await this.stateSelectElement.select(matchingOption);
        RuntimeTestData.workbasketInputs.state = state; 

    }

    async clickSearchApplyBtn(){ 
        await BrowserWaits.retryWithActionCallback(async () => {
            await this._waitForSearchComponent();
            await BrowserWaits.waitForSpinnerToDissappear();
            // await browser.executeScript('arguments[0].scrollIntoView()',
            //     this.searchApplyBtn);
            await BrowserWaits.waitForElementClickable(this.searchApplyBtn);
            CucumberReportLogger.AddMessage("Clicking Apply in case list Work basket filter.", LOG_LEVELS.Debug);
            await this.searchApplyBtn.click();
            await BrowserWaits.waitForSpinnerToDissappear();

        });
    }

    async clickSearchResetBtn() {
        
        await this._waitForSearchComponent();
        await browser.executeScript('arguments[0].scrollIntoView()',
            this.searchReset);
        await this.searchReset.click();
    }

    async waitForCaseResultsToDisplay(){
        await BrowserWaits.waitForElement(this.searchResultsTopPagination);
        await CucumberReportLogger.AddMessage("starting wait for 2 sec for list to render  : " + new Date().toTimeString(), LOG_LEVELS.Debug);
        await BrowserWaits.waitForSeconds(2);
        await CucumberReportLogger.AddMessage("wait complete : " + new Date().toTimeString(), LOG_LEVELS.Debug);

    }

    async waitForNoCaseResultsToDisplay() {
        await BrowserWaits.waitForElement(this.noResultsNotification);
    }

    async hasCaseListAnyResults(){
        await this.searchResultsTopPagination.isPresent();
    }

    async clickFirstCaseLink(){
        let currentPageUrl = await browser.getCurrentUrl();
        CucumberReportLogger.AddMessage(` Before navigation :   ${currentPageUrl}`);

        await BrowserWaits.waitForElement(this.ccdCaseSearchResult);
        let isNavigationSuccess = false;
        let retryAttemptsCounter = 0;
        while (retryAttemptsCounter <= 3 && !isNavigationSuccess ){
            try{
                await this.caseListRows.get(0).$("td a").click();
                await BrowserWaits.waitForPageNavigation(currentPageUrl); 
                isNavigationSuccess = true;
            }catch(err){
                retryAttemptsCounter++;
                CucumberReportLogger.AddMessage(`Error opening first case from case list. Retrying attempt ${retryAttemptsCounter} :   ${err}`); 
            }
        } 
        CucumberReportLogger.AddMessage(` After navigation :   ${await browser.getCurrentUrl()}`);

    }

    async getCountOfCasesListedInPage(){
        return await this.caseListRows.count();
    }

    async isSelectAllColumnDisplayed(){
        return await this.tableHeaderSelectAllInput.isPresent();
    }

    async isSelectCheckboxDisplayedForAllCases(){
        let casesInPage = await this.getCountOfCasesListedInPage();
        let countOfSelectCheckboxes = await this.caseSelectionCheckboxes.count();
        return casesInPage === countOfSelectCheckboxes; 
    }

    async isSelectAllCheckboxSelected(){
        return await this.tableHeaderSelectAllInput.isSelected();
    }

    async clickSelectAll(){
        await this.tableHeaderSelectAllInput.click(); 
    }

    async isCaseSelectCheckboxSelected(rowNum){
        let checkBoxAtRowNum = await this.caseSelectionCheckboxes.get(rowNum - 1);
        // await BrowserWaits.waitForElement(checkBoxAtRowNum);
        return await checkBoxAtRowNum.isSelected();
    }

    async clickCaseSelectCheckBoxAtRow(rowNum){
        let checkBoxAtRowNum = await this.caseSelectionCheckboxes.get(rowNum - 1);
        await checkBoxAtRowNum.click();
    }

    async getCountOfCasesSelectedInPage() {
        let totalCasesInPage = await this.caseSelectionCheckboxes.count();
        let seledtedCaseCount = 0;
        for (let counter = 0; counter < totalCasesInPage; counter++){
            let checkBox = await this.caseSelectionCheckboxes.get(counter);
            if (await checkBox.isSelected()){
                seledtedCaseCount++;
            }
        }
        return seledtedCaseCount;
    }

    async clickPaginationNextPage(){
       let paginationInfobefore = await this.paginationInfotext.getText();
        expect(await this.nextPageLink.isPresent(), "Case list next page not present. current page info : " + paginationInfobefore).to.be.true 
       
        await browser.executeScript('arguments[0].scrollIntoView()',
            this.nextPageLink);
        await this.nextPageLink.click();
        await BrowserWaits.waitForCondition(async () => {
            let paginationInfoCurrent = await this.paginationInfotext.getText();
            return paginationInfobefore === paginationInfoCurrent; 
        });
        await BrowserWaits.waitForElement(this.paginationControlsContainer, undefined, "Data load taking too long on pagination");
    }

    async clickPaginationPreviousPage() {
        let paginationInfobefore = await this.paginationInfotext.getText();
        expect(await this.previousPageLink.isPresent(), "Case list previous page not present. current page info : " + paginationInfobefore).to.be.true

        await browser.executeScript('arguments[0].scrollIntoView()',
            this.previousPageLink);
        await this.previousPageLink.click();
        await BrowserWaits.waitForCondition(async () => {
            let paginationInfoCurrent = await this.paginationInfotext.getText();
            return paginationInfobefore === paginationInfoCurrent;
        });
        await BrowserWaits.waitForElement(this.paginationControlsContainer,undefined,"Data load taking too long on pagination");

    }

    async clickCaseLinkAtRow(rowNum){
        let caseRow = await this.caseListRows.get(rowNum - 1);
        await caseRow.$(".search-result-column-cell a").click();
        await BrowserWaits.waitForElement(this.ccdCaseViewer , undefined, "Case view page is not displayed"); 
    }

    async sortTableByColAt(colNum){
        (await this.sortColumnsIconLinks.get(colNum-1)).click();
        await browser.sleep(1);
    }

    async clickShareCaseButton(){
        await this.shareCaseButton.click();
    }




}

module.exports = CaseListPage;