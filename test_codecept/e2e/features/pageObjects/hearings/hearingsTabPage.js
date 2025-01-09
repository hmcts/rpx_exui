const reportLogger = require("../../../../codeceptCommon/reportLogger");



class HearingsTabPage{

    constructor(){
        this.tabContainer = $('exui-case-hearings')
        this.requesthearingBtn = element(by.xpath("//exui-case-hearings//a[contains(text(),'Request a hearing')]"))
        this.currentAndUpcomingHearings = new HearingsTable("Current and upcoming")
        this.pastOrCancelledHearings = new HearingsTable("Past or cancelled")

    }

    isDisplayed() {
        return this.tabContainer.isDisplayed();
    }

    getTableObject(tableName){
        return new HearingsTable(tableName)
    }

    getTableObject(tableName) {
        return new HearingsTable(tableName)
    }


}


class HearingsTable {

    constructor(tableName) {
        this.tableName = tableName
    }

    async isDisplayed() {
        const tableEle = element(by.xpath(`//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]`))
        return tableEle.isDisplayed();
    }

    async getTableHeaders() {
        const headers = element.all(by.xpath(`//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../th`))
        const count = headers.count();

        const headerNames = []
        for (let i = 0; i < count; i++) {
            const headerEle = await headers.get(i)
            headerNames.push(await headerEle.getText())
        }
        return headerNames;
    }

    getColNumberForheaderName(headerName) {
        let colNum = -1
        switch (headerName) {
            case "Hearing date":
                colNum = 2
                break;
            case "Status":
                colNum = 3
                break;
            case "Actions":
                colNum = 4
                break;
            default:
                colNum = -1
        }
        return colNum;
    }

    getHearingTypeColumnElement(hearingType, valueForHeader) {

        const colNum = this.getColNumberForheaderName(valueForHeader);
        const tdXpath = `//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../../..//tbody/tr/td[contains(text(),'${hearingType}')]/../td[position()=${colNum}]`
        if (valueForHeader === "Hearing date") {
            const xPath = tdXpath
            return element(by.xpath(xPath))
        } else if (valueForHeader === "Status") {
            const xPath = `${tdXpath}/strong`
            return element(by.xpath(xPath))
        }
        else if (valueForHeader === "Actions") {
            const xPath = `${tdXpath}/div[contains(@class,'div-action')]/a`;
            return element.all(by.xpath(xPath))
        } else {
            throw new Error(`Unknown column ${valueForHeader}`)
        }

    }

    async clickActionLinkForHearing(hearing, action){
        const elements = this.getHearingTypeColumnElement(hearing, "Actions")

        let actionLinkEle = null

        const actionsCount = await elements.count();
        if (actionsCount === 0){
            reportLogger.AddMessage(`no actions forund for ${JSON.stringify(elements.selector)}`)
        }
        const actionNames = []
        for (let i = 0; i < actionsCount; i++) {
            const e = await elements.get(i)

            const name = await e.getText()
            reportLogger.AddMessage(`action "${name}", to click "${action}"`)
            if (name === action){
                actionLinkEle = e;
                break;
            }
        }
        await actionLinkEle.click()
    }

    async isHearingDisplayed(hearingType) {
        const tdXpath = `//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../../..//tbody/tr/td[contains(text(),'${hearingType}')]`
        const ele = element(by.xpath(tdXpath))
        return ele.isDisplayed()
    }

    async getHearingTypeColumnValue(hearingType, valueForHeader) {
        const elements = this.getHearingTypeColumnElement(hearingType, valueForHeader)
        if (valueForHeader === 'Actions') {
            const actionsCount = await elements.count();
            const actionNames = []
            for (let i = 0; i < actionsCount; i++) {
                const e = await elements.get(i)
                actionNames.push(await e.getText())
            }
            return actionNames;
        } else {
            return elements.getText();
        }

    }
}

module.exports = new HearingsTabPage();

// class HearingsTable{

//     constructor(tableName){
//         this.tableName = tableName
//     }

//     async isDisplayed(){
//         const tableEle = element(by.xpath(`//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]`))
//         return tableEle.isDisplayed();
//     }

//     async getTableHeaders(){
//         const headers = element.all(by.xpath(`//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../th`))
//         const count = headers.count();

//         const headerNames = []
//         for(let i = 0 ;i < count; i++){
//             const headerEle = await headers.get(i)
//             headerNames.push(await headerEle.getText())
//         }
//         return headerNames;
//     }

//     getColNumberForheaderName(headerName){
//         let colNum = -1
//         switch (headerName){
//             case "Hearing date":
//                 colNum = 2
//                 break;
//             case "Status":
//                 colNum = 3
//                 break;
//             case "Actions":
//                 colNum = 4
//                 break;
//             default:
//                 colNum = -1
//         }
//         return colNum;
//     }

//     getHearingTypeColumnElement(hearingType,valueForHeader){

//         const colNum = this.getColNumberForheaderName(valueForHeader);
//         const tdXpath = `//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../../..//tbody/tr/td[contains(text(),'${hearingType}')]/../td[position()=${colNum}]`
//         if (valueForHeader === "Hearing date"){
//             const xPath = tdXpath
//             return element(by.xpath(xPath))
//         } else if (valueForHeader === "Status"){
//             const xPath = `${tdXpath}/strong`
//             return element(by.xpath(xPath))
//         }
//         else if (valueForHeader === "Actions") {
//             const xPath = `${tdXpath}/div[contains(@class,'div-action')]/a`;
//             return element.all(by.xpath(xPath))
//         }else{
//             throw new Error(`Unknown column ${valueForHeader}`)
//         }
     
//     }

//     async isHearingDisplayed(hearingType){
//         const tdXpath = `//exui-case-hearings-list//th[contains(text(),'${this.tableName}')]/../../..//tbody/tr/td[contains(text(),'${hearingType}')]`
//         const ele = element(by.xpath(tdXpath))
//         return ele.isDisplayed()
//     }

//     async getHearingTypeColumnValue(hearingType, valueForHeader){
//         const elements = this.getHearingTypeColumnElement(hearingType, valueForHeader)
//         if (valueForHeader === 'Actions'){
//             const actionsCount = await elements.count();
//             const actionNames = []
//             for (let i = 0; i < actionsCount; i++){
//                 const e = await elements.get(i)
//                 actionNames.push(await e.getText())
//             }
//             return actionNames;
//         }else{
//             return elements.getText();
//         }
        
//     }
// }

