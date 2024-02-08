var { defineSupportCode } = require('cucumber');

// const MockApp = require('../../../nodeMock/app');

const caseEditPage = require('../pageObjects/ccdCaseEditPages');

const browserUtil = require('../../util/browserUtil');
// const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../codeceptCommon/reportLogger');
const dummyCaseDetails = require('../../mockData/ccd/caseDetails_data');
const ccdMockData = require('../../mockData/ccd/ccdApi');
const caseDetailsMock = require('../../../backendMock/services/ccd/caseDetails_data')

const mockClient = require('../../../backendMock/client/index.js');
const serviceMock = require('../../../backendMock/client/serviceMock')
const headerpage = require('../../../e2e/features/pageObjects/headerPage');
const workAlloctionMockData = require('../../mockData/workAllocation/mockData');

const { getTestJurisdiction, getMockJurisdictionWorkbaseketConfig, getMockJurisdictionSearchInputConfig } = require('../../mockData/ccdCaseMock');
const getEventConfig = require('../../mockData/ccdMockEventConfigs');

const idamLogin = require('../../util/idamLogin')

const { DataTableArgument } = require('codeceptjs');
const {postTaskAction, getTask} = require("../../../../api/workAllocation");



    Given('I set mock case create config {string}', async function (configReference) {
        // const caseConfig = getTestJurisdiction();
        // global.scenarioData[configReference] = caseConfig;
        // MockApp.onGet('/data/internal/case-types/:jurisdiction/event-triggers/:caseType', (req, res) => {
        //     res.send(caseConfig.getCase());
        // });

    });

    Given('I set MOCK event {string} props', async function(caseConfigReference, dataTable){
        const caseConfig = global.scenarioData[caseConfigReference];
        const eventprops = convertDatatablePropsToccdObj(dataTable);
        caseConfig.updateEventProps(eventprops);
    });

    Given('I set mock case workbasket config {string}', async function(workbasketRef){
        const workbasetConfigurator = getMockJurisdictionWorkbaseketConfig();
        global.scenarioData[workbasketRef] = workbasetConfigurator;
        MockApp.onGet('/data/internal/case-types/:jurisdiction/work-basket-inputs', (req, res) => {
            res.send(workbasetConfigurator.getConfig());
        });

    });

    Given('I set mock case searchinput config {string}', async function(searchInputRef){
        // const searchInputConfigurator = getMockJurisdictionSearchInputConfig();
        // global.scenarioData[searchInputRef] = searchInputConfigurator;
        // MockApp.onGet('/data/internal/case-types/:jurisdiction/search-inputs', (req, res) => {
        //     res.send(searchInputConfigurator.getConfig());
        // });

    });

    Given('I set MOCK event {string} config with reference {string}', async function(eventId, eventReference){
        const caseConfig = getEventConfig(eventId);
        global.scenarioData[eventReference] = caseConfig;
        MockApp.onGet('/data/internal/case-types/:jurisdiction/event-triggers/:caseType', (req, res) => {
            res.send(caseConfig.getCase());
        });
    });

    Given('I set MOCK event config {string} field {string} properties', async function(eventConfigRef, fieldId, datatable){
        const eventConfig = global.scenarioData[eventConfigRef];
        const fieldProps = convertDatatablePropsToccdObj(datatable);
        eventConfig.updateFieldProps(fieldId, fieldProps);
    });

    Given('I set MOCK case details with reference {string}', async function(caseDetailsReference){

        const caseDetails = JSON.parse(JSON.stringify(ccdMockData.caseDetailsResponse));
         global.scenarioData[caseDetailsReference] = caseDetails;

        await serviceMock.updateCaseData(global.scenarioData[caseDetailsReference], 200)
       
    });

    Given('I set MOCK case {string} details with reference {string}', async function (caseType, caseDetailsReference) {
        const caseDetails = JSON.parse(JSON.stringify(caseDetailsMock[caseType]));
        global.scenarioData[caseDetailsReference] = caseDetails;
        await serviceMock.updateCaseData(global.scenarioData[caseDetailsReference], 200)

    });

    Given('I set MOCK case details {string} values', async function (caseDetailsReference, caseDetailsDatatable) {
        const caseDetails = global.scenarioData[caseDetailsReference];
        await serviceMock.updateCaseData(caseDetails, 200)
    });

    Given('I set MOCK case details {string} property {string} as {string}', async function(caseDetailsRef, property, value){
        const caseDetails = global.scenarioData[caseDetailsRef];
        if(property.toLowerCase().includes('jurisdiction')) {
            caseDetailsMock.setCaseTypeProperties(caseDetails,{
                "jurisdiction.id": value
            })
            const field = getCaseDetailsMetadataField(caseDetails,'[JURISDICTION]');
            field.value = value;
        } else if (property.toLowerCase().includes('caseType')) {
            const field = getCaseDetailsMetadataField(caseDetails, '[CASE_TYPE]');
            field.value = value;
        }

        else if (property.toLowerCase().includes('case_type')) {
            caseDetailsMock.setCaseTypeProperties(caseDetails, {
                "case_type.id": value
            })
            const field = getCaseDetailsMetadataField(caseDetails, '[JURISDICTION]');
            field.value = value;
        }
        else if (property.toLowerCase().includes('case_id')) {
            caseDetails.case_id = value;
        }
        else {
            throw Error(` metadata field ${property} is not recognised or not implemented in test`);
        }

        await serviceMock.updateCaseData(caseDetails, 200)
    });

    Given('I set MOCK case details {string} service name as {string}', async function (caseDetailsRef, serviceName) {
        const caseDetails = global.scenarioData[caseDetailsRef];

        caseDetails.case_type.jurisdiction.name = serviceName;
        global.scenarioData[caseDetailsRef] = caseDetails;


        await serviceMock.updateCaseData(caseDetails, 200)

    });

    Given('I set MOCK case details {string} state as {string}', async function (caseDetailsRef, name) {
        const caseDetails = global.scenarioData[caseDetailsRef];
        caseDetails.state.name = name;

        await serviceMock.updateCaseData(caseDetails, 200)

    });

    Given('I set MOCK case details {string} access process {string} and access granted {string}', async function (caseDetailsRef, accessProcess,accessGranted) {
        const caseDetails = global.scenarioData[caseDetailsRef];

        caseDetails.metadataFields.push({
            "id": "[ACCESS_PROCESS]",
            "label": "Access Process",
            "hidden": null,
            "value": accessProcess,
            "metadata": true,
            "hint_text": null,
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [

                ],
                "complex_fields": [

                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": null,
            "display_context_parameter": null,
            "show_condition": null,
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "publish": null,
            "publish_as": null,
            "acls": null
        });

        caseDetails.metadataFields.push({
            "id": "[ACCESS_GRANTED]",
            "label": "Access Granted",
            "hidden": null,
            "value": accessGranted,
            "metadata": true,
            "hint_text": null,
            "field_type": {
                "id": "Text",
                "type": "Text",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [

                ],
                "complex_fields": [

                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": null,
            "display_context": null,
            "display_context_parameter": null,
            "show_condition": null,
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "publish": null,
            "publish_as": null,
            "acls": null
        });
        await serviceMock.updateCaseData(caseDetails, 200)

        await serviceMock.updateCaseData(caseDetails, 200)

    });

    Given('I set MOCK case details {string} trigger id {string} trigger name {string}', async function (caseDetailsRef, eventId, eventName) {
        const caseDetails = global.scenarioData[caseDetailsRef];
        const testTrigger = { ...caseDetails.triggers[0]}
        testTrigger.id = eventId;
        testTrigger.name = eventName;
        caseDetails.triggers.push(testTrigger);
            
        await serviceMock.updateCaseData(caseDetails, 200)

    });

    Given('I set MOCK case roles', async function(caseRolesDatatable){
        const dateTableHashes = caseRolesDatatable.parse().hashes();
        for (const hash of dateTableHashes){
            for(const key of Object.keys(hash)){
                if ((key === 'start' || key === 'end') && hash[key] !== ''){
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() + parseInt(hash[key]));
                    hash[key] = dateObj.toISOString();
                }

                if(key === 'role-name'){
                    hash[key] = hash[key].toLowerCase().split(" ").join("-");
                }
            }
        }
        workAlloctionMockData.caseRoles = workAlloctionMockData.getCaseRoles(dateTableHashes);

    });

    Given('I set MOCK case role exclusions', async function (caseRoleExclusionsDatatable) {
        const dateTableHashes = caseRoleExclusionsdatatable.parse().hashes();
        for (const hash of dateTableHashes) {
            for (const key of Object.keys(hash)) {
                if (key === 'added' ) {
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() + parseInt(hash[key]));
                    hash[key] = dateObj.getTime();
                }
            }
        }
        workAlloctionMockData.exclusions= workAlloctionMockData.getCaseExclusions(dateTableHashes);
    });

    Given('I set MOCK case tasks with userDetails from reference {string}', async function (userDetailsRef, caseTasksDatatable) {
        const userDetails = await idamLogin.getUserDetails();
        const authCookie = await browser.driver.manage().getCookie('__auth__');

        const dateTableHashes = caseTasksDatatable.parse().hashes();
        workAlloctionMockData.caseTasks = await workAlloctionMockData.getCaseTasks(dateTableHashes, userDetails);
        await mockClient.setUserApiData(authCookie.value, 'OnCaseTasks', {
          status: 200,
          data: {
            tasks: workAlloctionMockData.caseTasks,
            'total_records': workAlloctionMockData.caseTasks.length
          }
        })
    });

    Given('I set MOCK case list values', async function(caseListAttributesDatatable){
        // const cases = ccdMockData.caseList.results;
        // const inputDatatableHashes = caseListAttributesdatatable.parse().hashes();

        // for (let i = 0; i < inputDatatableHashes.length; i++){
        //     const caseItem = cases[i];
        //     const inputHash = inputDatatableHashes[i];

        //     const keys = Object.keys(inputHash);
        //     for(const caseAttrib of keys){
        //         if (caseAttrib.startsWith('case_fields.')){
        //             const caseFieldAttrib = caseAttrib.replace('case_fields.','');
        //             caseItem['case_fields'][caseFieldAttrib] = inputHash[caseAttrib];
        //         } else if (caseAttrib.startsWith('case_fields_formatted.')){
        //             const caseFieldAttrib = caseAttrib.replace('case_fields_formatted.', '');
        //             caseItem['case_fields_formatted'][caseFieldAttrib] = inputHash[caseAttrib];
        //         }else{
        //             caseItem[caseAttrib] = inputHash[caseAttrib];
        //         }
        //     }

        // }

    });


function getCaseDetailsMetadataField(caseDetails, metadatFieldId){
    const fields = caseDetails.metadataFields;
    let returnField = null;
    for(const field of fields){
        if (field.id === metadatFieldId){
            returnField = field;
            break;
        }
    }
    return returnField;
}

function convertDatatablePropsToccdObj(datatable){
    const tableRowshash = datatable.rowsHash();
    for (const key in tableRowshash){

        if (tableRowshash[key].toUpperCase() === "YES"){
            tableRowshash[key] = true;
        } else if (tableRowshash[key].toUpperCase() === "NO"){
            tableRowshash[key] = false;
        }
    }
    return tableRowshash;
}
