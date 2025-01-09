
class GovUKTable{

    constructor(tableXpath){
        this.tableXpath = tableXpath
    }

    async getTableHeadersByColumn(){
        const headers = element.all(by.xpath(`${this.tableXpath}//th`))
        const columnHeaderMap = {}
        const colCount = await headers.count()
        for(let i = 0 ; i < colCount; i++){
            const e = await headers.get(i);
            columnHeaderMap[await e.getText()] = i+1
        }
        return columnHeaderMap
    }

    async getTableHeaders(){
        const headersColMap = await this.getTableHeadersByColumn();
        return Object.keys(headersColMap)
    }

    async getTableDataElements(){
        const columnHeaderMap = await this.getTableHeadersByColumn()
        const rows = element.all(by.xpath(`${this.tableXpath}//tbody//tr`))
        const rowsCount = await rows.count();
        const rowsDataElements = []
        for (let rowCounter = 0; rowCounter < rowsCount; rowCounter++){
            const row = element(by.xpath(`${this.tableXpath}//tbody//tr[position()=${rowCounter+1}]`))
            const rowDataElements = {}
            for (const column of Object.keys(columnHeaderMap)){
                rowDataElements[column] = element(by.xpath(`${this.tableXpath}//tbody//tr[position()=${rowCounter + 1}]//td[position()=${columnHeaderMap[column]}]`))
                rowsDataElements.push(rowDataElements)
            }

        }
        return rowsDataElements;
    }

}

module.exports = GovUKTable



