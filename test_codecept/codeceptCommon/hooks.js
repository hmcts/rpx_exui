const event = require('codeceptjs').event;
const worker = require('codeceptjs').worker;
const output = require('codeceptjs').output;
const path = require('path')
const fs = require('fs');

const browser = require('./browser')

const codeceptMochawesomeLog = require('./reportLogger')
const statsReporter = require('./statsReporter')

const e2eTestDataManager = require('../e2e/utils/testDataManager/index');
const mockClient = require('../backendMock/client/index')
const idamLogin = require('../ngIntegration/util/idamLogin');

const isIntegrationTestType = process.env.TEST_TYPE && process.env.TEST_TYPE === 'ngIntegration'

const testType = process.env.TEST_TYPE

let featureLogFile = null;

global.scenarioData = {}

function overrideConsoleLogforWorkersThreads(){

    const consoleLogRef = console.log;
    const consoleErrorRef = console.error;
    global.console.log = function (message) {
        const folderName = path.resolve(__dirname, `../../functional-output/tests/featureLogs-${testType}`)
        if (!featureLogFile) {
            featureLogFile = folderName + '/executionLogs.log'
        }
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        const dateTime = new Date().toLocaleTimeString('en-GB');
        consoleLogRef(message)
        fs.appendFileSync(`${featureLogFile}`, `\n ${dateTime} : ${message}`)
    }


    global.console.error = (error) => {
        const folderName = path.resolve(__dirname, `../../functional-output/tests/featureLogs-${testType}`)
        if (!featureLogFile) {
            featureLogFile = folderName + '/executionLogs.log'
        }
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        fs.appendFileSync(`${featureLogFile}`, "\n ERROR \n")

        fs.appendFileSync(`${featureLogFile}`, '\n' + error)
        consoleErrorRef(error)
    }

}



function setFeatureLogFile(test){
    const fileName = getFeatureFileName(test)
    const folderName = `${__dirname}/../../functional-output/tests/featureLogs-${testType}`
    featureLogFile = `${folderName}/${fileName}.txt`
    // if (!fs.existsSync(folderName)) {
    //     fs.mkdirSync(folderName);
    // }
    codeceptMochawesomeLog.featureLogFilePath = featureLogFile;
}


function getFeatureFileName(test){
    const filePathSplit = test.file.split('/')
    return filePathSplit[filePathSplit.length - 1]
}

function clearFeatureLogFile(test){
    const fileName = getFeatureFileName(test)
    const folderName = `${__dirname}/../../functional-output/tests/featureLogs-${testType}`
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    fs.writeFileSync(`${folderName}/${fileName}.txt`, 'Test initialised')

}

function logsTestStats(status, completedTests, workerStats){
    const folderName = `${__dirname}/../../functional-output/tests/featureStats-${testType}.log`
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    console.log('Test status : ', status ? 'Passes' : 'Failed ');

    // print stats

    fs.appendFileSync(`${folderName}`, `Total tests : ${workerStats.tests}`);
    fs.appendFileSync(`${folderName}`, `Passed tests : ${workerStats.passes}`);
    fs.appendFileSync(`${folderName}`, `Failed test tests : ${workerStats.failures}`);

    // If you don't want to listen for failed and passed test separately, use completedTests object
    for (const test of Object.values(completedTests)) {
        fs.appendFileSync(`${folderName}`, `Test status: ${test.err === null}, `, `Test : ${test.title}`);
    }
}

function featureLogsMessage(test, message){
    const fileName = getFeatureFileName(test)
    const folderName = `${__dirname}/../../functional-output/tests/featureRunLogs-${testType}`
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    fs.appendFileSync(`${folderName}/${fileName}.txt`, message)
}

module.exports = async function () {
    event.dispatcher.on(event.suite.before, async function (test) {
        overrideConsoleLogforWorkersThreads();
    });
    event.dispatcher.on(event.test.before, async function (test) {
        setFeatureLogFile(test)
        output.print(`Test started : ${test.title}`)
        codeceptMochawesomeLog.AddMessage(`************ Test started : ${test.title}`)
        await mockClient.logMessage(`************ Test started : ${test.title}`)
        const dateTime = new Date().toLocaleTimeString('en-GB');

        featureLogsMessage(test, `\n${dateTime}| ************ Test started | ${test.title}`);

        statsReporter.run()

    });

    // event.dispatcher.on(event.all.result, (status, completedTests, workerStats) => {
    //     // print output
    //     logsTestStats(status, completedTests, workerStats)
    // });


    event.dispatcher.on(event.test.after, async function (test) {
        output.print(`Test ${test.state} : ${test.title}`)
        await mockClient.logMessage(`************ Test status|${test.title}:${test.state }`)

        actor().flushLogsToReport();

        const authCookies = idamLogin.authToken
        if (test.state === 'failed' && process.env.TEST_TYPE !== 'e2e'){

            const mockSessiondataResponse = await mockClient.getUserSesionData(authCookies);
            featureLogsMessage(test, `${JSON.stringify(mockSessiondataResponse.data, null, 2)}`);
            codeceptMochawesomeLog.AddJson(authCookies);
        }

        if (test.state === 'failed' || true){
            codeceptMochawesomeLog.AddMessage(`*************** Browser error logs ***************`);

            let errorLogs = await actor().grabBrowserLogs()
            errorLogs = errorLogs.filter(error => error._event.type.includes('error'))
            for(let error of errorLogs){
                codeceptMochawesomeLog.AddMessage(`${error._event.type}:${error._event.location.url} =>  ${error._event.text} `);
            }
        }


        // featureLogsMessage(test, `\n cookies \n ${JSON.stringify(cookies, null, 2)}`);
        const dateTime = new Date().toLocaleTimeString('en-GB');
        featureLogsMessage(test, `\n${dateTime}| ************ Test status|${test.state}|${test.title}`);
        statsReporter.run()
        // await e2eTestDataManager.cleanupForTags(test.tags);

    });


    event.dispatcher.on(event.test.passed,async function (test) {

        codeceptMochawesomeLog.AddMessage("************ Test passed")

    });

    // event.dispatcher.on(event.test.failed, async function (test) {
    //     output.print(`Test failed event : ${test.title}`)


    //     // const authCookies = idamLogin.xuiCallbackResponse.details?.setCookies?.find(cookie => cookie.name === '__auth__')
    //     // const mockSessiondataResponse = await mockClient.getUserSesionData(authCookies ? authCookies.value : null);
    //     // featureLogsMessage(test,`${JSON.stringify(mockSessiondataResponse.data, null, 2)}`);

    //     // codeceptMochawesomeLog.AddMessage(`************ Test failed : `)
    //     // featureLogsMessage(test, `\n************ Test failed:  ${test.state} : ${test.title}`);

    // });


    event.dispatcher.on(event.bddStep.before, async function (bddStep) {
        // output.print(`STEP: ${bddStep.keyword} ${bddStep.text} `)
        const log = `=== BDD) ${bddStep.keyword} ${bddStep.text}`;
        codeceptMochawesomeLog.AddMessage(log)

        if (bddStep.text.trim() === 'I see case details tab label "Hearings" is displayed is "true"'){
            await new Promise((resolve,reject) => {
                setTimeout(() => {
                    resolve(true)
                }, 300*60)
            })
        }

    });


    // event.dispatcher.on(event.step.failed, function (step,err) {
    //     const msg = `***** STEP FAILED ***** : ${step.actor} ${step.name}}`
    //     // output.print(msg)
    //     codeceptMochawesomeLog.AddMessage(msg)
    //     for (const arg of step.args){
    //         codeceptMochawesomeLog.AddMessage(arg)

    //     }
    // });


    // event.dispatcher.on(event.bddStep.after, function (bddStep) {
    //     output.print(`STEP: ${bddStep.keyword} ${bddStep.text} => ${bddStep.status.toUpperCase()}`)
    //     codeceptMochawesomeLog.AddMessage(`STEP: ${bddStep.keyword} ${bddStep.text} => ${bddStep.status.toUpperCase()}`)

    //     if(!bddStep.status.includes('passed')){
    //         return attachBrowserLogs();
    //     }
    // });
}

async function attachBrowserLogs(){
    const logs = await browser.getBrowserLogs();
    for(const log of logs){
        if (log._type !== 'error'){
            continue;
        }
        codeceptMochawesomeLog.AddMessage(`Error: ${log._text}`);
        for(const stacktraceLocation of log._stackTraceLocations){
            if (stacktraceLocation.url.includes('.js')){
                continue;
            }
            codeceptMochawesomeLog.AddMessage(`       ${stacktraceLocation.url}:${stacktraceLocation.lineNumber}`);
        }
    }

}

