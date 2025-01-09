

const express = require('express')

const router = express.Router({ mergeParams: true });
const ccdMockData = require('./index')

const userApiData = require('../userApiData')

const caseEventMockData = require('./caseEvent_data')



router.get('/data/internal/cases/:caseId', (req, res) => {
    const caseId = req.params['caseId'];

    userApiData.sendResponse(req, res, "OnCaseDetails", () => ccdMockData.caseDetailsResponse.defaultCase)
    // res.status(403).send({})
});

// router.get('/data/internal/cases/:caseid', (req,res) => {
//     res.send(ccdMockData.getCaseDetailsWithID(req.params.caseid));
// })

router.get('/aggregated/caseworkers/:uid/jurisdictions', (req, res) => {
    const responseData = JSON.parse(JSON.stringify(ccdMockData.getJurisdictions()))

    // responseData[0].description = 'Div '+Date.now()
    // res.set('Content-Type', 'application/json');
    // res.setEncoding('gzip');
    // console.log('jurisdictions response size: '+JSON.stringify(responseData).length)
    // res.set('Cache-control', 'public, max-age=0')
    if(req.query.access === 'read'){
        responseData.data[0].description = 'read request';
    }else{
        responseData.data[0].description = 'create request';

    }
    res.removeHeader('etag')
    setTimeout(() => {
        res.send(responseData.data);

    }, 2000)
})

router.get('/data/internal/case-types/:jurisdiction/work-basket-inputs', (req, res) => {
    res.send(ccdMockData.getWorkbasketInputs(req.params.jurisdiction));
})

router.get('/data/internal/case-types/:jurisdiction/search-inputs', (req, res) => {
    res.send(ccdMockData.getsearchCaseInputs(req.params.jurisdiction));
})

router.get('/data/internal/case-types/:jurisdiction/event-triggers/:caseType', (req, res) => {
    ccdMockData.caseEventData.setEventProps({
        show_summary:false
    })
    res.send(caseEventMockData.getCaseFlagsEventResponse())
})

router.get('/data/internal/cases/:caseid/event-triggers/:eventId', (req, res) => {
    res.send(caseEventMockData.getCaseFlagsEventResponse());
})

router.get('/activity/cases/:cases/activity', (req, res) => {
    res.send(ccdMockData.getCaseActivity(req.params.cases));
})
router.get('/data/caseworkers/:uid/jurisdictions/:jurisdiction/case-types/:casetype/cases/pagination_metadata', (req, res) => {
    res.send(ccdMockData.getWorkbasketCases());
})
router.get('/api/addresses', (req, res) => {
    const address = {
        "header": {
            "uri": "https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?postcode=SW1",
            "query": "postcode=SW1",
            "offset": 0,
            "totalresults": 254579,
            "format": "JSON",
            "dataset": "DPA",
            "lr": "EN,CY",
            "maxresults": 100,
            "epoch": "81",
            "output_srs": "EPSG:27700"
        },
        results: []
    }

    for (let i = 0; i < 10; i++) {
        address.results.push({
            "DPA": {
                "UPRN": "12101281" + i,
                "UDPRN": "2392690" + i,
                "ADDRESS": `${i}, ALTHORPE MEWS, LONDON, SW1 ${i}PD`,
                "BUILDING_NUMBER": i,
                "THOROUGHFARE_NAME": "ALTHORPE MEWS",
                "POST_TOWN": "LONDON",
                "POSTCODE": `SW11 ${i}PD`,
                "RPC": "2",
                "X_COORDINATE": 526874.0 + i,
                "Y_COORDINATE": 176714.0 + i,
                "STATUS": "APPROVED",
                "LOGICAL_STATUS_CODE": "1",
                "CLASSIFICATION_CODE": "RD08",
                "CLASSIFICATION_CODE_DESCRIPTION": "Sheltered Accommodation",
                "LOCAL_CUSTODIAN_CODE": 5960,
                "LOCAL_CUSTODIAN_CODE_DESCRIPTION": "WANDSWORTH",
                "POSTAL_ADDRESS_CODE": "D",
                "POSTAL_ADDRESS_CODE_DESCRIPTION": "A record which is linked to PAF",
                "BLPU_STATE_CODE": null,
                "BLPU_STATE_CODE_DESCRIPTION": "Unknown/Not applicable",
                "TOPOGRAPHY_LAYER_TOID": "osgb1000042165547",
                "LAST_UPDATE_DATE": "13/02/2019",
                "ENTRY_DATE": "19/03/2002",
                "LANGUAGE": "EN",
                "MATCH": 1.0,
                "MATCH_DESCRIPTION": "EXACT"
            }
        });
    }
    res.send(address);
})


router.post('/api/inviteUser',(req,res) => {
    res.send({ "userIdentifier": "97ecc487-cdeb-42a8-b794-84840a4testc", "idamStatus": null });
})


router.post('/data/case-types/:caseType/validate', (req, res) => {
    const responseBody = {
        data: req.body.data,
        "_links": { "self": { "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal" + req.path + "?pageId=" + req.query.pageId } }
    }
    res.send(responseBody)
})


router.post('/data/case-types/:caseType/cases', (req, res) => {
    const responseBody = {
        id: Date.now(),
        data: req.body.data,
        "_links": { "self": { "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal" + req.path + "?ignore-warning=false" } }
    }
    res.send(responseBody)
})


router.post('/data/cases/:caseid/events', (req, res) => {
    const responseBody = {
        id: Date.now(),
        data: req.body.data,
        "_links": { "self": { "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal" + req.path + "?ignore-warning=false" } }
    }
    res.send(responseBody);
})


router.post('/data/internal/searchCases', (req, res) => {
    const responseBody = ccdMockData.caseList;
    res.send(responseBody);
})

module.exports = router;
