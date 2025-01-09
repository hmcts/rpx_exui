const { expect, assert } = require('chai');
const config = require('./config');
const { setWorldConstructor } = require('cucumber');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(180 * 1000);

function processRecursive(part) {
  if (part in config.lookups) {
    if (config.lookups[part].indexOf('|') === -1) {
      return config.lookups[part];
    }
    return processSelector(config.lookups[part]);
  }
}

function processSelector(selector) {
  if (selector.search(/\s/ig) !== -1) {
    throw new Error('selector cannot contain spaces');
  }
  return selector.split('|')
    .map((level) => level.split('.')
      .map((part) => processRecursive(part) || `[data-selector~="${part}"]`)
      .join(''))
    .join(' ');
}

const seconds = (n) => n * 1000;

class World {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.assert = assert;
    this.expect = expect;
    this.client = browser;
    this.EXPECTATION_TIMEOUT = seconds(120);

    this.config = config;
    this.config.serverUrls = global.browser.params.serverUrls;
    this.config.targetEnv = global.browser.params.targetEnv;
    this.config.username = global.browser.params.username;
    this.config.password = global.browser.params.password;
    this.config.caseworkerUser = global.browser.params.caseworkerUser;
    this.config.caseworkerPassword = global.browser.params.caseworkerPassword;
    this.config.fr_judge_username = global.browser.params.fr_judge_username;
    this.config.fr_judge_password = global.browser.params.fr_judge_password;
    this.config.sscs_username = global.browser.params.sscs_username;
    this.config.sscs_password = global.browser.params.sscs_password;
  }

  getSelector(field) {
    return processSelector(field);
  }
}

setWorldConstructor(World);
