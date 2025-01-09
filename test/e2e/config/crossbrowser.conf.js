const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
var screenShotUtils = require('protractor-screenshot-utils').ProtractorScreenShotUtils;

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  sauceSeleniumAddress: 'ondemand.eu-central-1.saucelabs.com:443/wd/hub',

  // sauceSeleniumAddress: 'https://vmuniganti:ed5cdbf5-4d8f-47e4-ab72-1757ee05e15f@eu-central-1.saucelabs.com:443/wd/hub',

  host: 'ondemand.eu-central-1.saucelabs.com',
  sauceRegion: 'eu',
  port: 80,
  sauceConnect: true,
  specs: ['../features/**/*.feature', '../features/app/loginLogout.feature'],

  baseUrl: 'https://manage-case.aat.platform.hmcts.net',

  params: {
    serverUrls: 'https://manage-case.aat.platform.hmcts.net',
    targetEnv: argv.env || 'local'
    //username: process.env.TEST_EMAIL,
    //password: process.env.TEST_PASSWORD,
  },

  // sauceProxy: 'http://proxyout.reform.hmcts.net:8080',  // Proxy for the REST API
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  SAUCE_REST_ENDPOINT: 'https://eu-central-1.saucelabs.com/rest/v1/',
  allScriptsTimeout: 111000,

  useAllAngular2AppRoots: true,
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10',
      name: 'chrome-win-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      sharedTestFiles: false,
      maxInstances: 1
    },

    // {
    //   browserName: 'firefox',
    //   version: 'latest',
    //   platform: 'Windows 10',
    //   name: 'firefox-win-tests',
    //   tunnelIdentifier: 'reformtunnel',
    //   extendedDebugging: true,
    //   sharedTestFiles: false,
    //   maxInstances: 1
    // },

    {
      browserName: 'MicrosoftEdge',
      platform: 'macOS 10.15',
      version: '90.0',
      name: 'chromium-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      sharedTestFiles: false,
      maxInstances: 1
    },

    {
      browserName: 'chrome',
      version: 'latest',
      platform: 'macOS 10.15',
      name: 'chrome-mac-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      sharedTestFiles: false,
      maxInstances: 1
    }
  ],

  exclude: [],

  cucumberOpts: {
    format: ['json:cb_reports/saucelab_results.json'],
    require: [
      '../features/step_definitions/loginLogout.steps.js',
      '../features/step_definitions/**/*.steps.js',
      '../support/timeout.js'
    ],
    tags: ['@crossbrowser']
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI MC CrossBrowser Tests',
        jsonDir: 'reports/tests/crossbrowser',
        reportPath: 'reports/tests/crossbrowser'

      }
    }
  ],

  onPrepare() {
    const caps = browser.getCapabilities();
    browser.manage()
      .window()
      .maximize();
    browser.waitForAngularEnabled(false);
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should;

    global.screenShotUtils = new screenShotUtils({
      browserInstance: browser
    });
  }
};

exports.config = config;
