

const express = require('express')
const path = require('path')
const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')

const documentsMock = require('../caseFileView/index')

router.get('/:documentId/binary', (req, res) => {
    // console.log(req.params)
    const docName = documentsMock.getDocNameWithId(req.params.documentId)
    const cwd = path.resolve(__dirname, )
    res.download(`${__dirname}/${documentsMock.getDocNameWithId(req.params.documentId)}`)
});


module.exports = router;
