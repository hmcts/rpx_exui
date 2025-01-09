const reporter = require('allure-js-commons');
const fs = require('fs');
const mkdirp = require('mkdirp');

const xmlReports = `${process.cwd()}/reports/xml`;

reporter.options = { targetDir: xmlReports };

module.exports = reporter;
