const express = require('express')

const router = express.Router({ mergeParams: true });
const sessionService = require('./index')
const userApiData = require('../userApiData')

const roleAssignmentService = require('../roleAssignments/index')

router.get('/session/files', (req, res) => {
    res.send(sessionService.getSessionFiles())
});

router.get('/session/default', (req, res) => {
    res.send(sessionService.setDefaultSession(req.query.session))
});

router.get('/updateroles', async (req, res) => {

});


router.post('/session/user/roles', async (req, res) => {
    await sessionService.updateAuthSessionWithRoles(req.body.auth, req.body.roles)
    res.send({ status: 'success' })
})

router.post('/session/user/info', async (req, res) => {
    await sessionService.updateAuthSessionWithUserInfo(req.body.auth, req.body.userInfo)
    res.send({ status: 'success' })
});




router.post('/session/user/roleAssignments', async (req, res) => {
    const newRoleAssignmentsInSession = await sessionService.updateAuthSessionWithRoleAssignments(req.body.auth, req.body.roleAssignments)
    res.send(newRoleAssignmentsInSession)
})


router.post('/session/userApiData', async (req, res) => {
    await userApiData.setUserData(req.body.auth, req.body.apiMethod, req.body.apiResponse)
    res.send({ status: 'success' })
})


router.post('/session/getUserRolesAndRoleAssignments', async (req, res) => {
    const data = roleAssignmentService.getServiceUsersRolesAssignments(req.body.auth)
    res.send(data)
})

router.post('/session/user/sessionData', async (req, res) => {
    res.send(userApiData.getUserSessionData(req.body.auth))
})



router.post('/session/logMessage', async (req, res) => {
    console.log(req.body.message)
    res.send({})
})





module.exports = router;
