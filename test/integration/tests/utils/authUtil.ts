import * as puppeteer from 'puppeteer';
import { config } from '../config/config';
import { reporterMsg } from './helper';
const authCookiesForUsers = {};

export async function getSessionCookieString(username, password) {
  if (!authCookiesForUsers.hasOwnProperty(username)) {
    authCookiesForUsers[username] = await authenticateAndGetcookies(username, password);
  }
  let cookieString = '';
  for (const cookie of authCookiesForUsers[username]) {
    // console.log(`${cookie.name} : ${cookie.value}`);
    cookieString = `${cookieString}${cookie.name}=${cookie.value};`;
  }
  return cookieString;
}

export function updateSessionCookieString(username, name, value) {
  let isNewCookie = true;
  if (!authCookiesForUsers[username]) {
    return;
  }
  for (const cookie of authCookiesForUsers[username]) {
    // console.log(`${cookie.name} : ${cookie.value}`);
    if (cookie.name === name) {
      cookie.value=value;
      isNewCookie = false;
    }
  }

  let cookieString = '';
  for (const cookie of authCookiesForUsers[username]) {
    cookieString = `${cookieString}${cookie.name}=${cookie.value};`;
  }
  return cookieString;
}

export async function getXSRFToken(username, password) {
  if (!authCookiesForUsers.hasOwnProperty(username)) {
    authCookiesForUsers[username] = await authenticateAndGetcookies(username, password);
  }
  let xsrfToken = '';
  for (const cookie of authCookiesForUsers[username]) {
    // console.log(cookie.name);
    if (cookie.name === 'XSRF-TOKEN') {
      xsrfToken = cookie.value;
      break;
    }
  }
  return xsrfToken;
}

export async function getAuthorisation(username, password) {
  if (!authCookiesForUsers.hasOwnProperty(username)) {
    authCookiesForUsers[username] = await authenticateAndGetcookies(username, password);
  }
  let authToken = '';
  for (const cookie of authCookiesForUsers[username]) {
    // console.log(cookie.name);
    if (cookie.name === '__auth__') {
      authToken = cookie.value;
      break;
    }
  }
  return authToken;
}

export async function getUserId(username, password) {
  if (!authCookiesForUsers.hasOwnProperty(username)) {
    authCookiesForUsers[username] = await authenticateAndGetcookies(username, password);
  }
  let userid = '';
  for (const cookie of authCookiesForUsers[username]) {
    // console.log(cookie.name);
    if (cookie.name === '__userid__') {
      userid = cookie.value;
      break;
    }
  }
  return userid;
}

async function authenticateAndGetcookies(username, password) {
  let browser = null;
  let page =null;

  try{
    browser = await puppeteer.launch(getPuppeteerLaunchOptions());
    page = await browser.newPage();
    await page.goto(config.baseUrl);

    let isLoginSuccess = false;
    let loginAttemptsCounter = 0;
    while (loginAttemptsCounter < 5 && !isLoginSuccess) {
      try {
        await page.waitForSelector('#username', { visible: true });

        await page.type('#username', username);
        await page.type('#password', password);

        await page.click('.button');

        const primaryNavElement = page.$('.hmcts-primary-navigation');
        const loginEmailField = page.$('#username');

        let waitCounter = 0;
        while (waitCounter < 20) {
          await setTimeout(() => {
            console.log(waitCounter + '  : timeout sleep ' + new Date().toTimeString());
          }, 1000);
          waitCounter++;
          if (primaryNavElement != undefined) {
            break;
          } else if (loginEmailField != undefined) {
            const usernameInput = await page.$eval('#username', (element) => element.value);
            if (usernameInput === '') {
              throw new Error('Login page reloaded. ');
            }
          }
        }
        await page.waitForSelector('.hmcts-primary-navigation', { visible: true, timeout: 20000 });

        // await page.waitForSelector('.hmcts-primary-navigation', { visible: true, timeout: 10000 });

        isLoginSuccess = true;
      } catch (error) {
        console.log('Pupeeteer browser login to app error occured : ' + error);

        let usernameInput = '';
        try {
          usernameInput = await page.$eval('#username', (element) => element.value);
        } catch (err) {}

        if (usernameInput === '') {
          loginAttemptsCounter++;
          console.log('Login error : ' + error.message);
        } else {
          await page.close();
          await browser.close();
          throw error;
        };
      }
    }
  }catch(err) {
    console.log('Pupeeteer browser login to app error occured : ' + err);

    await page.close();
    await browser.close();
    throw new Error(err);
  }
  const cookies = await page.cookies();
  await page.close();
  await browser.close();
  return cookies;
}

function getPuppeteerLaunchOptions() {
  const puppeteerOption = { ignoreHTTPSErrors: true, headless: true, args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] };
  // if (!config.baseUrl.includes('manage-case.')) {
  //     puppeteerOption.args.push('--proxy-server=http://proxyout.reform.hmcts.net:8080');
  // }

  return puppeteerOption;
}
