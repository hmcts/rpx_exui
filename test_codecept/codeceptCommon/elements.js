
function getActor() {
    return actor().retry({ retries: 3, minTimeout:  5});
}


const reportLogger = require('./reportLogger')


class ElementCollection {
    constructor(locator, parent) {
        this.type = 'collection'

        this.nativeElements = []
        this.selector = locator
        this.position = -1;
        this.parent = parent;
    }

    getElementSelector() {
        const selectors = [];
        if (this.parent) {
            const parentSelectors = this.parent.getElementSelector();
            selectors.push(...parentSelectors)
        }
        selectors.push(this.selector)
        return selectors
    }

    first(){
        // await this.count();
        // const nativeLement = new PuppeteerNativeElement(0, null);
        // return nativeLement;
        return this.get(0)
    }

    get(index){
0
        // // await this.count();
        // if (index >= this.nativeElements.length ){
        //     throw Error(`Array index out of bound, elements count ${this.nativeElements.length} , index to get ${index}`);
        // }
        
        // const nativeLement = new PuppeteerNativeElement(index, this);
        // return nativeLement;
        const locatorAtIndex = locate(this.selector).at(index + 1)
        const selector = locatorAtIndex.locator
        return new Element(selector)
    }

    async wait(){
       return new Promise((resolve,reject) => {
            const interval = setInterval(async () => {
                const count = await this.count();
                if (count !== 0){
                    clearInterval(interval)
                    resolve(true)
                }
            },500);
            setTimeout(() => {
                clearInterval(interval);
                reject(false);
            })
       });
    }

    async getItemWithText(text){
        const count = await this.count();
        let element = null;
        for(let i = 0;i < count;i++ ){
            const e = this.get(i);
            const eText = await e.getText();
            if(eText.includes(text)){
                element = e;
                break;
            }
        }
        return element;

    }


    async count(){
        // if(this.selector){
        //     const helperNativeElement = new PuppeteerNativeElement(null, null)
        //     this.nativeElements = await helperNativeElement.getNativeElements(this.selector);
        // }
        
        // let sourceElement = null;
        // if (this.parent){
        //     sourceElement = await this.parent.__checkAndGetNativeElement();
        // }else{
        //     sourceElement = await getActor().getPuppeteerPage();

        // }

        // const keys = Object.keys(this.selector)
        // if (keys[0] === 'css') {
        //     this.nativeElements =  await sourceElement.$$(this.selector[keys[0]])

        // } else {
        //     this.nativeElements =  await sourceElement.$x(this.selector[keys[0]])
        // }
        // return this.nativeElements.length

        const elements = await getActor().grabHTMLFromAll(this.selector)
        return elements.length;
    }



    async getText(){
        
    }
}

class Element {

    constructor(selector) {
        this.selector = selector
    }

    _childElement(locator){
        let newSelector = '';
     
        newSelector = locate(this.selector).find(locator).locator
        return new Element(newSelector)
    }

    withChild(childSelector){
        const selector = locate(this.selector).withChild(childSelector)
        return new Element(selector.locator)
    }

    element(locator) {
        return this._childElement(locator)
    }

    $(locator) {
        return this._childElement(locator)
    }
    $$(locator) {
        const child = this._childElement(locator)
        return new ElementCollection(child.selector, null)
    }
   

    locator() {
        return this.selector
    }

    async getText(){
        await this.wait();
        reportLogger.AddMessage(`getText: ${JSON.stringify(this.selector)}`)
        const selectorType = Object.keys(this.selector)[0]
        const selector = selectorType === 'css' ? this.selector.css : `xpath=${this.selector.xpath}`
        return await getActor().getTextUsingPlaywright(selector) 
    }

    async getTextFromAll() {
        await this.wait();
        reportLogger.AddMessage(`getText: ${JSON.stringify(this.selector)}`)

        return await getActor().grabTextFromAll(this.selector)
    }

    async sendKeys(keys){
        await this.wait();
        // await this.click();
        await getActor().fillField(this.selector, keys) 
    }

    async clear(){
        await this.wait();
        await getActor().clearField(this.selector)  
    }

    async click(){
        await this.wait();
        reportLogger.AddMessage(`click: ${JSON.stringify(this.selector)}`)

        await getActor().click(this.selector)  
    }

    async getSelectOptions() {
        await this.wait();
        const options = await this._childElement('option')
        const labels = await getActor().grabTextFromAll(options.selector)
        return labels;
    }


    async selectOptionWithLabel(label){
        await this.wait();
        const options = await this.getSelectOptions();
        const option = options.find((option) => option.includes(label))
        await this.select(option)
    }

    async select(option){
        await this.wait();
        await getActor().selectOption(this.selector,option)
    }

    async selectOptionAtIndex(index){
        await this.wait();
        let options = await this.getSelectOptions();
        options = options.map(option => option.trim())
        await this.select(options[index])
    }

    async selectWithLabelContains(label){
        let options = await this.getSelectOptions();
        const optionWithLabel = options.find(opt => opt.includes(label))
        await this.select(optionWithLabel)
    }

    async isPresent(){
        try{
            const e = await getActor().getPlaywrightlocator(this.selector)
            const count = await e.count()
            return count > 0;
        }catch(err){
            reportLogger.AddMessage(`error occured ${err.message}`)
            return false
        }
      
      
    }

    async isEnabled(){
        const isDisabled = await getActor().grabAttributeFrom(this.selector, 'disabled');
        return !isDisabled
    }

    async isChecked(){
        const selectorType = Object.keys(this.selector)[0]
        const selector = selectorType === 'css' ? this.selector.css : `xpath=${this.selector.xpath}`
        return await getActor().isElementChecked(selector)
    }

    async isDisplayed(){
        reportLogger.AddMessage(`isDisplayed: ${JSON.stringify(this.selector)}`)
        return await getActor().isVisible(this.selector)
    }


    async count(){
        // await this.wait();
        const elements = new ElementCollection(this.selector) 
        return await elements.count()
    }

    async get(index){
        await this.wait();
        return new Element(locate(this.selector).at(index+1)) 
    }

    async getAttribute(attr){
        await this.wait();
        reportLogger.AddMessage(`getAttribute "${attr}" from ${JSON.stringify(this.selector)}`)
        const selectorType = Object.keys(this.selector)[0]
        const selector = selectorType === 'css' ? this.selector.css : `xpath=${this.selector.xpath}`
        const attributeValue = await getActor().getAttributeUsingPlaywright(selector, attr)
        if (attributeValue instanceof Object){
            const values = Object.values(attributeValue)
            let attributeItemValues = ''
            for (const prop of values){
                const v = await getActor().grabCssPropertyFrom(this.selector, prop)
                attributeItemValues = `${prop}: ${v};`;      
            }
            return attributeItemValues 
        }else{
            return attributeValue 
        }
        
        
    }

    async getTagName(){
        await this.wait();
        const locatorType = Object.keys(this.selector);
        let tagName = null;

        if (locatorType.includes('css')){
            tagName =  await getActor().executeScript(function (selector) {
                return document.querySelector(selector.css).tagName.toLowerCase()
            }, this.selector)
        }else{
            tagName =  await getActor().executeScript(function (selector) {
                const snapshots =  document.evaluate(selector.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
                if (snapshots.snapshotLength === 0){
                    return null
                }
                return snapshots.snapshotItem(0).tagName.toLowerCase();
            }, this.selector)
        }
        if (tagName === null){
            reportLogger.AddMessage(`ELEMENT_NOT_FOUND: ${JSON.stringify(this.selector)}`)

        }
        return tagName;
    }

    async uploadFile(file){
        await this.wait();
        await getActor().attachFile(this.selector, '../e2e/documents/'+file);
    }

    static all(locator) {
        return new ElementCollection(locator)
    }

    async wait(waitInSec){
        reportLogger.AddMessage("ELEMENT_WAIT: " + JSON.stringify(this.selector) +" at "+this.__getCallingFunctionName());
        let waitTime = waitInSec ? waitInSec : 20;
        let isPresentStatus = null;
        let elapsedWait = 0;
        do{ 
            if (isPresentStatus === false){
                await browser.sleepInMillisec(100)
            }
            isPresentStatus = await this.isPresent();
            elapsedWait += 100;

        } while (!isPresentStatus && elapsedWait / 1000 < waitTime)

        if (!isPresentStatus){
            throw new Error(`Element not found after wait for ${waitTime}sec`)
        }
        return isPresentStatus;
        // await getActor().waitForPlaywrightLocator(this.selector)
    }

    async scrollIntoView(){
        await this.wait();
        await getActor().scrollTo(this.selector)
    }

    async isSelected(){
        await this.wait();
        return await getActor().grabAttributeFrom(this.selector, 'checked');
    }

    async getSelectOptions(){
        await this.wait();
        const options = await this._childElement('option')
        const labels = await getActor().grabTextFromAll(options.selector)
        return labels;
    }


    __getCallingFunctionName(){
        let e = new Error();
        let frame = e.stack.split("\n")[3]; // change to 3 for grandparent func
        let lineNumber = frame.split(":").reverse()[1];
        let functionName = frame.split(" ")[5];

        if (functionName.includes('/')) {
            functionName = functionName.split('/').reverse()[0]
        }
        functionName + ":" + lineNumber;
        return functionName;
    }

    async waitForElementdetach(){
        await getActor().waitForPlaywrightLocatorState(this.selector,'detached')
    }
    
}


module.exports = { Element, ElementCollection }