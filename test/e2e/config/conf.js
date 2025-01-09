const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const minimist = require('minimist');

const dotenv = require('dotenv');
var screenShotUtils = require('protractor-screenshot-utils').ProtractorScreenShotUtils;

dotenv.config({ path: __dirname +'/../../.local-test.env' });

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
    probate_username: process.env.PROBATE_EMAIL || 'probaterequesteraat@mailnesia.com',
    probate_password: process.env.PROBATE_PASSWORD || 'LevelAt12',
    fr_judge_username: process.env.FR_EMAIL,
    fr_judge_password: process.env.FR_PASSWORD,
    sscs_username: process.env.SSCS_EMAIL,
    sscs_password: process.env.SSCS_PASSWORD,

    caseworker_iac_off_username: process.env.CASEWORKER_IAC_OFF_USERNAME ? process.env.CASEWORKER_IAC_OFF_USERNAME :'xui_auto_co_r1@justice.gov.uk',
    caseworker_iac_off_password: process.env.CASEWORKER_IAC_OFF_PASSWORD ? process.env.CASEWORKER_IAC_OFF_PASSWORD :'Welcome01',
    hrsTesterUser: 'xui.hrs.tester@hmcts.net',
    hrsTesterPassword: 'Monday01',
    ia_users_credentials: {
      case_officer: {
        username: process.env.TEST_CASEOFFICER_USERNAME || 'ia.caseofficer.ccd@gmail.com',
        password: process.env.TEST_CASEOFFICER_PASSWORD|| 'AldgateT0wer'
      },
      legal_rep: {
        username: process.env.TEST_LAW_FIRM_A_USERNAME || 'ia.legalrep.b.ccd@gmail.com',
        password: process.env.TEST_LAW_FIRM_A_PASSWORD || 'AldgateT0wer'
      },
      admin_officer: {
        username: process.env.TEST_ADMINOFFICER_USERNAME || 'ia.adm1nofficer.ccd@gmail.com',
        password: process.env.TEST_ADMINOFFICER_PASSWORD || 'AldgateT0wer'
      },
      homeoffice_respondent: {
        username: process.env.TEST_HOMEOFFICE_GENERIC_USERNAME || 'ia.respondentoffice.ccd@gmail.com',
        password: process.env.TEST_HOMEOFFICE_GENERIC_PASSWORD || 'AldgateT0wer'
      },
      homeoffice_apc: {
        username: process.env.TEST_HOMEOFFICE_APC_USERNAME || 'ia.respondentapc.ccd@gmail.com',
        password: process.env.TEST_HOMEOFFICE_APC_PASSWORD || 'AldgateT0wer'
      },
      homeoffice_larts: {
        username: process.env.TEST_HOMEOFFICE_LART_USERNAME || 'ia.respondentlarts.ccd@gmail.com',
        password: process.env.TEST_HOMEOFFICE_LART_PASSWORD || 'AldgateT0wer'
      },
      homeoffice_pou: {
        username: process.env.TEST_HOMEOFFICE_POU_USERNAME || 'ia.respondentpou.ccd@gmail.com',
        password: process.env.TEST_HOMEOFFICE_POU_PASSWORD || 'AldgateT0wer'
      },
      judge: {
        username: process.env.TEST_JUDICIARY_USERNAME || 'ia.iacjudge.ccd@gmail.com',
        password: process.env.TEST_JUDICIARY_PASSWORD|| 'AldgateT0wer'
      }
    }
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
    format: ['node_modules/cucumber-pretty', 'json:reports/tests/json/results.json'],
    tags: ['@smoke or @test', 'not @ignore', 'not @Flaky'],
    require: [
      '../support/timeout.js',
      '../support/hooks.js',
      '../support/world.js',
      '../support/*.js',
      '../features/step_definitions/*.steps.js'
    ]
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Manage Cases Functional Tests',
        // openReportInBrowser: true,
        jsonDir: 'reports/tests/functional',
        reportPath: 'reports/tests/functional'
      }
    }
  ]

};

exports.config = config;
