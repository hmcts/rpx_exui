const moment = require('moment');
const browserUtil = require('../../util/browserUtil');
// const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../codeceptCommon/reportLogger');

const serviceMock = require('../../../backendMock/client/serviceMock')

const { DataTableArgument } = require('codeceptjs');

const hearingsMock = require('../../../backendMock/services/hearings/index')
const mockClient = require('../../../backendMock/client/serviceMock')

const listedHearing = require('../../../backendMock/services/hearings/mockData/listedHearing.data')
const awaitinghearingsDetails = require('../../../backendMock/services/hearings/mockData/awaitingHearingDetails.data')
const completedHearing = require('../../../backendMock/services/hearings/mockData/completedHearing.data')
const cancelledhearing = require('../../../backendMock/services/hearings/mockData/cancelledHearing.data')



    function updateObjectValues(object, key, value){
        const dateField = ['hearingRequestDateTime', 'lastResponseReceivedDateTime', 'hearingDaySchedule.hearingStartDateTime', 'hearingDaySchedule.hearingEndDateTime']
    
        if (dateField.includes(key)){
            const byDays = parseInt(value)
            object[key] = moment().add(byDays, 'days').format('YYYY-MM-DDTHH:mm:ss.sssss')
        }else{
            object[key] = value;
        }
    }

    Given('I set mock case hearings', async function (hearingsDatatable) {

        const rows = hearingsDatatable.parse().hashes();
        const hearingsList = []
        for(const hearing of rows){
            for(const key of Object.keys(hearing)){
                updateObjectValues(hearing, key, hearing[key])
            }
            hearingsList.push(hearingsMock.getHearingWithProps(hearing))
            
        }
        const res = {
            "caseRef": "1690807693531270",
            "caseHearings": hearingsList,
            "hmctsServiceCode": null
        }
        mockClient.setCaseHearings(res, 200)

    });

    Given('I set mock get hearing with with status {string}', async function (hearingStatus) {

        let hearingResponse = null;
        switch (hearingStatus){
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
            default:
                throw new Error(`no mock data setup for hearing ${hearingStatus}`)
        }

        
        mockClient.setOnGetHearing(hearingResponse, 200)

    });
