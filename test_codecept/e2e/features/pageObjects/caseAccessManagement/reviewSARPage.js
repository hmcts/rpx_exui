

class SpecificAccessReviewPage{

    constructor(){
        this.container = $('exui-specific-access-review');

        this.requestDetails = $$(`exui-specific-access-review table tbody tr`);

        this.fieldMapping = {
            "Review specific access request": element(by.xpath(`//h1[contains(text(),'Review specific access request')]/../../table`)),
            "What do you want to do with this request?": element(by.xpath(`//h1[contains(text(),'What do you want to do with this request?')]/../..//exui-choose-radio-option`)),
            "Approve request": element(by.xpath(`//label[contains(text(),'Approve request')]/../input`)),
            "Reject request": element(by.xpath(`//label[contains(text(),'Reject request')]/../input`)),
            "Request more information": element(by.xpath(`//label[contains(text(),'Request more information')]/../input`))
        }
    }


    async inputValues(field, value){
        switch(field){
            case "What do you want to do with this request?":
                const ele = element(by.xpath(`//h1[contains(text(),'What do you want to do with this request?')]/../..//exui-choose-radio-option//label[contains(text(),'${value}')]/../input`))
                await ele.click();
                break;
            default:
                throw new Error(`${field} not configured`)
        }
    }

    async getAccessRequestDetails() {
        const requestDetails = {};
        const rowsCount = await this.requestDetails.count();
        for (let i = 0; i < rowsCount; i++) {
            const row = await this.requestDetails.get(i);
            const name = await row.$('th').getText();
            const value = await row.$('td').getText();
            requestDetails[name] = value;
        }
        return requestDetails;
    }

}
module.exports = SpecificAccessReviewPage; 
