

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')


router.post('/message', (req, res) => {
    
    res.status(204).send({})
   
});

module.exports = router;
