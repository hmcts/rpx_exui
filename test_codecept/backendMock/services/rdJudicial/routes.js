

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')



router.post('/users/search', (req, res) => {
    // throw new Error('judicial ref data  /refdata/judicial/users/search not implemented')
    // res.send(locations)
    userApiData.sendResponse(req, res, service.methods.OnFindperson, () => service.findPerson(req.body))

});
router.post('/users', (req, res) => {
    // throw new Error('judicial ref data  /refdata/judicial/users/search not implemented')
    // res.send(locations)
    const persons = service.persons.filter((person) => {
        const reqKeys = Object.keys(req.body)
        if (reqKeys.includes('sidam_ids')){
            return req.body.sidam_ids.includes(person.sidam_id)
        } else if (reqKeys.includes('personal_code')){
            return req.body.personal_code.includes(person.personal_code)
        }

    })
    userApiData.sendResponse(req, res, service.methods.OnFindperson, () => persons)

});


router.post('/users', (req, res) => {
    // throw new Error('judicial ref data  /refdata/judicial/users/search not implemented')
    // res.send(locations)
    const persons = service.persons.filter((person) => {
        const reqKeys = Object.keys(req.body)
        if (reqKeys.includes('sidam_ids')){
            return req.body.sidam_ids.includes(person.sidam_id)
        } else if (reqKeys.includes('personal_code')){
            return req.body.personal_code.includes(person.personal_code)
        }

    })
    userApiData.sendResponse(req, res, service.methods.OnFindperson, () => persons)

});

module.exports = router;
