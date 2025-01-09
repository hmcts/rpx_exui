

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')



router.get('/usersByServiceName', (req, res) => {
    res.send(service.getUsersByService(req.query.ccd_service_names))

});

module.exports = router;