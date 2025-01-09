

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')
const hearingTypeCategories = require('./hearingType_Categories')


router.get('/lov/categories/:category', (req, res) => {
    res.send({ list_of_values: service.categoryTypes[req.params.category].value})
    // if (req.params.category === 'HearingType'){
    //     res.send(hearingTypeCategories)
    // } else if (req.params.category === 'CaseLinkingReasonCode'){
    //     res.send({ list_of_values  : []})
    // } else if (req.params.category === 'HearingChannel') {
    //     res.send(hearingTypeCategories)
    // } else if (req.params.category === 'PanelMemberType') {
    //     res.send({ list_of_values: [] })

    // } else if (req.params.category === 'HearingPriority') {
    //     res.send({ list_of_values: [] })

    // } else if (req.params.category === 'HearingSubChannel') {
    //     res.send({ list_of_values: [] })
});

router.get('/lov/categories/:categoryid', (req, res) => {
    res.send({ list_of_values: service.categoryTypes[req.params.categoryid].value })

    // const rand = Math.random() * (10000 - 2000) + 2000
    // setTimeout(() => {
    //     console.log(`lovref data request for ${req.params.categoryid}`)
    //     res.send({ list_of_values: service.categoryTypes[req.params.categoryid].value })
    // }, 1000)
});

router.get('/caseflags/:service-id=ABA5', (req,res) => {

    res.send(service.caseFlags)
})



module.exports =  router;

