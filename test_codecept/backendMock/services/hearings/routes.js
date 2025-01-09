

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')

const listedHearing = require('./mockData/listedHearing.data')
const awaitinghearingsDetails = require('./mockData/awaitingHearingDetails.data')
const completedHearing = require('./mockData/completedHearing.data')

const serviceHearingValuesMock = require('./serviceHearingValuesMock')

const hearingActualsData = require('./mockData/hearingActuals')

router.get('/hearings/:caseId', (req, res) => {

    userApiData.sendResponse(req, res, "OnCaseHearings", () => service.getCaseHearings(req.params.caseId))


});

router.get('/hearing/:hearingId', (req, res) => {
    // userApiData.sendResponse(req, res, "OnGetHearing", () => service.gethearingTemplate({}))
    userApiData.sendResponse(req, res, "OnGetHearing", () => service.hearingResponse)


});

router.post('/serviceHearingValues', (req,res) => {
    userApiData.sendResponse(req, res, "OnServiceHearingValues", () => serviceHearingValuesMock.serviceHearingValues)
    // res.send(loadServicehearingValues)
})

router.post('/serviceLinkedCases', (req, res) => {
    res.send(service.getLinkedCasesWithCaseRef(req.body.caseReference))
})

router.post('/hearing', (req,res) => {
    userApiData.captureRequestDetails("OnPostHearing", req)
    res.send({
        "hearingRequestID": 2000006340,
        "status": "HEARING_REQUESTED",
        "timeStamp": "2023-08-07T09:30:52.213698",
        "versionNumber": 1
    })
})

router.put('/hearing/:hearingId', (req, res) => {
    userApiData.captureRequestDetails("OnPutHearing", req)
    res.send({
        "hearingRequestID": 2000006340,
        "status": "HEARING_REQUESTED",
        "timeStamp": "2023-08-07T09:30:52.213698",
        "versionNumber": 1
    })
})


router.get('/hearingActuals/:hearingId', (req, res) => {
    res.send(hearingActualsData)
})

router.put('/hearingActuals/:hearingId', (req, res) => {
    res.send({})
})


router.post('/hearingActualsCompletion/:hearingId', (req, res) => {
    res.send({})
})



router.put('/hearingActuals/:hearingId', (req, res) => {
    res.send({})
})


router.post('/hearingActualsCompletion/:hearingId', (req, res) => {
    res.send({})
})

router.post('/linkedHearingGroup', (req,res) => {
    res.send({})
})


module.exports =  router;




