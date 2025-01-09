
const express = require('express')
const minimist = require('minimist');

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')


router.get('/actors/:actorId', (req, res) => {
    // res.send(service.getActorRoles(req.params.actorId))
    // userApiData.sendResponse(req, res, "OnUserRoleAssignments", () => service.getActorRoles(req.params.actorId));

    // let roleAssignmentsDefault = service.getActorRoles(req.params.actorId);
    // const args = minimist(process.argv)
    // if (!args.standalone) {
    //     roleAssignmentsDefault = { roleAssignmentResponse :[]}
    // }
    const actorRoles = service.getServiceUsersRolesAssignments(req.headers.authorization.replace('Bearer ', ''))
    res.send({ roleAssignmentResponse: actorRoles })
    // userApiData.sendResponse(req, res, "OnUserRoleAssignments1", () => { return roleAssignmentsDefault });


});

router.get('/roles', (req, res) => {
    res.send(service.getRoleAssignmentsRoles())
})


router.post('/query', (req, res) => {
    let auth = req.headers.authorization ? req.headers.authorization : req.headers.serviceauthorization
    auth = auth.replace('Bearer', '').trim()
    let roleAssignments = [];
    // console.log(`Role assignments req: ${JSON.stringify(req.body, null, 2)}`)
    const reqProps = Object.keys(req.body);
    if (reqProps.includes('queryRequests')) {
        for (const queryReq of req.body.queryRequests) {
            
            const queryResponse = service.getRequestedRoleAssignments(auth,queryReq);
            roleAssignments = [...roleAssignments, ...queryResponse]
        }
    } else {
        roleAssignments = service.getRequestedRoleAssignments(auth,req.body);
    }

    res.send({ roleAssignmentResponse: roleAssignments })
    // userApiData.sendResponse(req, res, "OnRoleAssignmentsQuery", () => { return { roleAssignmentResponse: roleAssignments } });

})

router.delete('/:id', (req, res) => {
    res.status(204).send(req.body)
})


router.post('/', (req, res) => {
    const auth = req.headers.authorization.replace('Bearer', '').trim()
    service.serviceUsersRoleAssignments.push(req.body)

    const newRoles = service.pushNewRoleAssignmentRequests(auth,req.body);

    res.status(201).send({
        roleAssignmentResponse: {
            requestedRoles: newRoles
        }
    })
})

module.exports = router;