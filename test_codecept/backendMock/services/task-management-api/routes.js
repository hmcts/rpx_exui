

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

const userApiData = require('../userApiData')


router.post('/', (req, res) => {
    const search_parameters = req.body.search_parameters;
    const caseFilter = search_parameters.find(param => param.key === 'caseId' )

    const tasksResponse =  service.getSearchTasks(24,150);
    tasksResponse.tasks.push(service.getTaskWithProperties({ assignee: '52b5a4b0-a69f-41c5-a89f-84b884d7a04d', description:"[Respond to query](/query-management/query/1604309496714935/3)" }))
    if (caseFilter){
        userApiData.sendResponse(req, res, "OnCaseTasks", () => tasksResponse)

    }else{
        userApiData.sendResponse(req, res, "OnSearchTasks", () => tasksResponse)

    }
});

router.get('/:taskId', (req, res) => {
    userApiData.sendResponse(req, res, "OnTaskDetails", () => service.getTask())
});

router.get('/:taskId/roles', (req, res) => {
    userApiData.sendResponse(req, res, "OnTaskRoles", () => service.getTaskRoles())
});

router.post('/:taskId/:action', (req,res) => {
    res.status(204).send({})
})

router.post('/search-for-completable', (req, res) => {
    const tasks = []
    // const task1 = { assignee:'8767657575675' }
    // tasks.push(service.getTaskWithProperties(task1))
    userApiData.sendResponse(req, res, "OnSearchForCompletableTasks", () => service.searchCompletableTasksRes)

})
;;
module.exports =  router;