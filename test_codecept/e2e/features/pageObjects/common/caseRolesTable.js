
const BrowserWaits = require("../../../support/customWaits"); 
const reportLogger = require("../../../../codeceptCommon/reportLogger");
const BrowserUtil = require('../../../../ngIntegration/util/browserUtil');
const { LOG_LEVELS } = require("../../../support/constants");
class CaseRolesTable{

    constructor(parentXpath){ 
        this.parentXpath = parentXpath;
        this.taskDetailsTable = element(by.xpath(`${parentXpath}//table`));
        this.tableHeaders = element.all(by.xpath(`${parentXpath}//table//thead//tr//th`));
        this.tableRows = element.all(by.xpath(`${parentXpath}//table//tbody//tr[contains(@class,'govuk-table__row')]`));

        this.summaryMessage = element(by.xpath(`${parentXpath}//dd`));

    }


    async isTableDisplayed(){
        reportLogger.AddMessage(`Table locator: ${this.taskDetailsTable.locator().toString()}`,LOG_LEVELS.Debug);
       
        return this.taskDetailsTable.isPresent();
    }

    async isNoDataSummaryMessageDisplayed(){
        reportLogger.AddMessage(`No data summary locator: ${this.summaryMessage.locator().toString()}`, LOG_LEVELS.Debug);
        return this.summaryMessage.isPresent();
    }

    async getNoDataSummaryMessage(){
        reportLogger.AddMessage(`No data summary locator: ${this.summaryMessage.locator().toString()}`, LOG_LEVELS.Debug);
        return this.summaryMessage.getText();
    }

    async getRowsCount(){
        return await this.tableRows.count();
    }

    async getTableRowAtIndex(index){
        const rowCount = await this.getRowsCount();
        if (index-1 >= rowCount){
            throw new Error(`Cannot get row at index ${index}, table has total rows ${rowCount}`);
        }
        return this.tableRows.get(index - 1);
    }

    async getHeaderColumnPos(header) {
        const colsCount = await this.tableHeaders.count();
        let colIndex = -1;
        for (let i = 0; i < colsCount; i++) {
            const headerColElement = await this.tableHeaders.get(i);
            const headerText = await headerColElement.getText();
            if (headerText === header) {
                colIndex = i;
                break;
            }
        }
        return colIndex;
    }


    async getColumnElementAtRow(rowIndex , header) {
        const pos = await this.getHeaderColumnPos(header);
        const rowElement = await this.getTableRowAtIndex(rowIndex);

        if (pos === -1) {
            throw new Error(`Table header "${header}" not found`);
        }
        const rowColumns = rowElement.$$('td');
        const col = await rowColumns.get(pos);
        return col;
    }

    async getColumnValueAtRow(rowIndex,header) {
        const colElement = await this.getColumnElementAtRow(rowIndex,header);
        const coltext = await colElement.getText();
        return coltext;
    }

    async getLinkElementWithTextAtRow(rowIndex,linkText){
        const linkElement = element(by.xpath(`${this.parentXpath}//table//tbody//tr[contains(@class,'govuk-table__row')][${rowIndex}]//td//span[not(contains(@class,'hidden'))]//a[contains(text(),'${linkText}')]`));
        
        reportLogger.AddMessage(`Case role table link with text element at row : ${linkElement.selector.xpath}`, LOG_LEVELS.Debug);
        return linkElement;
    }

    async isLinkWithTextPresentAtRow(rowIndex,linkText){
        const linkElement = await this.getLinkElementWithTextAtRow(rowIndex,linkText);
        try{
            return await linkElement.isDisplayed(linkElement);
        }
        catch(err){
            reportLogger.AddMessage(`error checking ${linkElement.selector}`, LOG_LEVELS.Error);

            return false;
        }
    }

    async clickLinkWithTextAtRow(rowIndex,linkText) {
        const linkElement = await this.getLinkElementWithTextAtRow(rowIndex,linkText);
        await BrowserWaits.waitForElement(linkElement);

        await BrowserUtil.scrollToElement(linkElement);
        await linkElement.click();
    }

    async isTableHeaderDisplayed(headerCol) {
        const colheaderPos = await this.getHeaderColumnPos(headerCol);
        return colheaderPos != -1;
    }

    async isActionRowDisplayed(atRow){
        const actionRowDatas = element.all(by.xpath(`${this.parentXpath}//table//tbody//tr[contains(@class,'govuk-table__row')][${atRow}]/following-sibling::tr[position()=1]//td`));
        const tdCountOfRow = await actionRowDatas.count();
        return tdCountOfRow === 1;
    }

    async isManageActionLinkDisplayed(actionLinkLabel) {
        const actionLink = element(by.xpath(`${this.parentXpath}//table//tbody//tr//td//a[contains(text(),'${actionLinkLabel}')]`))
        return actionLink.isPresent();
    }

    async clickManageActionLink(actionLinkLabel){
        const actionLink = element(by.xpath(`${this.parentXpath}//table//tbody//tr//td//a[contains(text(),'${actionLinkLabel}')]`))
        await BrowserUtil.scrollToElement(actionLink);

        await actionLink.click();
    }


}

module.exports = CaseRolesTable;
