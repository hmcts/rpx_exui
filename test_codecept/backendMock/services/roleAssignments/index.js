

const roles = require('./roles')
const { v4 } = require('uuid')
class RoleAssignments {

    constructor() {
        this.serviceUsersRoleAssignments = []

       this.sessiononRolesAssignments = [];

    }

    addRoleAssigmemntsToSession(auth, roleAssignments){
        const sessionObj = this.sessiononRolesAssignments.find((forSession) => forSession.auth === auth)
        if (!sessionObj){
            this.sessiononRolesAssignments.push({
                auth: auth,
                roleAssignments: roleAssignments
            })
        }else{
            sessionObj.roleAssignments.push(...roleAssignments)
        }
    }

    getRolesAssignmentsForSession(auth){
        const sessionObj = this.sessiononRolesAssignments.find((forSession) => forSession.auth === auth)
        return sessionObj ? sessionObj.roleAssignments : [];
    }



    getActorRoles(actorID) {
        const roles = []
        const role = this.getRoleAssignmentTemplate();
        role.actorId = actorID;

        const caseAllocator = this.getRoleAssignmentTemplate();
        caseAllocator.actorId = actorID;
        caseAllocator.roleName = 'case-allocator'

        const taskSupervisor = this.getRoleAssignmentTemplate();
        taskSupervisor.actorId = actorID;
        taskSupervisor.roleName = 'task-supervisor'

        roles.push(role)
        roles.push(caseAllocator)
        roles.push(taskSupervisor)

        return { roleAssignmentResponse: roles }
    }

    getServiceUsersRolesAssignments(auth){
        return this.getRolesAssignmentsForSession(auth);
    }


    getRequestedRoleAssignments(auth,reqBody) {
        const consolidatedRoleAssignments = [...this.serviceUsersRoleAssignments ,...this.getRolesAssignmentsForSession(auth)]
        const filteredRolesAssignments = consolidatedRoleAssignments.filter(roleAssignment => {
            const keys = Object.keys(reqBody)
            for (const key of keys) {
                if (key === 'attributes') {
                    if (!this.doRoleAssigmentAttributesMatch(roleAssignment, reqBody.attributes)) {

                        return false;
                    }
                } else if (key === 'roleName' || key === 'roleType' || key === 'roleCategory' || key === 'grantType') {
                    if (!reqBody[key].includes(roleAssignment[key])) {
                        return false;
                    }
                }  else {
                    throw new Error(`role assigment req ${key} not configured for filter in MOCK`)
                }
            }
            return true;
        })

        return filteredRolesAssignments;
    }

    doRoleAssigmentAttributesMatch(roleAssignment, attributes) {
        const roleAssignmentAttribs = roleAssignment.attributes
        const attribKeys = Object.keys(attributes)



        for (const key of attribKeys) {
            if (roleAssignmentAttribs === undefined || !roleAssignmentAttribs[key] || !attributes[key].includes(roleAssignmentAttribs[key])) {
                // console.log(`${key} : attribute no matched ${roleAssignmentAttribs[key]}`)
                return false;
            }
        }
        return true;
    }

    pushNewRoleAssignmentRequests(auth, roleRequests) {
        // console.log(roleRequests)

        this.getRolesAssignmentsForSession(auth).push(...roleRequests.requestedRoles)
        return roleRequests.requestedRoles;
    }


    getQueryResults(queryRequests){
        const roleAssignments = []
        const query = queryRequests[0];
        const roleType = query.roleType ? query.roleType[0] : null;
        const roleCategory = query.roleCategory ? query.roleCategory[0] : null;
        const actorId = query.actorId ? query.actorId[0] : null;
        const jurisdiction = query.attributes.jurisdiction ? query.attributes.jurisdiction[0] : null

        for (let i = 0; i < 150; i++) {
            const roleAssignmentTemplate = this.getRoleAssignmentTemplate();
            roleAssignmentTemplate.roleType = roleType;
            roleAssignmentTemplate.roleCategory = roleCategory ? roleCategory : roleAssignmentTemplate.roleCategory;
            roleAssignmentTemplate.actorId = actorId ? actorId : roleAssignmentTemplate.actorId;
            roleAssignmentTemplate.attributes.jurisdiction = jurisdiction;

            if (roleType === 'CASE') {
                roleAssignmentTemplate.attributes.caseType = 'Asylum'
                roleAssignmentTemplate.attributes.caseId = '12345678123456' + (i > 9 ? i : '0' + i)
            }
            roleAssignments.push(roleAssignmentTemplate)

        }

        return roleAssignments;
    }

    getRoleAssignmentsRoles() {
        return roles;
    }


    addRoleAssignmentResponse(req) {
        const responseTemplate = this.getAddRoleAssignmentResponseTemplate();
        const response = { roleAssignmentResponse: req.body };
        response.roleAssignmentResponse.roleRequest['authenticatedUserid'] = response.roleAssignmentResponse.roleRequest.assignerId;
        return responseTemplate;
    }

    getBookings(reqBody) {
        return {
            "bookings": [
                {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "userId": "string",
                    "regionId": "20001",
                    "locationId": "20001",
                    "created": new Date(),
                    "beginTime": new Date(),
                    "endTime": new Date(),
                    "log": "string"
                }
            ]
        }
    }


    getRoleAssignmentTemplate() {
        return {
            "actorId": "0fb93311-47fe-4df2-b712-d541779cd565",
            "actorIdType": "IDAM",
            "classification": "PUBLIC",
            "created": "2022-01-13T17:44:42.15304Z",
            "grantType": "STANDARD",
            "id": v4(),
            "readOnly": false,
            "roleCategory": "LEGAL_OPERATIONS",
            "roleName": "senior-tribunal-caseworker",
            "roleType": "ORGANISATION",
            "attributes": {
                "substantive": "Y",
                "primaryLocation": "219164",
                "jurisdiction": "IA",
                "workTypes": "hearing_work, routine_work, decision_making_work, applications"
            }
        }
    }


    getAddRoleAssignmentResponseTemplate() {
        return {
            roleAssignmentResponse: {
                roleRequest: {
                    id: "bf28c9a7-67d7-401b-93c1-fede693b5d1c",
                    authenticatedUserId: "3002eca3-cb09-4b58-be7b-bf5cc3075761",
                    correlationId: "bc10952c-b000-4c96-bbde-04126a2def46",
                    assignerId: "3002eca3-cb09-4b58-be7b-bf5cc3075761",
                    requestType: "CREATE",
                    replaceExisting: false,
                    status: "APPROVED",
                    created: "2023-04-04T15:50:14.28129674Z",
                    log: "Request has been approved",
                    byPassOrgDroolRule: true,
                },
                requestedRoles: [
                    {
                        id: "96a2d8fc-3f69-44cd-afe7-abff7d49b94a",
                        actorIdType: "IDAM",
                        actorId: "fbf510c3-7f8a-48cf-98eb-1291dd44392e",
                        roleType: "CASE",
                        roleName: "hearing-judge",
                        classification: "PUBLIC",
                        grantType: "SPECIFIC",
                        roleCategory: "JUDICIAL",
                        readOnly: false,
                        beginTime: "2023-04-03T23:00:00Z",
                        status: "LIVE",
                        created: "2023-04-04T15:50:14.281320878Z",
                        log: "Create requested with replace: false\nCase Allocator approved : case_allocator_approve_create_case_role\nStage 1 approved : ia_hearing_judge_create_case_roles\nStage 1 approved : ia_hearing_judge_create_case_roles\nApproved : validate_role_assignment_against_patterns",
                        attributes: {
                            caseId: "1547466725650882",
                            jurisdiction: "IA",
                            caseType: "Asylum",
                            substantive: "Y",
                        },
                    },
                ],
            }
        }
    }




}

module.exports = new RoleAssignments();
