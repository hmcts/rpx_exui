
const { v4 } = require('uuid');
const userApiData = require('../userApiData')
const serviceMockClient = require('../../client/serviceMock')

class TaskManagementApi{
    

    constructor(){

        this.method = {
            searchTasks: "OnSearchTasks"
        }

        this.setDefaultData()
    }

    setDefaultData(){
        this.searchTasksResponse = this.getSearchTasks(25, 140)
        this.searchCompletableTasksRes = { task_required_for_event: false, tasks: [] }
    }

    setOnSearchTasks(token, response){
        userApiData.setUserData(token, this.method.searchTasks, response)
    }

    getSearchTasks(count, totalRecordsCount){
        const tasks = []
        for(let i = 0; i< count; i++){
            const task = this.getTaskTemplate();
            task.assignee = 'test_id'
            tasks.push(task);
        }
        return { tasks: tasks, 'total_records': totalRecordsCount };
    }

    getTask(){
        return { task: this.getTaskTemplate() }
    }

    getTaskWithProperties(props){
        const taskTemplate = this.getTaskTemplate();

        for(const prop of Object.keys(props)){

            if (prop.includes('warning_list') || prop.includes('permissions')){ 
                taskTemplate[prop].values = props[prop].split(',');
            }else{
                taskTemplate[prop] = props[prop];

            }

        }
        return taskTemplate;

    }

    async setTaskRequiredForEventAs(taskRequired) {
        this.searchCompletableTasksRes.task_required_for_event = taskRequired;
        await serviceMockClient.updateSearchForCompletableTasks(this.searchCompletableTasksRes, 200)
    }

    async setTaskRequiredForEventTasks(tasks) {

        const watasks = tasks.map(task => {
            const waTask = this.getTaskTemplate();
            Object.keys(task).forEach(taskkey => {
                if (task[taskkey].includes('true') || task[taskkey].includes('false')) {
                    waTask[taskkey] = task[taskkey] === "true";
                } else {
                    waTask[taskkey] = task[taskkey];
                }
            });
            return waTask;
        })
        this.searchCompletableTasksRes.tasks = watasks;
        await serviceMockClient.updateSearchForCompletableTasks(this.searchCompletableTasksRes, 200)
    }


    getWorkTypes(){
        return {
            'work_types':[
                        {
                            "key": "hearing_work",
                            "label": "Hearing work"
                        },
                        {
                            "key": "decision_making_work",
                            "label": "Decision-making work"
                        },
                        {
                            "key": "applications",
                            "label": "Applications"
                        },
                        {
                            "key": "access_requests",
                            "label": "Access requests"
                        }
                    ]
        }
    }
    
    getTaskRoles(){
        return {
            roles: [
                {
                    "role_category": "JUDICIAL",
                    "role_name": "lead-judge",
                    "permissions": [
                        "OWN",
                        "EXECUTE",
                        "READ",
                        "MANAGE",
                        "CANCEL"
                    ],
                    "authorisations": [
                        "IAC",
                        "SSCS"
                    ]
                },
                {
                    "role_category": "LEGAL_OPERATIONS",
                    "role_name": "case-manager",
                    "permissions": [
                        "EXECUTE",
                        "READ",
                        "MANAGE",
                        "CANCEL"
                    ],
                    "authorisations": [
                        "IAC",
                        "SSCS"
                    ]
                },
                {
                    "role_category": "JUDICIAL",
                    "role_name": "hearing-judge",
                    "permissions": [
                        "EXECUTE",
                        "READ"
                    ],
                    "authorisations": [
                        "IAC"
                    ]
                }
            ]
        }
    }

    getTaskTemplate(){
        return {
            "id": v4(),
            "name": "Follow-up overdue respondent evidence",
            "type": "followUpOverdueRespondentEvidence",
            "task_state": "unassigned",
            "task_system": "SELF",
            "security_classification": "PUBLIC",
            "task_title": "Follow-up overdue respondent evidence",
            "created_date": "2022-12-12T16:00:02+0000",
            "due_date": "2022-12-14T16:00:00+0000",
            "location_name": "Taylor House",
            "location": "765324",
            "execution_type": "Case Management Task",
            "jurisdiction": "IA",
            "region": "1",
            "case_type_id": "Asylum",
            "case_id": "1669646436529598",
            "case_category": "Protection",
            "case_name": "José González",
            "auto_assigned": false,
            "warnings": false,
            "warning_list": {
                "values": [
                ]
            },
            "case_management_category": "Protection",
            "work_type_id": "decision_making_work",
            "work_type_label": "Decision-making work",
            "permissions": {
                "values": [
                    "Read",
                    "Own",
                    "Manage",
                    "Execute",
                    "Cancel",
                    "Complete",
                    "Claim",
                    "Unclaim",
                    "Assign",
                    "Unassign"
                ]
            },
            "description": "",
            "role_category": "LEGAL_OPERATIONS",
            "minor_priority": 500,
            "major_priority": 5000,
            "priority_date": "2022-12-14T16:00:00+0000"
        }
    }


}

module.exports = new TaskManagementApi();


