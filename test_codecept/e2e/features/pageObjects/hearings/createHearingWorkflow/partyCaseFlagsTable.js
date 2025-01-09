
class PartyCaseFlags{

    async getPartiesWithCaseFlagsDisplayed() {
        const partiesElements = element.all(by.xpath(`//table[contains(@class,'govuk-table')]//th[contains(@class,'govuk-table__header_name')]`))
        const count = await partiesElements.count()
        const partNames = [];
        for (let i = 0; i < count; i++) {
            const e = await partiesElements.get(i)
            partNames.push(await e.getText())
        }
        return partNames;
    }

    async getCaseFlagsDisplayedForParty(partyName) {
        const caseFlagsTableXpath = `//table[contains(@class,'govuk-table')]//th[contains(text(),'${partyName}')]/../../../tbody`
        const caseFlags = []
        const flagRows = element.all(by.xpath(`${caseFlagsTableXpath}//tr`))
        const flagsCount = await flagRows.count()
        for (let flagCtr = 0; flagCtr < flagsCount; flagCtr++) {
            const flagRowEle = await flagRows.get(flagCtr)
            const flagDataCells = flagRowEle.element(by.xpath('//td[1]//label'))
            caseFlags.push(await flagDataCells.getText())
        }
        return caseFlags;
    }
}

module.exports = new PartyCaseFlags()