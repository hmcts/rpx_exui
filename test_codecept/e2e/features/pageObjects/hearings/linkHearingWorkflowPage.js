

class LinkHearingWorkflowPage{

    constructor(){
        this.pages = {
            'Which hearings should be linked?': $('exui-linked-hearings-with-case'),
            'How should these linked hearings be heard?': $('exui-linked-hearings-how-to-heard'),
            'Check your answers': $('exui-linked-hearings exui-check-your-answers')
        }
      
        this.continueButton = element(by.xpath(`//button[contains(text(),'Continue')]`))
        this.linkHearingsBtn = element(by.xpath(`//button[contains(text(),'Link hearings')]`))

        this.confirmationBanner = $('exui-linked-hearings-final-confirmation exui-hearing-confirmation')
    }
    
    async isCaseTableDisplayed(caseId){
        return await element(by.xpath(`//th[contains(text(),'${caseId}')]`)).isDIsplayed();
    }

    async selectCaseHearing(caseRef, hearing){
        await element(by.xpath(`//th[contains(text(),'${caseRef}')]/../../..//td[contains(text(),'${hearing}')]/..//input`)).click()
    }

    async selectRadioOptionHowLinked(option){
        await element(by.xpath(`//label[contains(text(),'${option}')]/../input`)).click()
    }

    async selectHearingOrder(caseId, order){
        const selectElement = element(by.xpath(`//caption/..//td/a[contains(text(),'${caseId}')]/../../td/select`))
        await selectElement.select(order)
    }


}

module.exports = new LinkHearingWorkflowPage();
