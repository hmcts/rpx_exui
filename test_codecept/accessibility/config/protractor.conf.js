const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const minimist = require('minimist');

var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;

const report = require('./reporter');

chai.use(chaiAsPromised);

const argv = minimist(process.argv.slice(2));

const jenkinsConfig = [

    {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        nogui: true,
        chromeOptions: { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disableChecks'] }
    }
];

const localConfig = [
    {

        browserName: 'chrome',
        acceptInsecureCerts: true,
        chromeOptions: { args: ['--headless1', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote '] },
        proxy: {
            proxyType: 'manual',
            httpProxy: 'proxyout.reform.hmcts.net:8080',
            sslProxy: 'proxyout.reform.hmcts.net:8080',
            noProxy: 'localhost:3000'
        }
    }
];

const cap = (argv.local) ? localConfig : jenkinsConfig;

const config = {
    SELENIUM_PROMISE_MANAGER: false,
    framework: 'jasmine',
    specs: ['../tests/*.protractor.js'],
    baseUrl: process.env.TEST_URL || 'https://manage-case.aat.platform.hmcts.net/',
    params: {
        serverUrls: process.env.TEST_URL || 'https://manage-case.aat.platform.hmcts.net/',
        targetEnv: argv.env || 'local',
        username: 'lukesuperuserxui_new@mailnesia.com',
        password: 'Monday01',
        caseworkerUser: 'mahesh_fr_courtadmn@mailinator.com',
        caseworkerPassword: 'London01',
        fr_judge_username: process.env.FR_EMAIL,
        fr_judge_password: process.env.FR_PASSWORD,
        sscs_username: process.env.SSCS_EMAIL,
        sscs_password: process.env.SSCS_PASSWORD

    },
    directConnect: true,
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    getPageTimeout: 120000,
    allScriptsTimeout: 500000,
    multiCapabilities: cap,

    onPrepare() {
        browser.waitForAngularEnabled(false);
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should;

        global.screenShotUtils = new screenShotUtils({
            browserInstance: browser
        });
    },

    onComplete(){
        report();
    }
};


exports.config = config;
