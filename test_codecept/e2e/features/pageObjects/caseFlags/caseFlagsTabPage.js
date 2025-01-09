

class CaseFlagsTabPage{

    constructor(){

    }

    getFlagTableFor(flagTableFor){
        return new FlagTableFor(flagTableFor)
    }

}

class FlagTableFor {

    constructor(tableFor){
        this.tableFor = tableFor;

        this.tableLocator = `//ccd-case-flag-table//caption[contains(text(),'${this.tableFor}')]/..`

        this.tableHeader = element(by.xpath(this.tableLocator))
        this.tableHeaders = element.all(by.xpath(`${this.tableLocator}//thead/tr/th`))

        this.tableRows = element.all(by.xpath(`${this.tableLocator}//tbody/tr`))

        this.tableDataNone = element(by.xpath(`${this.tableLocator}//tbody/tr/td[contains(text(),'None')]`))
    }

    async isTableDataNone(){
        return await this.tableDataNone.isDisplayed();
    }

    async getTableData(){
        const colCount = await this.tableHeaders.count()
        const cols = []
        for(let i = 0 ; i< colCount; i++){
            const colName = await this.tableHeaders.get(i).getText();
            cols.push(colName)
        }

        const rowsCount = await this.tableRows.count()
        const tableObj = []
        for (let rowCount = 0; rowCount < rowsCount; rowCount++){
            const row = await this.tableRows.get(rowCount);
            const rowCols = row.$$('//td')

            let colCounter = 0;
            const rowObj = {}
            for (const col of cols){
                const colValue = await rowCols.get(colCounter).getText()
                rowObj[col] = colValue;
                colCounter++;
            }
            tableObj.push(rowObj)
        }
        return tableObj;
    }
}

module.exports = new CaseFlagsTabPage();

