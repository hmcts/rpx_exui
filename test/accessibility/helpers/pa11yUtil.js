const pa11y = require('pa11y');
const assert = require('assert');
const { conf } = require('../config/config');

const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
const MockApp = require('../../nodeMock/app');

const fs = require('fs');

let testBrowser = null;
let page = null;

async function initBrowser() {
  testBrowser = await puppeteer.launch({
    ignoreHTTPSErrors: false,
    headless: conf.headless,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  page = await testBrowser.newPage();
  await page.goto('http://localhost:4200/');
  await page.setCookie({ name: 'scenarioMockPort', value: '' + MockApp.serverPort });
  // await page.goto("http://localhost:4200/");
}

async function pa11ytest(test, actions, startUrl, roles) {
  let isTestSuccess = false;
  let retryCounter = 0;
  test.screenshots = [];
  while (!isTestSuccess && retryCounter < 3) {
    try {
      await pa11ytestRunner(test, actions, startUrl, roles);
      isTestSuccess = true;
    } catch (err) {
      retryCounter++;
      console.log('Error running pallt test ' + err);
      console.log('Retrying test again for ' + retryCounter);
    }
  }
  console.log(test.screenshots);
}

async function pa11ytestRunner(test, actions, startUrl, roles) {
  console.log('pally test with actions : ' + test.test.title);
  console.log(actions);

  let screenshotPath = process.env.PWD + '/' + conf.reportPath + 'assets/';
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }
  screenshotName = Date.now() + '.png';
  screenshotPath = screenshotPath + Date.now() + '.png';
  screenshotReportRef = 'assets/' + screenshotName;

  const startTime = Date.now();

  let token = jwt.sign({
    data: 'foobar'
  }, 'secret', { expiresIn: 60 * 60 });

  let result;

  // await setScenarioCookie(test);
  try {
    await initBrowser();
    result = await pa11y(startUrl, {
      browser: testBrowser,
      page: page,
      timeout: 60000,
      screenCapture: screenshotPath,
      log: {
        debug: console.log,
        error: console.error,
        info: console.info
      },
      actions: actions
    });
  } catch (err) {
    await page.screenshot({ path: screenshotPath });
    const elapsedTime = Date.now() - startTime;
    result = {
      documentTitle: 'test name ' + test.test.title,
      pageUrl: '',
      issues: [{
        code: 'test execution error',
        message: ''+err.message,
        selector: ''
      }]
    };

    result.executionTime = elapsedTime;
    test.screenshots.push(screenshotReportRef);
    result.screenshot = screenshotReportRef;
    test.a11yResult = result;
    console.log('Test Execution time : ' + elapsedTime);
    console.log(err);
    await page.close();
    await testBrowser.close();
    throw err;
  }

  await page.close();
  await testBrowser.close();
  const elapsedTime = Date.now() - startTime;
  result.executionTime = elapsedTime;

  test.screenshots.push(screenshotReportRef);
  result.screenshot = screenshotReportRef;
  test.a11yResult = result;
  console.log('Test Execution time : ' + elapsedTime);
  if (conf.failTestOna11yIssues) {
    assert(result.issues.length === 0, 'a11y issues reported');
  }
  return result;
}

module.exports = { pa11ytest, initBrowser };
