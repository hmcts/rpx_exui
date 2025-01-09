'use strict';
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

const Cucumber = require('cucumber');
const { defineSupportCode } = require('cucumber');
const fs = require('fs');
const mkdirp = require('mkdirp');
const conf = require('../config/conf').config;
const reporter = require('cucumber-html-reporter');
const report = require('cucumber-html-report');

const jsonReports = `${process.cwd()}/reports/json`;
const htmlReports = `${process.cwd()}/reports/html`;
// var xmlReports = process.cwd() + "/reports/xml";
const targetJson = `${jsonReports}/cucumber_report.json`;
// var targetXML = xmlReports + "/cucumber_report.xml";
const { Given, When, Then } = require('cucumber');

const BrowserWaits = require('./customWaits');
const CucumberReportLog = require("./reportLogger");
const BrowserLogs = require('./browserLogs');
const browserUtil = require("../../ngIntegration/util/browserUtil");
const RuntimetestData = require("./runtimeTestData");
// defineSupportCode(function({After }) {
//     registerHandler("BeforeFeature"], function() {
//         var origFn = browser.driver.controlFlow().execute;
//
//         browser.driver.controlFlow().execute = function () {
//             var args = arguments;
//
//             origFn.call(browser.driver.controlFlow(), function () {
//                 //increase or reduce time value, its in millisecond
//                 return protractor.promise.delayed(300);
//             });
//
//             return origFn.apply(browser.driver.controlFlow(), args);
//         };
//         return browser.get(conf.baseUrl);
//     });
//
//     After(function(scenario) {
//         if (scenario.isFailed()) {
//             var attach = this.attach; // cucumber's world object has attach function which should be used
//             return browser.takeScreenshot().then(function(png) {
//                 var decodedImage = new Buffer(png, "base64");
//                 return attach(decodedImage, "image/png");
//             });
//         }
//     });
// x
//     var cucumberReportOptions = {
//         source: targetJson,
//         dest: htmlReports,
//         name: "cucumber_report.html",
//         title: "Cucumber Report"
//     };
//
//     var cucumberReporteroptions = {
//         theme: "bootstrap",
//         jsonFile: targetJson,
//         output: htmlReports + "/cucumber_reporter.html",
//         reportSuiteAsScenarios: true
//     };
//
//     var logFn = string => {
//     if (!fs.existsSync(jsonReports)) {
//         mkdirp.sync(jsonReports);
//     }
//     try {
//         fs.writeFileSync(targetJson, string);
//         reporter.generate(cucumberReporteroptions); //invoke cucumber-html-reporter
//         report
//             .create(cucumberReportOptions)
//             .then(function() {
//                 //invoke cucumber-html-report
//                 // creating two reports(optional) here, cucumber-html-report gives directory already exists as cucumber-html-reporter already creates the html dir!
//                 // suggestion- use either one of the reports based on your needs
//                 console.log("cucumber_report.html created successfully!");
//             })
//             .catch(function(err) {
//                 if (err) {
//                     console.error(err);
//                 }
//             });
//     } catch (err) {
//         if (err) {
//             console.log("Failed to save cucumber test results to json file.");
//             console.log(err);
//         }
//     }
// };
// var jsonformatter = new Cucumber.JsonFormatter({
//     log: logFn
// });
// registerListener(jsonformatter);

// });


defineSupportCode(({ Before,After }) => {
    Before(function (scenario) {
        RuntimetestData.init();
        // global.scenarioData = {};
        const world = this
        
        CucumberReportLog.setScenarioWorld(this);
    });

    After(async function(scenario) {
        CucumberReportLog.AddMessage("scenario completed with status : " + scenario.result.status);
        // await BrowserWaits.waitForSeconds(600);
        const world = this;
        try{
            await CucumberReportLog.AddScreenshot(global.screenShotUtils);
            if (scenario.result.status === 'failed') {
                        // await BrowserWaits.waitForSeconds(600);

                CucumberReportLog.AddMessage("****************** User details ******************"); 
                CucumberReportLog.AddJson(JSON.parse(await browserUtil.getFromSessionStorage('userDetails')))
                CucumberReportLog.AddMessage("****************** User details ******************"); 

                await BrowserLogs.printAllBrowserLogs();
            } 
            
            await CucumberReportLog.AddMessage("Cleared browser logs after successful scenario.");
            if (global.scenarioData['featureToggles']) {
                //CucumberReportLog.AddJson(global.scenarioData['featureToggles'])
            }
           


        }catch(err) {
            CucumberReportLog.AddMessage("Error in hooks with browserlogs or screenshots. See error details : " + err);
        }     
        await clearSession();
       
    });

    async function clearSession(){
        await browser.executeScript('window.sessionStorage.clear();');
        await browser.executeScript('window.localStorage.clear();');
        await browser.manage().deleteAllCookies();
    }
});
