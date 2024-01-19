
class HearingJudgePage {
    constructor() {
        this.pageContainer = $('exui-hearing-judge');

        this.specificJudgeRadio = $('#specificJudgeName')
        this.noSpecificJudgeRadio = $('#noSpecificJudge')

        this.excludeJudgeSearchInput = $('#inputSelectPersonExclude')
        this.excludeJdgeBtn = element(by.xpath(`//div[contains(@class, 'govuk-button')][contains(text(),'Exclude judge')]`))

        this.searchJudicialUserContainer = element(by.xpath("//div[contains(@class, 'govuk-radios__conditional')]//h1[contains(text(),'Name of the judge')]/../../xuilib-search-judicials"))
        this.searchJudicialUserInput = element(by.xpath("//div[contains(@class, 'govuk-radios__conditional')]//h1[contains(text(),'Name of the judge')]/../../xuilib-search-judicials//input"))

        this.judgeTypesContainer = element(by.xpath("//div[contains(@class, 'govuk-radios__conditional')]//h1[contains(text(),'Select all judge types that apply')]"))

        this.fieldmapping = {
            "Do you want a specific judge?": $('#specific-judge-selection'),
            "Exclude a judge": element(by.xpath("//div[contains(text(),'Exclude a judge')]")),
            "Name of the judge": element(by.xpath("//h1[contains(text(), 'Name of the judge')]")),
            "Select all judge types that apply": element(by.xpath("//h1[contains(text(),'Select all judge types that apply')]"))
   
        }

    }


    async inputValue(field, value) {
        switch (field) {
            case "Do you want a specific judge?":
                if (value.toLowerCase().includes('yes')) {
                    await this.specificJudgeRadio.click()
                } else {
                    await this.noSpecificJudgeRadio.click()
                }
                break;
            case "Exclude a judge":
                const valueMap = value.split(',')
                await this.excludeJudgeSearchInput.sendKeys(valueMap[0].trim())
                await this.selectJudgeUserToExclude(valueMap[1].trim())
                await this.excludeJdgeBtn.click()
                break;
            case "Name of the judge":
                const judgeName = value.split(',')
                await this.searchJudicialUserInput.sendKeys(judgeName[0].trim())
                await this.selectJudge(judgeName[1].trim())
                break;
            case "Select all judge types that apply":
                const judgeTypes = value.split(",");
                for (const val of judgeTypes) {
                    await this.selectJudgeType(val.trim())
                }
                break;
            default:
                throw new Error(`${field} is not recognised`)
        }
    }


    async selectIsSpecificJudgeRequired(boolVal) {
        if (boolVal) {
            await this.specificJudgeRadio.click()
        } else {
            await this.noSpecificJudgeRadio.click()
        }
    }

    async selectJudgeType(judgeType) {
        const ele = element(by.xpath(`//div[contains(@class, 'govuk-radios__conditional')]//h1[contains(text(),'Select all judge types that apply')]/../../div[@id ='judgeTypes']//label[contains(text(),'${judgeType}')]/../input`))
        await ele.click()
    }

    async selectJudgeUserToExclude(value) {
        const ele = element(by.xpath(`//div[contains(@class,'mat-autocomplete-panel')]//mat-option//span[contains(text(),'${value}')]`))
        await ele.click();
    }


    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

    async selectJudge(judge) {
        const ele = element(by.xpath(`//div[contains(@class,'mat-autocomplete-panel')]//mat-option//span[contains(text(),'${judge}')]`))
        await ele.click();
    }
}

module.exports = HearingJudgePage;
