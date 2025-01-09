const { isRequestMatch } = require('./common')
const { v4 } = require('uuid');


function getUserDataTemplate() {
    return {
        id: "00c45e36-481a-48da-82a9-6ecf12a99e0a",
        first_name: "IAC",
        last_name: "TCW",
        region_id: 12,
        user_type: "Legal office",
        suspended: "false",
        case_allocator: "N",
        task_supervisor: "Y",
        staff_admin: "N",
        created_time: "2022-10-05T12:08:49.684",
        last_updated_time: "2022-10-05T12:08:49.684012",
        email_id: "crd_func_test_demo_tcwuser2@justice.gov.uk",
        region: "National",
        base_location: [
        ],
        user_type_id: 3,
        role: [
            {
                role_id: "2",
                created_time: "2022-11-24T11:22:36.562719",
                last_updated_time: "2022-11-24T11:22:36.562722",
                role: "Legal Caseworker",
                is_primary: true,
            },
        ],
        skills: [
        ],
        work_area: [
        ],
    }
}

const serviceBaseLocations = {
    iac: {
        created_time: "2022-11-24T11:22:36.555694",
        last_updated_time: "2022-11-24T11:22:36.555697",
        location_id: 231596,
        location: "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE",
        is_primary: true,
    }
}

const serviceWorkArea = {
    iac: {
        service_code: "BFA1",
        area_of_work: "Immigration and Asylum Appeals",
        created_time: "2022-11-24T11:22:36.570527",
        last_updated_time: "2022-11-24T11:22:36.57053",
    }
}


class RdCaseworkerApi {

    constructor(){
        this.iacCTSCUsers = []
        this.setupMockData()
    }

    setupMockData(){
        for(let i = 0; i<= 5;i++){
            const iacUser = getUserDataTemplate()
            iacUser.id = v4()
            iacUser.first_name = 'IAC'+i
            iacUser.last_name = 'mock'
            iacUser.email_id = `mockCtsc_${i}@test.com`
            iacUser.base_location.push(serviceBaseLocations.iac)
            iacUser.work_area.push(serviceWorkArea.iac) 
            this.iacCTSCUsers.push(iacUser) 
        }
    }

    processResponse(response) {
        if (isRequestMatch('GET', '/refdata/internal/staff/usersByServiceName', response)) {
            response.data.push(...this.iacCTSCUsers)
        }
     
    }


}

module.exports = new RdCaseworkerApi();


