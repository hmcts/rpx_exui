
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

        return await getActor().grabNumberOfVisibleElements(this.selector)
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
        return await getActor().grabTextFrom(this.selector) 
    }

    async sendKeys(keys){
        await this.wait();
        await this.click();
        await getActor().fillField(this.selector, keys) 
    }

    async clear(){
        await this.wait();
        await getActor().clearField(this.selector)  
    }

    async click(){
        await this.wait();
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
        await getActor().selectOption(this.selector, label)
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
        let count = 0;
        const locatorType = Object.keys(this.selector)[0]
        return await getActor().isVisible(this.selector)
      
    }

    async isEnabled(){
        const isDisabled = await getActor().grabAttributeFrom(this.selector, 'disabled');
        return !isDisabled
    }

    async isChecked(){
        const selectorType = Object.keys(this.selector)[0]
        const isChecked = await getActor().executeScript(function(selectorType, selector){
            if (selectorType === 'css'){
                return document.querySelector(selector).checked;
            }else{
                return document.evaluate(
                    selector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue.checked;
            }
            
        }, selectorType, this.selector[selectorType]);
        return isChecked
    }

    async isDisplayed(){
        return await getActor().isVisible(this.selector)
    }


    async count(){
        await this.wait();
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
        const attributeValue = await getActor().grabAttributeFrom(this.selector, attr)
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

        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const thisElement = this;
            const interval = setInterval(async () => {
                const elapsedTime = (Date.now() - startTime)/1000;
                const isPresent = await thisElement.isPresent()
                // reportLogger.AddMessage(`WAIT elapsed time : ${elapsedTime}`)
                if (isPresent) {
                    clearInterval(interval)
                    resolve(true)
                } 
                // else if (elapsedTime > 30){
                //     clearInterval(interval);
                //     reportLogger.AddMessage(`ELEMENT_WAIT_FAILED: not present ${JSON.stringify(this.selector)} at ${this.__getCallingFunctionName()} `);
                //     reject(false);
                // }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                reject(false);
            }, 30*1000)
         
        });
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
    
}


module.exports = { Element, ElementCollection }