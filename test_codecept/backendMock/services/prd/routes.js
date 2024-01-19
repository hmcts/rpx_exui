

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')
const hearingTypeCategories = require('./hearingType_Categories')


router.get('/lov/categories/:category', (req, res) => {
    res.send({ list_of_values: service.categoryTypes[req.params.category].value})
});

router.get('/caseflags/:service-id=ABA5', (req,res) => {
  
    res.send(service.caseFlags)
})



module.exports =  router;

