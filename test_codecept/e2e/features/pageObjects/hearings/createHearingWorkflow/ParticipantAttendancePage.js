

const reportLogger = require('../../../../../codeceptCommon/reportLogger');
const partyCaseFlags = require('./partyCaseFlagsTable')

class ParticipantAttendancePage {
    constructor() {
        this.pageContainer = $('exui-hearing-attendance');

        this.paperhearingYes = $('#paperHearingYes')
        this.paperhearingNo = $('#paperHearingNo')

        this.methodOfAttendanceForHearing = $('#checkbox-addition-facility')
        this.partiesContainer = $('div[formGroupName = "parties"]')
        this.attendanceNumber = $('#attendance-number')

        this.fieldMapping = {
            "Will this be a paper hearing?": element(by.xpath("//h3[contains(text(),'Will this be a paper hearing?')]")),
            "What will be the methods of attendance for this hearing?": element(by.xpath("//h1[contains(text(),'What will be the methods of attendance for this hearing?')]")),
            "How will each participant attend the hearing?": element(by.xpath("//label[contains(text(),'How will each participant attend the hearing?')]")),
            "How many people will attend the hearing in person?": element(by.xpath("//label[contains(text(),'How many people will attend the hearing in person?')]"))
        }

    }

    async inputValue(field, value) {
        reportLogger.AddMessage(`input to field ${field}`)
        switch (field) {
            case "Will this be a paper hearing?":
                if (value.toLowerCase().includes('yes')) {
                    await this.paperhearingYes.click()
                } else {
                    await this.paperhearingNo.click()
                }
                break;
            case "What will be the methods of attendance for this hearing?":
                const values = value.split(',')
                for (let val of values) {
                    await this.slectMethodOfHearing(val.trim());
                }
                break;
            case "How will each participant attend the hearing?":
                const valueMap = value.split(",")
                await this.selectParticipantHearingMethod(valueMap[0].trim(), valueMap[1].trim())
                break;
            case "How many people will attend the hearing in person?":
                await this.enterAttendanceNumber(value)
                break;

            default:
                throw new Error(`${field} is not recognised`)
        }
    }


    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

    async validateFieldsDisplayed() {
        expect(await this.paperhearingYes.isDisplayed(), 'Radio button not displayed').to.be.true
        expect(await this.paperhearingNo.isDisplayed(), 'Radio button not displayed').to.be.true
        expect(await this.methodOfAttendanceForHearing.isDisplayed(), 'not displayed: What will be the methods of attendance for this hearing?').to.be.true
        expect(await this.partiesContainer.isDisplayed(), 'Parties list not displayed').to.be.true
        expect(await this.attendanceNumber.isDisplayed(), 'attendance count not displayed').to.be.true


    }

    async selectIsPaperhearing(booleanValue) {
        if (booleanValue) {
            await this.paperhearingYes.click();
        } else {
            await this.paperhearingNo.click()
        }
    }

    async slectMethodOfHearing(method) {
        const ele = element(by.xpath(`//div[@id='checkbox-addition-facility']//label[contains(text(),'${method}')]/../input`))
        await ele.click()
    }

    async selectParticipantHearingMethod(partyname, method) {
        const ele = element(by.xpath(`//div[contains(@class,'party-row')]//label[contains(text(),'${partyname}')]/../select`))
        await ele.select(method);
    }

    async getPartiesDisplayed(){
        const elements = element.all(by.xpath(`//div[contains(@class,'party-row')]//label`))
        const parties = []
        const count = await elements.count();
        for(let i = 0 ; i< count; i++){
            const e = await elements.get(i)
            parties.push(await e.getText())
        }
        return parties;
    }

    async isPartyWithNameDisplayed(partyname){
        const ele = element(by.xpath(`//div[contains(@class,'party-row')]//label[contains(text(),'${partyname}')]`))
        await ele.isDisplayed();
    }

    async enterAttendanceNumber(count) {
        await this.attendanceNumber.sendKeys(count);
    }

    async getPartiesWithCaseFlagsDisplayed() {

        return await partyCaseFlags.getPartiesWithCaseFlagsDisplayed();
    }

    async getCaseFlagsDisplayedForParty(partyName) {

        return await partyCaseFlags.getCaseFlagsDisplayedForParty(partyName);;
    }
}

module.exports = ParticipantAttendancePage;
