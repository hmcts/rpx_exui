
class RDCaseworkerService {

  constructor() {
    this.caseworkers = []
  }


  getUsersByService(services) {
    const filteredCaseworkers = this.caseworkers.filter(user => services.split(',').includes(user.ccd_service_name));
    return filteredCaseworkers;
  }

  getStaffUserDetailsTemplate() {
    return {
      "ccd_service_name": "string",
      "staff_profile": {
        "id": "string",
        "first_name": "string",
        "last_name": "string",
        "region_id": 0,
        "user_type": "string",
        "idam_roles": "string",
        "suspended": "string",
        "case_allocator": "string",
        "task_supervisor": "string",
        "staff_admin": "string",
        "created_time": "2023-03-19T13:59:21.177Z",
        "last_updated_time": "2023-03-19T13:59:21.177Z",
        "email_id": "string",
        "region": "string",
        "base_location": [
          {
            "created_time": "2023-03-19T13:59:21.177Z",
            "last_updated_time": "2023-03-19T13:59:21.177Z",
            "location_id": 0,
            "location": "string",
            "is_primary": true
          }
        ],
        "user_type_id": 0,
        "role": [
          {
            "role_id": "string",
            "created_time": "2023-03-19T13:59:21.177Z",
            "last_updated_time": "2023-03-19T13:59:21.177Z",
            "role": "string",
            "is_primary": true
          }
        ],
        "skills": [
          {
            "skill_id": 0,
            "skill_code": "string",
            "description": "string"
          }
        ],
        "work_area": [
          {
            "service_code": "string",
            "area_of_work": "string",
            "created_time": "2023-03-19T13:59:21.177Z",
            "last_updated_time": "2023-03-19T13:59:21.177Z"
          }
        ]
      }
    }
  }


}

module.exports = new RDCaseworkerService();
