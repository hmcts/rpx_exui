/* eslint-disable no-undef */
const moment = require('moment');
const browserUtil = require('../../util/browserUtil');
// const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../codeceptCommon/reportLogger');

const serviceMock = require('../../../backendMock/client/serviceMock');

const { DataTableArgument } = require('codeceptjs');
const reportLogger = require('../../../codeceptCommon/reportLogger');
const jsonpath = require('jsonpath');
const hearingsMock = require('../../../backendMock/services/hearings/index');
const mockClient = require('../../../backendMock/client/serviceMock');

const listedHearing = require('../../../backendMock/services/hearings/mockData/listedHearing.data');
const awaitinghearingsDetails = require('../../../backendMock/services/hearings/mockData/awaitingHearingDetails.data');
const completedHearing = require('../../../backendMock/services/hearings/mockData/completedHearing.data');
const cancelledhearing = require('../../../backendMock/services/hearings/mockData/cancelledHearing.data');

const updateRequestedHearing = require('../../../backendMock/services/hearings/mockData/updateRequestedhearing.data');


const mockServiceHearingValues = require('../../../backendMock/services/hearings/serviceHearingValuesMock');

const jsonUtil = require('../.././../e2e/utils/jsonUtil')
const path = require('path')

function getHearingsMockJsonFromFile(fileName){
  return jsonUtil.getJsonFromFile(path.resolve(__dirname,`../features/hearings/mockData/${fileName}.json`,))
}


function updateObjectValues(object, key, value){
  const dateField = ['hearingRequestDateTime', 'lastResponseReceivedDateTime', 'hearingDaySchedule.hearingStartDateTime', 'hearingDaySchedule.hearingEndDateTime'];

  if (dateField.includes(key)){
    const byDays = parseInt(value);
    object[key] = moment().add(byDays, 'days').format('YYYY-MM-DDTHH:mm:ss.sssss');
  }else{
    object[key] = value;
  }
}


Given('I set mock case hearings from file {string}', async function (filename) {
  const response = getHearingsMockJsonFromFile(filename)
  mockClient.setCaseHearings(response, 200);

});

Given('I set mock hearing HMC response from file {string}', async function (fileName) {
  const response = getHearingsMockJsonFromFile(fileName)
  await mockClient.setOnGetHearing(response, 200);
});

Given('I set mock hearing SHV response from file {string}', async function (fileName) {
  const response = getHearingsMockJsonFromFile(fileName)
  await mockClient.setHearingServiceHearingValues(response, 200);
});



Given('I set mock case hearings', async function (hearingsDatatable) {

  const rows = hearingsDatatable.parse().hashes();
  const hearingsList = [];
  for(const hearing of rows){
    for(const key of Object.keys(hearing)){
      updateObjectValues(hearing, key, hearing[key]);
    }
    hearingsList.push(hearingsMock.getHearingWithProps(hearing));

  }
  const res = {
    "caseRef": "1690807693531270",
    "caseHearings": hearingsList,
    "hmctsServiceCode": null
  };
  reportLogger.AddJson(res)
  mockClient.setCaseHearings(res, 200);

});

function getMockHearingWithStatus(hearingStatus){
  let hearingResponse = null;
  switch (hearingStatus) {
    case "LISTED":
      hearingResponse = listedHearing;
      break;
    case "COMPLETED":
      hearingResponse = completedHearing;
      break;
    case "CANCELLED":
      hearingResponse = cancelledhearing;
      break;
    case "AWAITING_ACTUALS":
      hearingResponse = awaitinghearingsDetails;
      break;
    case "AWAITING_LISTING":
      hearingResponse = awaitinghearingsDetails;
      break;
    case "UPDATE_REQUESTED":
      hearingResponse = updateRequestedHearing;
      break;

    default:
      throw new Error(`no mock data setup for hearing ${hearingStatus}`);
  }
  return JSON.parse(JSON.stringify(hearingResponse));
}

Given('I set mock get hearing with with status {string}', async function (hearingStatus) {
  let hearingResponse = getMockHearingWithStatus(hearingStatus);
  global.scenarioData[hearingStatus] = hearingResponse;

  mockClient.setOnGetHearing(hearingResponse, 200);
});



Given('I set mock get hearing with with status {string} and values at jsonpath', async function (hearingStatus, valuesDatatable) {
  let hearingResponse = global.scenarioData[hearingStatus]
  if (hearingResponse === null || hearingResponse === undefined) {
    hearingResponse = getMockHearingWithStatus(hearingStatus);
    global.scenarioData[hearingStatus] = hearingResponse;
  }

  const dataTableObjects = valuesDatatable.parse().hashes();

  jsonUtil.updateJsonWithJsonPath(dataTableObjects, hearingResponse)
  reportLogger.AddJson(hearingResponse)
  mockClient.setOnGetHearing(hearingResponse, 200);
});


Given('I set mock hearings service hearing values with ref {string}', async function (ref) {
  const serviceHearingValue = mockServiceHearingValues.getServiceHearingValuesTemplate();
  global.scenarioData[ref] = serviceHearingValue;
  mockClient.setHearingServiceHearingValues(serviceHearingValue, 200);
});

Given('I set mock hearing data for state {string}', async function (hearingState) {
  global.scenarioData[hearingState] = getMockHearingWithStatus(hearingState)
  mockClient.setOnGetHearing(global.scenarioData[hearingState], 200);
});

Given('I set parties in mock hearing data for state {string}', async function (hearingState, partiesDatatable) {
  // global.scenarioData[hearingState] = JSON.parse(JSON.stringify(hearingDataForStates[hearingState]));

  const parties = partiesDatatable.parse().hashes();
  const mockParties = mockServiceHearingValues.getMockParties(parties);

  const hearingData = global.scenarioData[hearingState];
  hearingData.partyDetails = mockParties;
  reportLogger.AddJson(hearingData)

  mockClient.setOnGetHearing(hearingData, 200);
});



Given('I update mock hearings service hearing values with ref {string} for field {string}', async function (ref, field, datatable) {

  const serviceHearingValue = global.scenarioData[ref];

  const dataTableObjects = datatable.parse().hashes();
  let updatedShv = null;
  if (field === 'caseFlags'){
    updatedShv = mockServiceHearingValues.setCaseFlags(dataTableObjects, serviceHearingValue);
  } else if (field === 'parties'){
    updatedShv = mockServiceHearingValues.setParties(dataTableObjects, serviceHearingValue);
  }
  reportLogger.AddMessage(JSON.stringify(updatedShv,null,2))
  mockClient.setHearingServiceHearingValues(updatedShv, 200);
});



Given('I update mock hearings service hearing values with ref {string} at jsonpaths', async function (ref, datatable) {

  const serviceHearingValue = global.scenarioData[ref];

  const dataTableObjects = datatable.parse().hashes();

  jsonUtil.updateJsonWithJsonPath(dataTableObjects, serviceHearingValue)
  reportLogger.AddJson(serviceHearingValue);
  mockClient.setHearingServiceHearingValues(serviceHearingValue, 200);
});



