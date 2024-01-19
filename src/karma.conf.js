/* eslint-disable */
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    defaultTimeoutInterval: 60000,
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 60000,
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-sonarqube-unit-reporter')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
        verboseDeprecations: true,
      }
    },
    reporters: ['spec', 'progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: require('path').join(__dirname, '../reports/tests/coverage/ng'),
      subdir: '.'
    },
    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressErrorSummary: false,// do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: true, // do not print information about skipped tests
      showSpecTiming: false, // print the time elapsed for each spec
      failFast: false // test would finish with error when a first fail occurs.
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};
