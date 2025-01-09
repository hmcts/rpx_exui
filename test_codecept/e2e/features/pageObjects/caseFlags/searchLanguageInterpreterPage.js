

class SearchLanguageInterpreterPage {
    constructor() {
        this.container = $('ccd-search-language-interpreter')

        this.fieldMapping = {
            'Language Interpreter': element(by.xpath(`//ccd-search-language-interpreter//label[contains(text(),'Language Interpreter')]/../..//div[contains(@class,'auto-complete-container')]//input`)),
            "Enter the language manually": element(by.xpath(`//label[contains(text(),'Enter the language manually')]/..//input`)),
            "Enter the language": element(by.xpath(`//label[text()='Enter the language']/..//input`))
        }
    }


    async inputValue(field, value) {
        switch (field) {
            case 'Language Interpreter':
                const searchInput = value.split(',')
                await this.fieldMapping[field].sendKeys(searchInput[0].trim())
                await element(by.xpath(`//mat-option//span[contains(text(),'${searchInput[1].trim()}')]`)).click()
                break;
            case "Enter the language manually":
                await this.fieldMapping[field].click()
                break;
            case "Enter the language":
                await this.fieldMapping[field].sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}
module.exports = SearchLanguageInterpreterPage
