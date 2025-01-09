

class HearingVenueDetailsPage {
    constructor() {
        this.pageContainer = $('exui-hearing-venue');

        this.locationSearchInput = $('xuilib-search-venue input')
        this.addLocationBtn = element(by.xpath("//exui-hearing-venue//a[contains(text(), 'Add location')]"))

        this.fieldMapping = {
            "Search for a location by name": $('div.search-location')
        }

    }

    async inputValue(field, value) {
        switch (field) {
            case "Search for a location by name":
                const values = value.split(',')
                await this.locationSearchInput.sendKeys(values[0])
                await this.selectLocation(values[1])
                await this.addLocationBtn.click()
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }

    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }



    async selectLocation(location) {
        const ele = element(by.xpath(`//div[contains(@class,'mat-autocomplete-panel')]//mat-option//span[contains(text(),'${location}')]`))
        await ele.click();
    }

}

module.exports = HearingVenueDetailsPage;
