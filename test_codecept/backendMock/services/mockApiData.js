const serviceHearingValuesMock = require('./hearings/serviceHearingValuesMock')
const hearingValuesMock = require('./hearings/index')
const ccdCaseResponseMock = require('./ccd/caseDetails_data')
class MockAPIData{


    setApiData(apiMethod, responseData){
        let status = "success"
        switch (apiMethod) {
            case "OnServiceHearingValues":
                serviceHearingValuesMock.serviceHearingValues = responseData
                break;

            case "OnGetHearing":
              hearingValuesMock.hearingResponse = responseData
              break;
            case "OnCaseDetails":
                ccdCaseResponseMock.defaultCase = responseData
                break;


            default:
                status = `${req.params.apiMethod} is not setup`
        }
        return status;
    }

}

module.exports = new MockAPIData()

