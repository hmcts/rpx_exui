

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

    const actorRoles = service.serviceUsersRoleAssignments.filter(role => role.actorId === req.params.actorId)
    res.send({ roleAssignmentResponse: actorRoles })
    // userApiData.sendResponse(req, res, "OnUserRoleAssignments1", () => { return roleAssignmentsDefault });


});

router.get('/roles', (req, res) => {
    res.send(service.getRoleAssignmentsRoles())
})


router.post('/query', (req, res) => {
    let roleAssignments = [];
    console.log(`Role assignments req: ${JSON.stringify(req.body, null, 2)}`)
    const reqProps = Object.keys(req.body);
    if (reqProps.includes('queryRequests')) {
        for (const queryReq of req.body.queryRequests) {
            const queryResponse = service.getRequestedRoleAssignments(queryReq);
            roleAssignments = [...roleAssignments, ...queryResponse]
        }
    } else {
        roleAssignments = service.getRequestedRoleAssignments(req.body);
    }

    res.send({ roleAssignmentResponse: roleAssignments })
    // userApiData.sendResponse(req, res, "OnRoleAssignmentsQuery", () => { return { roleAssignmentResponse: roleAssignments } });

})

router.delete('/:id', (req, res) => {
    res.status(204).send(req.body)
})


router.post('/', (req, res) => {
    service.serviceUsersRoleAssignments.push(req.body)

    const newRoles = service.pushNewRoleAssignmentRequests(req.body);

    res.status(201).send({
        roleAssignmentResponse: {
            requestedRoles: newRoles
        }
    })
})

module.exports = router;