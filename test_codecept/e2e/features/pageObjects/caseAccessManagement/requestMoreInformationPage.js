

class SARRequestMoreInformationPage{
    constructor(){
        this.container = $('exui-specific-access-information h1');
        
        this.fieldMapping = {
            "Request more information": element(by.xpath(`//h1[contains(text(),'Request more information')]/..//textarea`))
        }

        

    }

    async inputValues(field, value){
        await this.fieldMapping[field].sendkeys(value)
    }

}

module.exports = SARRequestMoreInformationPage;
