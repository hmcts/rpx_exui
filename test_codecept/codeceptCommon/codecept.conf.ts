
const { setDefaultResultOrder } = require('dns')

const report = require("multiple-cucumber-html-reporter");
const { merge } = require('mochawesome-merge')
const marge = require('mochawesome-report-generator')
const fs = require('fs')
const path = require('path')

const global = require('./globals')
import applicationServer from '../localServer'

var spawn = require('child_process').spawn;
const backendMockApp = require('../backendMock/app');
const statsReporter = require('./statsReporter')

setDefaultResultOrder('ipv4first')

let executionResult = 'passed';

let appWithMockBackend = null;
const testType = process.env.TEST_TYPE

const debugMode = process.env.DEBUG && process.env.DEBUG.includes('true')

const parallel = process.env.PARALLEL ? process.env.PARALLEL === "true" : false
const head = process.env.HEAD
console.log(`testType : ${testType}`)
console.log(`parallel : ${parallel}`)
console.log(`headless : ${!head}`)

let pipelineBranch = process.env.TEST_URL.includes('pr-') || process.env.TEST_URL.includes('manage-case.aat.platform.hmcts.net') ? "preview" : "master"
let local = process.env.LOCAL && process.env.LOCAL.includes('true')
let features = ''
if (testType === 'e2e' || testType === 'smoke'){
  features = `../e2e/features/app/**/*.feature`
} else if (testType === 'ngIntegration'){
  features = pipelineBranch === 'master' && !local ? `../ngIntegration/tests/features/**/notests.feature` : `../ngIntegration/tests/features/**/*.feature`
} else {
  throw new Error(`Unrecognized test type ${testType}`);
}

const functional_output_dir = path.resolve(`${__dirname}/../../functional-output/tests/codecept-${testType}`)
const cucumber_functional_output_dir = path.resolve(`${__dirname}/../../functional-output/tests/cucumber-codecept-${testType}`)

let bddTags = testType === 'ngIntegration' ? 'functional_enabled':'fullFunctional'

if (pipelineBranch === 'master' && testType === 'ngIntegration'){
  bddTags = 'AAT_only'
  process.env.LAUNCH_DARKLY_CLIENT_ID = '645baeea2787d812993d9d70'
}

const tags = process.env.DEBUG ? 'functional_debug' : bddTags
const grepTags = `(?=.*@${testType === 'smoke' ? 'smoke' : tags})^(?!.*@ignore)`
console.log(grepTags)

exports.config = {
  timeout: 600,
  "gherkin": {
    "features": features,
    "steps": "../**/*.steps.js"
  },
  grep: grepTags,
  output: functional_output_dir,

  helpers: {
    CustomHelper:{
      require:"./customHelper.js"
    },
    "Mochawesome": {
      "uniqueScreenshotNames": "true"
    },
    // Puppeteer: {
    //   url: 'https://manage-case.aat.platform.hmcts.net/',
    //   show: true,
    //   waitForNavigation: ['domcontentloaded'],
    //   restart: true,
    //   keepCookies: false,
    //   keepBrowserState: false,
    //   smartWait: 50000,
    //   waitForTimeout: 90000,
    //   chrome: {
    //     ignoreHTTPSErrors: true,
    //     defaultViewport: {
    //       width: 1280,
    //       height: 960
    //     },
    //     args: [
    //       `${head ? '' : '--headless'}`,
    //       '—disable-notifications',
    //       '--smartwait',
    //       '--disable-gpu',
    //       '--no-sandbox',
    //       '--allow-running-insecure-content',
    //       '--ignore-certificate-errors',
    //       '--window-size=1440,1400',
    //       '--viewport-size=1440,1400',

    //        '--disable-setuid-sandbox', '--no-zygote ', '--disableChecks'
    //     ]
    //   }

    // },
    Playwright: {
      url: "https://manage-case.aat.platform.hmcts.net",
      restart: true,
      show: head,
      waitForNavigation: "domcontentloaded",
      waitForAction: 10,
      browser: 'chromium',
      // disableScreenshots: false,
      fullPageScreenshots: true,
      uniqueScreenshotNames: true,
      video: false,
      screenshot: true,
      windowSize: "1600x900"
    }
    // WebDriver:{
    //   url: 'https://manage-case.aat.platform.hmcts.net/',
    //   browser: 'chrome',
    //   show: true,

    // }
  },
  "mocha": {
    // reporter: 'mochawesome',

    // "reporterOptions": {
    //   "reportDir": functional_output_dir,
    //   reportName:'XUI_MC',
    //   "overwrite": false,
    //   "html": false,
    //   "json": true,
    //   "codeceptjs-cli-reporter": {
    //     "stdout": "-",
    //     "options": {
    //       "verbose": false,
    //       "steps": true,
    //     }
    //   },
    //   "mocha-junit-reporter": {
    //     "stdout": `${functional_output_dir}/console.log`,
    //     "options": {
    //       "mochaFile": "./output/result.xml"
    //     }
    //   }
    //   // inlineAssets: true,

    // },

    //   "mochawesome": {
    //     "stdout": `${functional_output_dir}/`,
    //     "options": {
    //       "reportDir": `${functional_output_dir}/output`,
    //       "reportFilename": `${functional_output_dir}/output/report`,
    //       "overwrite": false,
    //       "html":false,
    //       "json":true
    //     }
    //   },
    //   "mocha-junit-reporter": {
    //     "stdout": "./output/console.log",
    //     "options": {
    //       "mochaFile": "./output/result.xml",
    //       "attachments": true //add screenshot for a failed test
    //     }
    //   }
    // }

  },
  plugins:{
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    },

    "myPlugin": {
      "require": "./hooks",
      "enabled": true
    },
    retryFailedStep: {
      enabled: true
    },
    pauseOnFail: {},

    cucumberJsonReporter: {
      require: 'codeceptjs-cucumber-json-reporter',
      enabled: true,               // if false, pass --plugins cucumberJsonReporter
      attachScreenshots: true,     // true by default
      attachComments: true,        // true by default
      outputFile: cucumber_functional_output_dir + '/cucumberOutput/',     // cucumber_output.json by default
      uniqueFileNames: true,      // if true outputFile is ignored in favor of unique file names in the format of `cucumber_output_<UUID>.json`.  Useful for parallel test execution
      includeExampleValues: false, // if true incorporate actual values from Examples table along with variable placeholder when writing steps to the report
      timeMultiplier: 1000000,     // Used when calculating duration of individual BDD steps.  Defaults to nanoseconds
    }

  },
  include: {
  },
  retry: {
    Feature: 3

  },
  bootstrap:async () =>{
    share({ users: [], reuseCounter: 0 });
    if(!parallel){
      await setup()
    }

  },
  teardown: async () => {
    if (!parallel) {
      await teardown()
      exitWithStatus()
    }


  },
  bootstrapAll: async () => {
    if (parallel) {
      await setup()
    }

  },
  teardownAll: async () => {
    if (parallel) {
      await teardown()
      exitWithStatus()
    }

  }
}


function exitWithStatus() {
  // const status = await mochawesomeGenerateReport()
  console.log(`*************** executionResult: ${executionResult}  *************** `)
  process.exit(executionResult === 'passed' ? 0 : 1)



}

async function setup(){

  if (!debugMode && (testType === 'ngIntegration' || testType === 'a11y')){
    await backendMockApp.startServer(debugMode);
    await applicationServer.start()
  }

}

async function teardown(){
  console.log('Tests execution completed')
  if (!debugMode && (testType === 'ngIntegration' || testType === 'a11y')) {
    await backendMockApp.stopServer();
    await applicationServer.stop()
  }
  statsReporter.run();
  await generateCucumberReport();


  // process.exit(1);
}


async function mochawesomeGenerateReport(){
  const report = await merge({
    files: [`${functional_output_dir}/*.json`]
  })
  await marge.create(report, {
    "reportDir": `${functional_output_dir}/`,
    "reportFilename": `${functional_output_dir}/report`,
  });

  console.log(`FAILED: ${report.stats.failures}, PASSED: ${report.stats.passes}, TOTAL: ${report.stats.tests}`)

  return report.stats.failures > 0 ? 'FAIL' : 'PASS';
}

async function generateCucumberReport(){
  console.log('Generating cucumber report')

  await new Promise((resolve,reject) => {
    setTimeout(() => {
        processCucumberJsonReports();
        resolve(true)
    }, 2000);
  });
   report.generate({
      jsonDir: functional_output_dir + '',
      reportPath: functional_output_dir + '',
      displayDuration:true,
      // durationInMS: true,
      metadata: {
        browser: {
          name: "chrome",
          version: "60",
        },
        device: "Local test machine",
        platform: {
          name: "ubuntu",
          version: "16.04",
        },
      }
    });
  console.log('completed cucumber report')


}

function processCucumberJsonReports() {
  const executionOutcomes = {}
  const files = fs.readdirSync(functional_output_dir);
  for (const f of files) {
    if (f.startsWith('cucumber_output') && f.endsWith('.json')) {
      console.log(`processing cucumber-json-report : ${f}`);
      const jsonString = fs.readFileSync(functional_output_dir + '/' + f, 'utf-8');
      const json = JSON.parse(jsonString);

      const ObjCount = json.length;
      for (let i = 0; i < ObjCount; i++) {
        const obj = json[i]
        for (const element of obj.elements) {
          for (const step of element.steps) {
            executionOutcomes[step.result.status] = step.result.status
            if (executionResult === 'passed'){
              executionResult = step.result.status;
            }
            for (const embedd of step.embeddings) {
              if (embedd.mime_type === 'text/plain' && !embedd.data.startsWith('=>')){
                embedd.data = new Buffer(embedd.data, 'base64').toString('ascii')
              }
            }
          }
        }
      }
      fs.writeFileSync(functional_output_dir + '/' + f, JSON.stringify(json, null, 2))
    }
  }
  console.log(executionOutcomes)


  return executionResult;
}
