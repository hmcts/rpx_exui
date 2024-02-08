

const BrowserWaits = require("../../support/customWaits");
const ArrayUtil = require("../../utils/ArrayUtil");
var { defineSupportCode } = require('cucumber');
const BrowserLogs = require('../../support/browserLogs');

const cucumberReporter = require('../../../codeceptCommon/reportLogger');

   

    Given('I switch to new window opened', async function(){
        let retryCounter = 1;
        await BrowserWaits.retryWithActionCallback(async () => {
            await BrowserWaits.waitForSeconds(retryCounter * 2);
            retryCounter++;
            const unknownWindowHandles = await getUnknownWindowHandles();

            if (unknownWindowHandles.length > 1) {
                throw new Error("More than one unknown window handle found. Please reference any new windows opened or close them to keep tests clean. ");
            } else if (unknownWindowHandles.length === 0) {
                throw new Error("No new windows opened ");
            }
            await browser.switchTo().window(unknownWindowHandles[0]);
        });
        
    });

    Then('I verify a networkc all made with endpoint containing {string}', async function(endPoint){
        const networkLogs = await BrowserLogs.getNetworkLogs();
        let isendPointTrigered = false;
        for (networkCall of networkLogs){
            if(networkCall.requestDetails.url.includes(endPoint)){
                isendPointTrigered = true;
                break;
            }
        }
        // cucumberReporter.AddJson(networkLogs);
        expect(isendPointTrigered).to.be.true
    });

    Given('I am perforing actions to validate {string}', async function(behaviour){
        const behaviourStringLen = behaviour.length;
        const border = "**********************".padStart(behaviourStringLen,"*")
        cucumberReporter.AddMessage(`${border}`);
        cucumberReporter.AddMessage(`********** ${behaviour} ***********`);
        cucumberReporter.AddMessage(`${border}`);
    });
       Then('debug sleep minutes {int}', async function(minutes){
        await new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(true)
            }, minutes*60*1000)
        })
    });



    


     Then('I wait for seconds for {int}', async function(waitSeconds){
        await new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(true)
            }, waitSeconds*1000 )
        })
    });

    async function getUnknownWindowHandles(){
        const scenarioDataKeys = Object.keys(global.scenarioData);
        const windowReferences = await ArrayUtil.filter(scenarioDataKeys,async (scrDataKey) => scrDataKey.includes('window.') );
        const knownWindowHandles = await ArrayUtil.map(windowReferences, async (windowRef) => { return global.scenarioData[windowRef]}); 
        const allWindowHandles = await browser.getAllWindowHandles();
        const unKnownWindowHandles = await ArrayUtil.filter(allWindowHandles, async (handle) => !knownWindowHandles.includes(handle));
        return unKnownWindowHandles;
    }


   Then('debug sleep minutes {int}', async function(minutes){
        await new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(true)
            }, minutes*60*1000)
        })
    });



