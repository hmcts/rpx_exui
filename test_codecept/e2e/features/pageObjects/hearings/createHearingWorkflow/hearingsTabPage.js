

class HearingsTab{

    constructor(){
        this.tabContainer = $('exui-case-hearings')
        this.requesthearingBtn = element(by.xpath("//exui-case-hearings//a[contains(text(),'Request a hearing')]"))

    }


    async isHearingsTabDisplayed(){
        return await this.tabContainer.isDisplayed()
    }

    async clickRequestHearingButton(){
        await this.requesthearingBtn.click();
    }


}

module.exports = new HearingsTab();



