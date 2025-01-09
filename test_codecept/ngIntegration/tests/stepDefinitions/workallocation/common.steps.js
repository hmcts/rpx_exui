var { defineSupportCode } = require('cucumber');

const MockApp = require('../../../../nodeMock/app');
const workAllocationMockData = require('../../../mockData/workAllocation/mockData');
const rolesAccessMockData = require('../../../mockData/workAllocation/rolesAccess');
const BrowserWaits = require('../../../../e2e/support/customWaits');
const taskListPage = require('../../../../e2e/features/pageObjects/workAllocation/taskListPage');
const taskManagerPage = require('../../../../e2e/features/pageObjects/workAllocation/taskManagerPage');
const taskAssignmentPage = require('../../../../e2e/features/pageObjects/workAllocation/taskAssignmentPage');

const caseDetailsPage = require('../../pageObjects/caseDetailsPage');

const headerPage = require('../../../../e2e/features/pageObjects/headerPage');
const CaseListPage = require('../../../../e2e/features/pageObjects/CaseListPage');
const errorPage = require('../../../../e2e/features/pageObjects/errorPage');

const SoftAssert = require('../../../util/softAssert');
const browserUtil = require('../../../util/browserUtil');
const errorMessageForResponseCode = require('../../../util/errorResonseMessage');


const MockUtil = require('../../../util/mockUtil');
const WAUtil = require('../../workAllocation/utils');
// const nodeAppMockData = require('../../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../../codeceptCommon/reportLogger');

const headerpage = require('../../../../e2e/features/pageObjects/headerPage');
const taskActionPage = require('../../../../e2e/features/pageObjects/workAllocation/taskActionPage');
const TaskListTable = require('../../../../e2e/features/pageObjects/workAllocation/taskListTable');
const CaseListTable = require('../../../../e2e/features/pageObjects/workAllocation/casesTable');

const workAllocationDateUtil = require('../../../../e2e/features/pageObjects/workAllocation/common/workAllocationDateUtil');

const ArrayUtil = require("../../../../e2e/utils/ArrayUtil");

const workAllocationDataModel = require("../../../../dataModels/workAllocation");

const { DataTableArgument } = require('codeceptjs');

    const taskListTable = new TaskListTable();
    const waCaseListTable = new CaseListTable();

    const TASK_SEARHC_FILTERS_TO_IGNORE_IN_REQUEST_BODY = {
        'priority': 'Is out of scope and will be removed as part of https://tools.hmcts.net/jira/browse/EUI-4809',
        'taskType': 'Is to be includes only in 2.1 till the it will be ignored in test'
    }

    When('I click task list pagination link {string} and wait for req reference {string} not null', async function (paginationLinktext, reference) {
        await taskListTable.waitForTable();
        await BrowserWaits.retryWithActionCallback(async () => {
       
            await taskListTable.clickPaginationLink(paginationLinktext);
           
        });
       
    });

    When('I click WA case list pagination link {string} and wait for req reference {string} not null', async function (paginationLinktext, reference) {
        await waCaseListTable.waitForTable();
        await BrowserWaits.retryWithActionCallback(async () => {

            const val = await browserUtil.addTextToElementWithCssSelector('tbody tr .cdk-column-case_category exui-task-field,tbody tr .cdk-column-case_category exui-work-field', 'Sort test', true);
            if (val !== "success") {
                throw new Error(JSON.stringify(val));

            }
            await waCaseListTable.clickPaginationLink(paginationLinktext);
            await BrowserWaits.waitForConditionAsync(async () => {
                const caseCatColVal = await waCaseListTable.getColumnValueForCaseAt('Case category', 1);
                return !caseCatColVal.includes('Sort test');
            });
            await BrowserWaits.waitForConditionAsync(async () => {
                return global.scenarioData[reference] !== null
            }, 5000);
        });

    });

    Then('I validate task search request with reference {string} has pagination parameters', async function (requestReference, datatable) {
        const reqBody = global.scenarioData[requestReference];
        const datatableHash = datatable.parse().hashes()[0];
        expect(reqBody.searchRequest.pagination_parameters.page_number).to.equal(parseInt(datatableHash.PageNumber));
        expect(reqBody.searchRequest.pagination_parameters.page_size).to.equal(parseInt(datatableHash.PageSize));
    });


    Then('I validate task search request with reference {string} have search parameters', async function (requestReference, datatable) {
        const softAssert = new SoftAssert();
        const reqBody = global.scenarioData[requestReference];
        const datatableHash = datatable.parse().hashes();
        CucumberReporter.AddMessage("Req body received:");
        CucumberReporter.AddJson(reqBody);
        const reqSearchParams = reqBody.searchRequest.search_parameters;
        for (let i = 0; i < datatableHash.length; i++) {
            searchHash = datatableHash[i];
            if (Object.keys(TASK_SEARHC_FILTERS_TO_IGNORE_IN_REQUEST_BODY).includes(searchHash.key)){
                CucumberReporter.AddMessage(`${searchHash.key} is ignored for eeason : ${TASK_SEARHC_FILTERS_TO_IGNORE_IN_REQUEST_BODY[searchHash.key]}`);
                continue;
            }
            const searchParamObj = await ArrayUtil.filter(reqSearchParams, async (searchObj) => searchObj.key === searchHash.key);
           
            softAssert.setScenario(`Search param with key ${searchHash.key} is present`);
            if (searchHash.value !== ''){
                await softAssert.assert(async () => expect(searchParamObj.length > 0).to.be.true);
            }
             
            if (searchParamObj.length > 0) {
                if (searchHash.value && searchHash.value !== ""){
                    softAssert.setScenario(`Search param with key ${searchHash.key} and values ${searchHash.value} is present`);
                    if (searchHash.value !== ''){
                        await softAssert.assert(async () => expect(searchParamObj[0].values).to.includes(searchHash.value));
                    }
                    
                }

                if (searchHash.size) {
                    softAssert.setScenario(`Search param with key ${searchHash.key} and has value count ${searchHash.size}`);
                    await softAssert.assert(async () => expect(searchParamObj[0].values.length).to.equal(parseInt(searchHash.size)));
                }
                
            }
        }
        softAssert.finally();

    });

    Then('I validate task search request with reference {string} does not have search parameters', async function (requestReference, datatable) {
        const softAssert = new SoftAssert();
        const reqBody = global.scenarioData[requestReference];
        const datatableHash = datatable.parse().hashes();

        const reqSearchParams = reqBody.searchRequest.search_parameters;
        for (let i = 0; i < datatableHash.length; i++) {
            searchHash = datatableHash[i];
            if (Object.keys(TASK_SEARHC_FILTERS_TO_IGNORE_IN_REQUEST_BODY).includes(searchHash.key)) {
                CucumberReporter.AddMessage(`${searchHash.key} is ignored for eeason : ${TASK_SEARHC_FILTERS_TO_IGNORE_IN_REQUEST_BODY[searchHash.key]}`);
                continue;
            }
            const searchParamObj = await ArrayUtil.filter(reqSearchParams, async (searchObj) => searchObj.key === searchHash.key);
            softAssert.setScenario(`Search param with key ${searchHash.key} is present`);
            if (searchParamObj.length > 0) {
                softAssert.setScenario(`Search param with key ${searchHash.key} and values ${searchHash.values} is present`);
                await softAssert.assert(async () => expect(searchParamObj[0].values).to.not.includes(searchHash.value));
            }
        }
        softAssert.finally();
        
    });


    Then('I validate task search request with reference {string} does not have search patameter key {string}', async function (requestReference, searchKey) {
        const reqBody = global.scenarioData[requestReference];

        const reqSearchParams = reqBody.searchRequest.search_parameters;
        const searchParametersMatchingType = await ArrayUtil.filter(reqSearchParams, async (searchObj) => searchObj.key === searchKey);

        expect(searchParametersMatchingType.length, `Search parameter mathcing key "${searchKey}" found in request body ${reqBody} `).to.equal(0); 

    });

    Given('I set MOCK case workers for release {string}', async function(forRelease,datatable){
        // const persons = getPersonResponse(datatable);
        // let url = null;
        // if (forRelease === "1"){
        //     MockApp.onGet('workallocation/caseworker', (req,res) => {
        //         res.send(persons);
        //     });
        // } else if (forRelease === "2"){
        //     MockApp.onGet('workallocation2/caseworker', (req, res) => {
        //         res.send(persons);
        //     });
        // } else{
        //     throw new Error(`Unexpected release identifier "${forRelease}"  passed to setup mock`);
        // }

    });

    Then('I validate task table values displayed', async function(datatable){
        await validateTaskTableValues(datatable);
    });

    Then('If current user {string} is {string}, I validate task table values displayed', async function (currentUser,validationForUserType ,datatable) {
        if (currentUser === validationForUserType){
            await validateTaskTableValues(datatable);
        }
    });

    Given('I have workallocation on boarded services {string}', async function(onboardedServices){
        workAllocationMockData.updateWASupportedJurisdictions(onboardedServices.split(",")) ;
    });

    // Given('I set MOCK case roles', async function(datatable){
    //     const caseRoles = [];
    //     const tableRowHashes = datatable.parse().hashes();
    //     for (const row of tableRowHashes) {
    //         const mockCaseRole = rolesAccessMockData.dataModel.getCaseRole(); 
    //         caseRoles.push(mockCaseRole)
    //         const hashkeys = Object.keys(row);

    //         for (let j = 0; j < hashkeys.length; j++) {
    //             const key = hashkeys[j];

    //             // if (key.includes('start') || key.includes('end') || key.includes('created')) {
    //             //     mockCaseRole[key] = workAllocationDateUtil.getDateFormat(row[key],"YYYY-MM-DD");
    //             // }else{
    //             //     mockCaseRole[key] = row[key]; 
    //             // }

    //             mockCaseRole[key] = row[key]; 

    //         }


    //     }
    //     rolesAccessMockData.caseRoles = caseRoles;
    // });

    async function validateTaskTableValues(datatable){
        const tableRowHashes = datatable.parse().hashes();
        const softAssert = new SoftAssert();
        for (let i = 0; i < tableRowHashes.length; i++) {
            const expectRowHash = tableRowHashes[i];
            const rowNum = parseInt(expectRowHash["row"]);

            const hashkeys = Object.keys(expectRowHash);

            for (let j = 0; j < hashkeys.length; j++) {
                const columnName = hashkeys[j];
                let expectedValue = expectRowHash[columnName];

                if (columnName.includes('Due date')){
                    expectedValue = workAllocationDateUtil.getTaskDueDateDisplayString(expectedValue);
                }

                if (columnName.includes('Task created')) {
                    expectedValue = workAllocationDateUtil.getTaskCeateDateDisplayString(expectedValue);
                }

                if (columnName.includes('Hearing date')) {
                    expectedValue = workAllocationDateUtil.getDurationDateDisplayString(expectedValue);
                }

                let actualColumnValue = null;
                if (columnName === "row") {
                    continue;
                } else {
                    actualColumnValue = await taskListTable.getColumnValueForTaskAt(columnName, rowNum)
                }

                const assertionMessage = `At row ${rowNum} validation of column ${columnName}`;
                softAssert.setScenario(assertionMessage);
                await softAssert.assert(async () => expect(actualColumnValue.toLowerCase(), assertionMessage).to.includes(expectedValue.toLowerCase()));

            }


        }
        softAssert.finally();
    } 

    function getLocationsResponse(datatable){
        const locationHashes = datatable.parse().hashes();
        const locations = [];
        for (let i = 0; i < locationHashes.length; i++) {
            const locationFromDatatable = locationHashes[i];
            const location = workAllocationDataModel.getLocation();

            const locationInputKeys = Object.keys(locationFromDatatable);
            for (let j = 0; j < locationInputKeys.length; j++) {
                const key = locationInputKeys[j];
                location[key] = locationFromDatatable[key];
            }
            locations.push(location);
           
        }
        return locations;
    }
    
    function getPersonResponse(datatable){
        const personHashes = datatable.parse().hashes();
        const personsData = [];
        for (let i = 0; i < personHashes.length;i++){
            const personFromDatatable = personHashes[i];
            const person = workAllocationDataModel.getCaseWorkerOrperson();
            
            const personInputKeys = Object.keys(personFromDatatable);
            for (let j = 0; j < personInputKeys.length;j++ ){
                const key = personInputKeys[j];
                if (key === "location.id"){
                    person.location.id = personFromDatatable[key]
                } else if (key === "location.locationName"){
                    person.location.locationName = personFromDatatable[key]
                }else{
                    person[key] = personFromDatatable[key];
                }
                
            }
            personsData.push(person);
        }
        return personsData;
    }
