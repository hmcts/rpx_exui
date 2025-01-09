
var CaseListPage = require('../pageObjects/CaseListPage');
const CucumberReportLogger = require('../../support/reportLogger');

var { Then, When, Given } = require('@cucumber/cucumber');
const BrowserWaits = require('../../support/customWaits');
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const browserUtil = require('../../../ngIntegration/util/browserUtil');

  Then('I validate launch darkly feature toggles response received', async function(){
    expect(global.scenarioData['featureToggles']).to.not.be.a('null');
    expect(global.scenarioData['featureToggles']).to.not.be.a('undefined');
  });

  Then('I validate launch darkly feature toggle values', async function(featureToggleValuesDataTable){
    const softAssert = new SoftAssert();
    const featureToggleHashes = featureToggleValuesDataTable.hashes();
    const ldfeatureToggles = global.scenarioData['featureToggles'];
    for (let i = 0; i < featureToggleHashes.length; i++){
      const toggleName = featureToggleHashes[i].name;

      softAssert.setScenario('Toggle with name exists');
      await softAssert.assert(() => expect(ldfeatureToggles.hasOwnProperty(toggleName), toggleName+' does not exist').to.be.true);

      let toggleValue = null;
      if (featureToggleHashes[i].valueType.includes('bool')){
        toggleValue = featureToggleHashes[i].value === 'true' || featureToggleHashes[i].value === 'on' ? true : false;
      } else if (featureToggleHashes[i].valueType.includes('string')) {
        toggleValue = featureToggleHashes[i].value;
      }else{
        throw new Error('Expected feature toggle value type nt recognized');
      }

      softAssert.setScenario('Toggle value match');
      await softAssert.assert(() => expect(ldfeatureToggles[toggleName].value, toggleName+' value not matching').to.equal(toggleValue));
    }

    softAssert.finally();
  });

  Then('I log LD feature toggle values', async function(datatable){
    const featureHashes = datatable.hashes();
    const allFeaturesinLD = global.scenarioData['featureToggles'];

    const expectedfeatureValues = {};
    for (const feature of featureHashes){
      expectedfeatureValues[feature.name] = allFeaturesinLD[feature.name] ? allFeaturesinLD[feature.name] : 'NOT FOUND';
    }

    CucumberReportLogger.AddJson(expectedfeatureValues);
  });

  Then('I Log to report launch darkly feature toggle values', async function (featureToggleValuesDataTable) {
    const featureToggleHashes = featureToggleValuesDataTable.hashes();
    for (let i = 0; i < featureToggleHashes.length; i++) {
      const toggleName = featureToggleHashes[i].name;
      browserUtil.onLDReceivedLogFeatureValue(toggleName);
    }
  });

