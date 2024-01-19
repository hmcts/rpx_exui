
class HearingTimingPage {
    constructor() {
        this.pageContainer = $('exui-hearing-timing');

        this.durationDays = $('#hearing-length #durationdays')
        this.durationHours = $('#hearing-length #durationhours')
        this.durationMinutes = $('#hearing-length #durationmins')

        this.noSpecificDate = $('#hearing-specific-dates #noSpecificDate')
        this.hearingSingleDate = $('#hearing-specific-dates #hearingSingleDate')
        this.hearingDateRange = $('#hearing-specific-dates #hearingDateRange')

        this.firstHearingDate_day = $("input[name='firstHearingDate-day']")
        this.firstHearingDate_month = $("input[name='firstHearingDate-month']")
        this.firstHearingDate_year = $("input[name='firstHearingDate-year']")

        this.earliestHearingDate_day = $("input[name='earliestHearingDate-day']")
        this.earliestHearingDate_month = $("input[name='earliestHearingDate-month']")
        this.earliestHearingDate_year = $("input[name='earliestHearingDate-year']")

        this.latestHearingDate_day = $("input[name='latestHearingDate-day']")
        this.latestHearingDate_month = $("input[name='latestHearingDate-month']")
        this.latestHearingDate_year = $("input[name='latestHearingDate-year']")


        this.fieldMapping = {
            "Length of hearing": $('#hearing-length'),
            "Does the hearing need to take place on a specific date?": $('#hearing-specific-dates'),
            "What is the priority of this hearing?": $('#hearing-priority'),
            "The first date of the hearing must be": $("#firstHearingDate-date"),
            "Earliest start date": $('#earliestHearingDate-date'),
            "Latest end date": $('#latestHearingDate-date')

        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed();
    }

    async inputValue(field, value) {
        switch (field) {
            case "Length of hearing":
                const valueMap = value.split(',')
                await this.durationDays.sendKeys(valueMap[0].trim())
                await this.durationHours.sendKeys(valueMap[1].trim())
                await this.durationMinutes.sendKeys(valueMap[2].trim())
                break;
            case "Does the hearing need to take place on a specific date?":
                const opt = value.toLowerCase().trim()
                if(opt.includes('no')){
                    await this.noSpecificDate.click()
                } else if (opt.includes('yes')){
                    await this.hearingSingleDate.click()
                } else if (opt.includes('choose a date range')) {
                    await this.hearingDateRange.click()
                } else{
                    throw new Error(`Unrecognised option for ${field}`)
                }
                break;
            case "What is the priority of this hearing?":
                await this.selectHearingPriority(value.trim())
                break;
            case "The first date of the hearing must be":
                const firstDateMap = value.split(',')
                await this.firstHearingDate_day.sendKeys(firstDateMap[0].trim())
                await this.firstHearingDate_month.sendKeys(firstDateMap[1].trim())
                await this.firstHearingDate_year.sendKeys(firstDateMap[2].trim())
                break;
            case "Earliest start date":
                const earliestDate = value.split(',')
                await this.earliestHearingDate_day.sendKeys(earliestDate[0].trim())
                await this.earliestHearingDate_month.sendKeys(earliestDate[1].trim())
                await this.earliestHearingDate_year.sendKeys(earliestDate[2].trim())
                break;
            case "Latest end date":
                const latestEndDate = value.split(',')
                await this.latestHearingDate_day.sendKeys(latestEndDate[0].trim())
                await this.latestHearingDate_month.sendKeys(latestEndDate[1].trim())
                await this.latestHearingDate_year.sendKeys(latestEndDate[2].trim())
                break;
            default:
                throw new Error(`${field} not recognised.`)
        }
    }

    async selectHearingPriority(priority){
        const ele = element(by.xpath(`//fieldset[@id='hearing-priority']//label[contains(text(),'${priority}')]/../input`))
        await ele.click();
    }

}

module.exports = HearingTimingPage;
