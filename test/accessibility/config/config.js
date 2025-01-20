const baseUrl = 'http://localhost:4200/';

const conf = {
  headless: 'new',
  failTestOna11yIssues: false,
  reportPath: 'reports/tests/a11y/',
  appName: 'EXUI Manage Cases a11y Test Report',
  baseUrl: baseUrl,
  params: {
    username: 'lukesuperuserxui@mailnesia.com',
    password: 'Monday01'
  },
  unauthenticatedUrls: [
    'accessibility',
    'cookies',
    'privacy-policy',
    'get-help'
  ]

};

module.exports = { conf };

