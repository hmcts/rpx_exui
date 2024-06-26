// var EC = protractor.ExpectedConditions;


const CucumberReporter = require('../../codeceptCommon/reportLogger');
const BrowserLogs = require('./browserLogs');
const reportLogger = require('../../codeceptCommon/reportLogger');

class BrowserWaits{
    constructor(){
        this.waitTime = 15000;
        this.pageErrors = $$(".error-summary");
        this.retriesCount = 3;

        this.logLevel = 'DEBUG'
    }

    setLoglevelINFO() {
        this.logLevel = 'INFO'
    }

    setDefaultWaitTime(defaultWait) {
        this.waitTime = defaultWait;

    }

    setRetryCount(count) {
        this.retriesCount = count;
    }

    async waitForSeconds(waitInSec) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve();
            }, waitInSec*1000)
        })
    }

    async waitForElementTime(element, waitTime) {
        await browser.wait(EC.presenceOf(element), waitTime ? waitTime : 10000, "Error waitForElementTime : " + JSON.stringify(element.selector));

    }

    async waitForElement(element, message, waitForSeconds) {
        const startTime = Date.now();
        CucumberReporter.AddMessage("ELEMENT_WAIT: at " + this.__getCallingFunctionName()+ " " + JSON.stringify(element.selector)+" at ");
        await element.wait(this.waitTime / 1000)

        // await this.waitForConditionAsync(async () => {
        //     const isPresent = await element.isPresent();
        //     return isPresent;
        // }, 20*1000);
        // CucumberReporter.AddMessage("ELEMENT_FOUND: in sec " + (Date.now() - startTime) / 1000 + " "+ JSON.stringify(element.selector) );

    }

    async waitForPresenceOfElement(element) {
        await this.waitForElement(element);
    }

    async waitForElementClickable(element, waitInSec) {
        const startTime = Date.now();
        const waitTimeInMilliSec = waitInSec ? waitInSec * 1000 : this.waitTime;
        CucumberReporter.AddMessage("starting wait for element clickable max in sec " + waitTimeInMilliSec + " : " + JSON.stringify(element.selector));
        let isEnabled = false;
        for(let i = 0; i< 20;i++){
            await this.waitForSeconds(1);
            isEnabled = await element.isEnabled();
            if(isEnabled){
                break;
            }
        }

        CucumberReporter.AddMessage("wait done in sec " + (Date.now() - startTime) / 1000);
        if (!isEnabled){
            throw Error(`element is not enabled : ${JSON.stringify(element.selector) }`)
        }
    }

    async waitForCondition(condition, message) {
        await this.waitForConditionAsync(condition, this.waitTime, message);
    }

    async waitForConditionAsync(condition, waitInMillisec, waitMessage) {
        const waitForMillisec = waitInMillisec ? waitInMillisec : this.waitTime;
        await new Promise((resolve, reject) => {
            const conditionCheckInterval = setInterval(async () => {
                let isConditionMet = false;
                try {
                    isConditionMet = await condition();
                    console.log(`Wait for condition stateus : ${isConditionMet}`)
                } catch (err) {
                    CucumberReporter.AddMessage("Error waiting for condition " + err);
                }
                if (isConditionMet) {
                    clearInterval(conditionCheckInterval);
                    resolve(true);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(conditionCheckInterval);
                reject(new Error(`wait condition not satisfied after total wait time ${waitForMillisec} : ${waitMessage ? waitMessage : ''}`));
            }, waitForMillisec)
        });

    }

    async waitForSelector(selector) {
        var selectorElement = $(selector);
        await browser.wait(EC.presenceOf($(selector)), this.waitTime, "Error find element with selector: " + selector);
    }

    async waitForstalenessOf(element) {
        await browser.wait(EC.stalenessOf(element), this.waitTime);
    }

    async waitForPageNavigation(currentPageUrl) {
        var nextPage = "";
        let pageErrors = "";
        for (let i = 0; i < 20; i++) {
            await this.waitForSeconds(1);
            nextPage = await browser.getCurrentUrl();
            reportLogger.AddMessage(`waiting for page nav`)
            reportLogger.AddMessage(`From   : ${currentPageUrl}`)
            reportLogger.AddMessage(`Current: ${nextPage}`)
            if (currentPageUrl !== nextPage) {
                break;
            }
        }

        if (currentPageUrl === nextPage) {
            throw Error(`Failed Waiting for page navigation from ${currentPageUrl}`)
        }
        return nextPage;
    }


    async waitForPageNavigationOnAction(callback) {
        const beforeActionUrl = await browser.getCurrentUrl();
        await callback();
        await this.waitForPageNavigation(beforeActionUrl);

        return await browser.getCurrentUrl();
    }


    async waitForBrowserReadyState(waitInSec) {
        let resolvedWaitTime = waitInSec ? waitInSec * 1000 : this.waitTime;

        CucumberReporter.AddMessage("Started step");
        await this.waitForCondition(async () => {
            let browserState = await browser.executeScript('return document.readyState;');
            CucumberReporter.AddMessage('browser readyState value  "' + browserState + '"');
            return browserState === 'complete';
        }, resolvedWaitTime);
    }

    async retryForPageLoad(element, callback) {
        let retryCounter = 0;

        while (retryCounter < 3) {
            try {
                await element.wait();
                retryCounter += 3;
            }
            catch (err) {
                retryCounter += 1;
                if (callback) {
                    callback(retryCounter + "");
                }
                console.log(element.selector + " .    Retry attempt for page load : " + retryCounter);

                await browser.refresh();

            }
        }
    }


    async retryWithActionCallback(callback, actionMessage, retryTryAttempts) {

        const functionName = this.__getCallingFunctionName()

        let retryCounter = 0;
        let isSuccess = false;
        let error = null;
        while (retryCounter <= this.retriesCount) {
            const waitSec = retryCounter * 2;
            if (retryCounter > 0){
                CucumberReporter.AddMessage(`ACTION_WARNING: retrying ${retryCounter} ${functionName}`);
            }
            await this.waitForSeconds(waitSec);

            try {
                const retVal = await callback();
                isSuccess = true;
                return retVal;
            }
            catch (err) {
                if (this.logLevel === 'DEBUG') {
                    await BrowserLogs.printBrowserLogs();
                }
                CucumberReporter.AddMessage(`Actions success Condition ${actionMessage ? actionMessage : ''} failed ${err}. `);

                error = err
                console.log(err)

                const currentRoute = await browser.getCurrentUrl()
                if (currentRoute.includes('service-down')) {
                    throw new Error('Generic system error displayed: "Sorry, there is a problem with the service"');
                }

            }
            retryCounter += 1;

        }
        if (!isSuccess) {
            CucumberReporter.AddMessage(`ACTION_FAILURE: Action failed to meet success condition after ${this.retriesCount} retry attempts. ${functionName }`);
            throw error;
        }
    }

    async waitForSpinnerToDissappear() {
        let status = true
        let counter = 0;
        do{
            status = await $("div.spinner-container").isDisplayed();
            CucumberReporter.AddMessage(`waiting for spinner to disappear`);

            await this.waitForSeconds(2)
            counter++;null
        }
        while (status && counter < 10)
        CucumberReporter.AddMessage(status ? `spinner closed` : 'spinner still displayed');

        // const isSpinnerPresent = await $("div.spinner-container").isPresent();

        // await this.waitForCondition(async () => {
        //     const isSpinnerPresent = await $("div.spinner-container").isPresent();
        //     CucumberReporter.AddMessage('Waiting for spinner to dissappear.');
        //     return !isSpinnerPresent;
        // }, 'Spinner is still displayed after waiting ');
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

module.exports = new BrowserWaits();
