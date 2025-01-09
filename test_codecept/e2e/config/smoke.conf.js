const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const minimist = require('minimist');

var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;


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
    chromeOptions: { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote '] },
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
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: ['../features/**/*.feature'],
  baseUrl: process.env.TEST_URL || 'http://localhost:3000/',
  params: {
    serverUrls: process.env.TEST_URL || 'http://localhost:3000/',
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

  cucumberOpts: {
    strict: true,
    // format: ['node_modules/cucumber-pretty'],
    format: ['node_modules/cucumber-pretty', 'json:functional-output/tests/json/results.json'],
    tags: ['@smoke'],
    require: [
      '../support/timeout.js',
      '../support/hooks.js',
      '../support/world.js',
      // '../support/*.js',
      '../features/step_definitions/*.steps.js',
      '../features/step_definitions/**/*.steps.js'
    ]
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Manage Cases Smoke Tests',
        // openReportInBrowser: true,
        jsonDir: 'reports/tests/smoke',
        reportPath: 'reports/tests/smoke'
      }
    }
  ]


};


exports.config = config;
