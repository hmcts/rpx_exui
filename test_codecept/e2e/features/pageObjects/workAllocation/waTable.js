const c = require('config');
const { constants } = require('karma');

const browserUtil = require('../../../../ngIntegration/util/browserUtil');
const BrowserWaits = require('../../../support/customWaits');
const ArrayUtil = require('../../../utils/ArrayUtil');
const Spinner = require('../../pageObjects/common/spinner');

var cucumberReporter = require('../../../../codeceptCommon/reportLogger');
const reportLogger = require('../../../../codeceptCommon/reportLogger');
const { LOG_LEVELS } = require('../../../support/constants');


class WAListTable {

    constructor(baseCssLocator) {
        this.baseCssLocator = baseCssLocator;

        this.table = $(this.baseCssLocator);
        this.tableRows = $$(`${this.baseCssLocator} table tbody>tr:not(.actions-row)`);
        this.tableHeaderColumns = $$(`${this.baseCssLocator} table thead th`);
        this.tableFooter = $(`${this.baseCssLocator} table tfoot td`);
        this.actionsRows = $$(`${this.baseCssLocator} table tbody>tr.actions-row`);
        this.selectedActioRow = $(`${this.baseCssLocator} table tbody>tr.actions-row.selected`)

        this.selectedActions = $$(`${this.baseCssLocator} table tbody>tr.actions-row.selected .task-action a`)

        this.displayedActionRow = $('tr.actions-row[aria-hidden=false]');

        this.paginationContainer = $('ccd-pagination .ngx-pagination');
        this.paginationResultText = $(`${this.baseCssLocator} .task-list-header div, ${this.baseCssLocator} .pagination-top`);
        this.pagePreviousLink = $(`${this.baseCssLocator} pagination-template .pagination-previous a`);
        this.pageNextLink = $(`${this.baseCssLocator} pagination-template .pagination-next a`);

        this.resetSortButton = $(`${this.baseCssLocator} .reset-sort-button button`);

        this.spinner = new Spinner();
    }

    async isSpinnerDisplayed() {
        return await this.spinner.isSpinnerDisplayed();
    }

    async waitForSpinnerToDissappear() {
        await this.spinner.waitForSpinnerToDissappear();
    }

    async waitForTable() {
        await BrowserWaits.waitForElement(this.table);
        await BrowserWaits.waitForConditionAsync(async () => {
            let tableRowsCount = await this.tableRows.count();
            let isTableFooterDispayed = await this.tableFooter.isDisplayed();
            // cucumberReporter.AddMessage(`Waiting for WA list table condition : row count is ${tableRowsCount} or table foorter displayed ${isTableFooterDispayed}`, LOG_LEVELS.Info);
            return tableRowsCount > 0 || isTableFooterDispayed;
        }, BrowserWaits.waitTime);
    }

    async isTableDisplayed() {
        return await this.table.isPresent();
    }

    async getColumnCount() {
        return await this.tableHeaderColumns.count();
    }

    async getListCountInTable() {
        await this.waitForTable();
        return await this.tableRows.count();
    }

    async getHeaderColumnWidth(headerName){
        let headerElement = null;
        try{
            headerElement = element(by.xpath(`//${this.baseCssLocator}//table//thead//th//button[contains(text(),'${headerName}')]/..`))
            const dim = await headerElement.getSize();
            return dim.width; 
        }catch(err){
            console.log(err);
            console.log("retrying with header element as non-clickable element");
            headerElement = element(by.xpath(`//${this.baseCssLocator}//table//thead//th//h1[contains(text(),'${headerName}')]/..`))
            const dim = await headerElement.getSize();
            return dim.width;
        }
        
    }

    getHeaderElementWithName(headerName) {
        return element(by.xpath(`//${ this.baseCssLocator }//table//thead//th//button[contains(text(),'${headerName}')]`));
    }

    getHeaderSortElementWithName(headerName) {
        return element(by.xpath(`//${this.baseCssLocator}//table//thead//th`)).withChild(by.xpath(`//button[contains(text(),'${headerName}')]`));
    }

    getNonClickableHeaderElementWithName(headerName) {
        return element(by.xpath(`//${this.baseCssLocator}//table//thead//th[contains(text(),'${headerName}')]`));
    }

    async getHeaderPositionWithName(headerName) {
        const headerNames = await element(by.xpath(`//${this.baseCssLocator}//table//thead//th`)).getTextFromAll();
        for (let i = 0; i < headerNames.length; i++) {
            if (headerNames[i].includes(headerName)) {
                return i + 1;

            }
        }
        return -1;
    }

    async getColumnHeaderNames() {
        await this.waitForTable();
        const headers = await element(by.xpath(`//${this.baseCssLocator}//table//thead//th`)).getTextFromAll();
      

        return headers;

    }

    async clickColumnHeader(headerName) {
        const headerElement = await this.getHeaderElementWithName(headerName);
        expect(await headerElement.isPresent(), `Column with header name ${headerName} not present`).to.be.true;
        await browserUtil.scrollToElement(headerElement);
        await headerElement.click();
    }

    async getColumnSortState(headerName) {
        const headerElement = await this.getHeaderSortElementWithName(headerName);
        return await headerElement.getAttribute("aria-sort");

    }

    async isTableFooterDisplayed() {
        return await this.tableFooter.isDisplayed();
    }

    async getTableFooterMessage() {
        const tableFooterDisplayStatus = await this.isTableFooterDisplayed();
        if (!tableFooterDisplayStatus) {
            throw new Error("Table footer not displayed");
        }
        return await this.tableFooter.getText();
    }

    async getTableRowAt(position) {
        await BrowserWaits.waitForConditionAsync(async () => {
            return await this.tableRows.count() > 0;
        });
        return await this.tableRows.get(position - 1);
    }

    async getColumnValueAt(columnName, atPos) {
        const waRow = await this.getTableRowAt(atPos);
        const columnPos = await this.getHeaderPositionWithName(columnName);
        if (columnPos === -1){
            throw new Error(`${columnName} is not displayed in table`);
        }
        const columnValue = await waRow.$(`td:nth-of-type(${columnPos})`).getText();
        return columnValue;
    }

    async isColValALink(columnName, atPos) {
        const waRow = await this.getTableRowAt(atPos);
        const columnPos = await this.getHeaderPositionWithName(columnName);
        const isLink = await waRow.$(`td:nth-of-type(${columnPos}) exui-url-field`).isPresent();
        return isLink;
    }

    async clickColLink(columnName, atPos) {
        const waRow = await this.getTableRowAt(atPos);
        const columnPos = await this.getHeaderPositionWithName(columnName);
        await waRow.$(`td:nth-of-type(${columnPos}) exui-url-field a`).click();

    }

    async getColumnValueElementAt(columnName, atPos) {
        const waRow = await this.getTableRowAt(atPos);
        const columnPos = await this.getHeaderPositionWithName(columnName);
        return waRow.$(`td:nth-of-type(${columnPos})`);
    }

    async getRowWithColumnValue(columnName, columnValue) {
        const rowsCount = await this.tableRows.count();
        for (let i = 0; i < rowsCount; i++) {
            let thisRowColValue = this.getColumnValueAt(columnName, i + 1);
            if (thisRowColValue.includes(columnValue)) {
                return i + 1;
            }
        }
        return -1;
    }

    async isManageLinkPresent(position) {
        return await browserUtil.stepWithRetry(async () => {
            const row = await this.getTableRowAt(position);
            return await row.$('button[id^="manage_"]').isPresent();
        });
    }

    async clickManageLinkForRowAt(position) {
        await BrowserWaits.retryWithActionCallback(async () => {
            const row = await this.getTableRowAt(position);
            let rowManageLink = row.$('button[id^="manage_"]');
            await browser.scrollToElement(rowManageLink)
            await rowManageLink.click();
            if (!(await this.isManageLinkOpenAtPos(position))) {
                throw new Error('Manage link not open. retying action');
            }
        });
    }

    async isManageLinkOpenAtPos(position) {
        const waRows = element.all(by.xpath(`//tr[(contains(@class,'actions-row'))]`));
        const row = await waRows.get(position - 1);
        try {
            return await row.isDisplayed();
            return true;
        } catch (err) {
            return false;
        }


    }

    async isRowActionPresent(rowAction) {
        await BrowserWaits.waitForElement(this.displayedActionRow);
        const actionLink = this.displayedActionRow.element(by.xpath(`//div[contains(@class,"task-action") or contains(@class,"case-action")]//a[contains(text(),"${rowAction}" )]`))
        return await actionLink.isPresent();
    }

    async clickRowAction(action) {
        expect(await this.isRowActionPresent(action), 'action row not displayed').to.be.true;
        await reportLogger.AddMessage(`Manage links displayed : ${await this.displayedActionRow.getText()}`, LOG_LEVELS.Debug)
        const actionLink = this.displayedActionRow.element(by.xpath(`//div[contains(@class,"task-action") or contains(@class,"case-action")]//a[contains(text(),"${action}" )]`))
        await browser.scrollToElement(actionLink);
        await actionLink.click();
    }

    async isRowActionRowForRowDisplayed(position) {
        return await this.displayedActionRow.isPresent();

    }

    async getCountOfDisplayedActionsRows() {
        const actionRowsCount = await this.actionsRows.count();
        let displayedActionRows = 0;
        for (let rowCtr = 0; rowCtr < actionRowsCount; rowCtr++) {
            const actionRow = await this.actionsRows.get(rowCtr);
            if (await actionRow.isDisplayed()) {
                displayedActionRows++;
            }
        }
        return displayedActionRows;
    }
    async getTableRow(index) {
        return await this.tableRows.get(index);
    }

    async isRowActionBarDisplayed() {
        try {
            await BrowserWaits.waitForElement(this.selectedActioRow);
            return true;
        }
        catch (err) {
            cucumberReporter.AddMessage(`${this.baseCssLocator} WA Row Action bar not displayed  ${err.stack}`, LOG_LEVELS.Error);
            return false;
        }
    }

    async isRowActionBarDisplayedForAtPos(row) {

        const waRow = await this.actionsRows.get(row - 1);
        await BrowserWaits.waitForSeconds(1);
        return await waRow.isDisplayed();
    }

    async getPaginationResultText() {
        return await this.paginationResultText.getText();
    }



    async isPaginationPageNumEnabled(pageNum) {
        const pageNumWithoutLink = element(by.xpath(`//${ this.baseCssLocator }//pagination-template//li//span[contains(text(),'${pageNum}')]`));
        const pageNumWithLink = element(by.xpath(`//${this.baseCssLocator }//pagination-template//li//a//span[contains(text(),'${pageNum}')]`));

        return (await pageNumWithLink.isPresent()) && (await pageNumWithoutLink.isPresent());
    }

    async clickPaginationPageNum(pageNum) {
        if (!(await this.isPaginationPageNumEnabled(pageNum))) {
            throw new Error("Page num is not present or not enabled: " + pageNum);
        }
        const pageNumWithLink = element(by.xpath(`//${this.baseCssLocator }//pagination-template//li//a//span[contains(text(),'${pageNum}')]`));
        await pageNumWithLink.click();

    }

    async getRowActions() {
        return await this.selectedActioRow.getText();
    }

    async clickPaginationLink(linkText) {
        let linkElement = null;
        if (linkText.toLowerCase() === 'next') {
            linkElement = this.pageNextLink;
        } else if (linkText.toLowerCase() === 'previous') {
            linkElement = this.pagePreviousLink;
        } else {
            linkElement = element(by.xpath(`//${this.baseCssLocator }//pagination-template//li//a//span[contains(text(),'${linkText}')]`));
        }

        await BrowserWaits.waitForElement(linkElement);
        await browserUtil.scrollToElement(linkElement);
        await BrowserWaits.waitForElementClickable(linkElement);
        await linkElement.click();

    }

    async isPaginationControlDisplayed() {
        const isPresent = await this.paginationContainer.isPresent();
        let isDisplayed = false;

        if (isPresent){
            isDisplayed = await this.paginationContainer.isDisplayed();
        }
        return isPresent && isDisplayed;
    }

    async getTableDisplayValuesAtRow(rowNum) {
        const displayValuesObject = {};
        const columnHeaders = await this.getColumnHeaderNames();

        for (const column of columnHeaders){
            displayValuesObject[column] = await this.getColumnValueAt(column, rowNum);
        }
        return displayValuesObject;

    }

    async isResetSortButtonDisplayed(){
        return await this.resetSortButton.isPresent();
    }

    async clickResetSortButton(){
        await this.resetSortButton.click();
    }

    async isHeaderSortable(headerName){
        const headerElementClickable = this.getHeaderElementWithName(headerName);
        const headerElementNonClickable = this.getNonClickableHeaderElementWithName(headerName);
        const isClickableElementPresent = await headerElementClickable.isPresent();
        const isNonClickableElementPresent = await headerElementNonClickable.isPresent();


        const isDisplayed = await headerElementClickable.isDisplayed();

        return isDisplayed
    }


    async getRowActionLinksTexts(){
        const links = await this.getRowActionLinks();
        const linkTexts = []
        for(const link of links){
            linkTexts.push(await link.getText());
        } 
        return linkTexts;
    }



    async getRowActionLinks(){
        const linksCount = await this.selectedActions.count();
        const links = [];
        for (let i = 0; i < linksCount; i++){
            const e = await await this.selectedActions.get(i);
            links.push(e);   
        }
        return links; 
    }
}

module.exports = WAListTable;