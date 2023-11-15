

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')


router.get('/:caseId', (req, res) => {
    userApiData.sendResponse(req, res, "OnCaseHearings", () => service.getCategoriesAndDocumentsForCase())
   
});


module.exports = router;
