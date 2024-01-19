const baseUrl = 'http://localhost:3000/'; 

const conf = {
    headless: true,
    failTestOna11yIssues: false,
    reportPath: "functional-output/tests/a11y/",
    appName:"EXUI Manage Cases a11y Test Report",
    baseUrl: baseUrl,
    params:{
        username:'lukesuperuserxui_new@mailnesia.com',
        password:'Monday01'
    },
    unauthenticatedUrls: [
        'accessibility',
        'cookies',
        'privacy-policy',
        'get-help'
    ]


}

module.exports = {conf}

