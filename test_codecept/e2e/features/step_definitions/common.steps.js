
const jsonpath = require('jsonpath');
const reportLogger = require('../../../codeceptCommon/reportLogger');

Then('I see button with label {string}', async function (label) {
    const ele = element(by.xpath(`//button[contains(text(),'${label}')]`))
    expect(await ele.isDisplayed(), `Button with label ${label} not displayed`).to.be.true;
})

When('I click button with label {string}', async function(label){
    const ele = element(by.xpath(`//button[contains(text(),'${label}')]`))
    await ele.click();
})

Then('I validate request body json {string}, jsonpaths', function(objRef, jsonpathDatatable){
    const jsonPathsValidationData = jsonpathDatatable.parse().hashes()
    const jsonData = global.scenarioData[objRef];
    reportLogger.AddJson(jsonData)
    for (const row of jsonPathsValidationData){
        const jsonpathExpression = row.jsonpath;
        const expectedValue = row.value.includes('true') || row.value.includes('false') ? row.value.includes('true') : row.value

        const actualVal = jsonpath.query(jsonData.body, jsonpathExpression)
        expect(actualVal, `at ${jsonpathExpression}, actual "${actualVal}" not matching expected "${expectedValue}"`).includes(expectedValue)
    }

     
})
