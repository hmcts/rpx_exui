

const { v4 } = require('uuid');

const rdcaseworkers = require('./rdCaseworker/index')
const roleAssignment = require('./roleAssignments/index');

const caseworkersConf = [
    { services: ['IA', 'CIVIL'], roleCategory: 'LEGAL_OPERATIONS', roleType: 'ORGANISATION', roleName: 'case-allocator', substantive: 'Y', count: 10 },
    { services: ['IA', 'CIVIL'], roleCategory: 'ADMIN', roleType: 'ORGANISATION', roleName: 'case-allocator', substantive: 'Y', count: 10 },
    { services: ['IA', 'CIVIL'], roleCategory: 'CTSC', roleType: 'ORGANISATION', roleName: 'case-allocator', substantive: 'Y', count: 10 },

]

const testUsersConf = [
    {
        services: ['IA', 'CIVIL'], roleCategory: 'LEGAL_OPERATIONS', roleType: 'ORGANISATION', roleName: 'case-allocator', substantive: 'Y',
        id: "test_id", first_name: "test_first", last_name: "test_last", email_id: "test_user@testing.net",
        bookings: [{ "id": "test_booking_id", "userId": "test_id" }]
    }
]

const users = {
    caseworkers: [],
    judicial: []
}

for (const conf of testUsersConf) {
    const cwTemplate = rdcaseworkers.getCaseworkerTemplate();
    const bookingsTemplate = roleAssignment.getBookings();
    bookingsTemplate.bookings = conf.bookings
    cwTemplate.id = conf.id;
    cwTemplate.first_name = conf.first_name
    cwTemplate.last_name = conf.last_name
    cwTemplate.email_id = conf.email_id
    cwTemplate.roleCategory = conf.roleCategory
    cwTemplate.base_location[0].location_id = '20001'
    rdcaseworkers.caseworkers.push(cwTemplate)


    for (const service of conf.services) {
        const roleAssignmentTemplate = roleAssignment.getRoleAssignmentTemplate();
        roleAssignmentTemplate.actorId = conf.id;
        roleAssignmentTemplate.attributes.jurisdiction = service;
        roleAssignmentTemplate.roleCategory = conf.roleCategory;
        roleAssignmentTemplate.roleType = conf.roleType;
        roleAssignmentTemplate.roleName = conf.roleName;
        roleAssignmentTemplate.attributes.substantive = conf.substantive,
            roleAssignmentTemplate.attributes.primaryLocation = '20001';
        roleAssignmentTemplate.attributes.workTypes = [];
        roleAssignment.serviceUsersRoleAssignments.push(roleAssignmentTemplate)
    }



}

let idamIdCounter = 123456781230;

for (const conf of caseworkersConf) {
    const service = conf.services.join('_');
    const role = conf.roleCategory;
    const roleType = conf.roleType;
    const roleName = conf.roleName;

    for (let i = 0; i < conf.count; i++) {


        conf.services.forEach(jurisdiction => {
            idamIdCounter += 1;
            const cwTemplate = rdcaseworkers.getCaseworkerTemplate();
            cwTemplate.id = idamIdCounter + "";
            cwTemplate.idamId = idamIdCounter + "";

            cwTemplate.first_name = `${roleName} ${i + 1}_${idamIdCounter + 1}`
            cwTemplate.last_name = `${service}`
            cwTemplate.email_id = `${service}_${roleName}_${i + 1}_${idamIdCounter + 1}@justice.gov.uk`.toLowerCase()
            cwTemplate.roleCategory = role
            cwTemplate.base_location[0].location_id = '20001'
            rdcaseworkers.caseworkers.push(cwTemplate)



            const roleAssignmentTemplate = roleAssignment.getRoleAssignmentTemplate();
            roleAssignmentTemplate.actorId = cwTemplate.id;
            roleAssignmentTemplate.attributes.jurisdiction = jurisdiction;
            roleAssignmentTemplate.roleCategory = role;
            roleAssignmentTemplate.roleType = roleType;
            roleAssignmentTemplate.roleName = roleName;
            roleAssignmentTemplate.attributes.substantive = 'Y',
                roleAssignmentTemplate.attributes.primaryLocation = '';
            roleAssignmentTemplate.attributes.workTypes = [];

            roleAssignment.serviceUsersRoleAssignments.push(roleAssignmentTemplate)
        })

    }
}


module.exports = users;
