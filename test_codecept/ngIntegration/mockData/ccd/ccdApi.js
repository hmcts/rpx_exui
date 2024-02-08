
const caseworkerJurisdictions  = require("./caseworkerJurisdictions");
const {divorce, probate, ia, publicLaw} = require('./workBasketInputs');

const divorceCreateCaseConfig = require('./solicitorCreate/divorceCaseCreateConfig');
const frConsentedCreaCaseConfig = require('./solicitorCreate/frConsentedConfig');
const frContestedCreaCaseConfig = require('./solicitorCreate/frContestedConfig');

const probateGrantOfRepresentationConfig = require('./solicitorCreate/probateGrantOfRepresentationConfig');
const probateCreateCaveatConfig = require('./solicitorCreate/probateCreateCaveatConfig');

const iaCreateConfig = require('./solicitorCreate/iaCreateConfig');

const fplTribunalConfig = require('./solicitorCreate/fplTribunalCreateConfig');

const fplCareSupervisionConfig = require('./solicitorCreate/fplCareSupervision');

const exuiTestCaseType = require('./solicitorCreate/exuiTestCaseType');
const CCDCaseConfig = require('./ccdCaseConfig/caseCreateConfigGenerator');
const CCDWorkBasketInputGenerator = require('./ccdCaseConfig/workBasketInputGenerator');
const CCDSearchInputGenerator = require('./ccdCaseConfig/searchInputGenerator');

const caseDetailsData = require('./caseDetails_data');

class CCDApi{

    constructor(){
        this.setDefaultData();
    }

    getDetailsMockData(){
        return JSON.parse(JSON.stringify(caseDetailsData));
    }

    setDefaultData(){
        this.caseDetailsResponse = JSON.parse(JSON.stringify(caseDetailsData));
        this.caseList = this.getWorkbasketCases();
    }

    getCaseDetailsWithID(caseId){
        this.caseDetailsResponse.case_id = caseId;
        this.caseDetailsResponse['_links'].self.href = "http://ccd-data-store-api-demo.service.core-compute-demo.internal/internal/cases/" + caseId;
        for (const metaDatField of this.caseDetailsResponse.metadataFields){
            if (metaDatField.id === '[CASE_REFERENCE]'){
                metaDatField.value = caseId;
                break;
            }
        }
        return this.caseDetailsResponse
    }

    getJurisdictions(){
        return caseworkerJurisdictions;
    }

    getWorkbasketInputs(jurisdiction){
        let workbasketInputs = publicLaw;
        switch (jurisdiction){
            case 'DIVORCE':
                workbasketInputs = divorce;
                break;
            case 'GrantOfRepresentation':
                workbasketInputs = probate;
                break;
            case 'Asylum':
                workbasketInputs = ia;
                break
            case 'TRIB_MVP_3_TYPE':
                workbasketInputs = publicLaw;
                break;
        }
        return workbasketInputs;
    }

    getsearchCaseInputs(jurisdiction){
        let searchInputs = publicLaw;
        switch (jurisdiction){
            case 'DIVORCE':
                searchInputs = divorce;
                break;
            case 'GrantOfRepresentation':
                searchInputs = probate;
                break;
            case 'Asylum':
                searchInputs = ia;
                break
            case 'TRIB_MVP_3_TYPE':
                searchInputs = publicLaw;
                break;
        }
        return searchInputs;
    }

    getSolicitorCreateCaseConfig(caseType,event){
        if (caseType === 'DIVORCE'){
            return divorceCreateCaseConfig;
       }
        if (caseType === 'FinancialRemedyMVP2' && event === 'FR_solicitorCreate'){
            return frConsentedCreaCaseConfig;
       }
        if (caseType === 'FinancialRemedyContested' && event === 'FR_solicitorCreate') {
            return frContestedCreaCaseConfig;
        }

        if (caseType === 'GrantOfRepresentation' && event === 'solicitorCreateApplication') {
            return probateGrantOfRepresentationConfig;
        }

        if (caseType === 'Caveat' && event === 'solicitorCreateCaveat') {
            return probateCreateCaveatConfig;
        }

        if (caseType === 'Asylum' && event === 'startAppeal') {
            return iaCreateConfig;
        }



        if (caseType === 'TRIB_MVP_3_TYPE' && event === 'initiateCase') {
            return fplTribunalConfig;
        }

        if (caseType === 'CARE_SUPERVISION_EPO' && event === 'openCase') {
            return fplCareSupervisionConfig;
        }

        if (caseType === 'casetype_1' ) {
            return exuiTestCaseType;
        }
    }

    getSingleFieldCaseEventConfig(eventId) {
        const customCase = new CCDCaseConfig("testCaseType", "Test jurisdiction", "test description");
        customCase.addWizardPage("testPage1", "Test Page 1");
        switch (eventId) {
            case "text":
                customCase.addCaseField({ id: "tesxt", type: "Text", label: "Text field", value: "Sample test text value ABC" })
                break;
            case "dynamicList":
                const listItems = [
                    { "code": "item1", "label": "Item 1" },
                    { "code": "item2", "label": "Item 2" },
                    { "code": "item3", "label": "Item 3" },
                ];

                customCase.addCaseField({
                    label: "test field won label", type: "DynamicList", id: "dynamicListField", value: { "value": listItems[2], "list_items": listItems }
                })
                customCase.addCaseField({
                    type: "Complex", id: "dynamicListInComplexField", complex_fields: [
                        { type: "DynamicList", id: "dynamicListField", label: "Field Dynamic list" }
                    ]
                    , value: { "dynamicListField": { "value": listItems[2], "list_items": listItems } }
                })
                break;
            case "test":
                return this.getCustomCase();
                break;
            default:
                return mockEvents[eventId]();

        }

        return customCase.getCase();
    }

    getWorkbasketInputs(){
        const ccdWorkBasketInputGenerator = new CCDWorkBasketInputGenerator();
        return ccdWorkBasketInputGenerator
            .addField({ id: "simpletext", type: "Text", label: "Simple text input" })
            .addField({ id: "radioInput", type: "FixedRadioList", label: "Simple Radio input", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })
            .addField({ id: "radioYesorNo", type: "YesOrNo", label: "Simple Yes or No input" })
            .addField({ id: "fixedListItem", type: "FixedList", label: "fixed listinput", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })
            .addField({ id: "multiSelectItem", type: "MultiSelectList", label: "Multi select input", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })

            .getConfig();
    }

    getsearchCaseInputs(){
        const ccdSearchInputGenerator = new CCDSearchInputGenerator();
        return ccdSearchInputGenerator
            .addField({ id: "simpletext", type: "Text", label: "Simple text input" })
            .addField({ id: "radioInput", type: "FixedRadioList", label: "Simple Radio input", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })
            .addField({ id: "radioYesorNo", type: "YesOrNo", label: "Simple Yes or No input" })
            .addField({ id: "fixedListItem", type: "FixedList", label: "fixed listinput", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })
            .addField({ id: "multiSelectItem", type: "MultiSelectList", label: "Multi select input", list: [{ code: "a", label: "A" }, { code: "b", label: "B" }, { code: "c", label: "C" }] })

            .getConfig();
    }

    getCustomCase(){
            const job = {
                id: "TextField0", type: "Complex", label: "Text Field 0",
                complex_fields: [
                    { id: "Title", type: "Text", label: "Title" },
                    { id: "Description", type: "Text", label: "Description" },
                ]
            };

            const personFields = [
                { id: "Title", type: "Text", label: "Title" },
                { id: "FirstName", type: "Text", label: "First Name" },
                { id: "LastName", type: "Text", label: "Last name" },
                { id: "MaidenName", type: "Text", label: "Maiden Name" },
                {
                    id: "Gender", type: "FixedRadioList", label: "Select your gender",
                    list: [{ code: "male", label: "Male" }, { code: "female", label: "Female" }, { code: "notGiven", label: "Not given" }]
                },
                job
            ];;

            const customCase = new CCDCaseConfig("testCaseType", "Test jurisdiction", "test description");

            return customCase
                .setEventProps({show_summary: true})
                .addWizardPage("testPage1", "Test Page 1")
                    .addCaseField({ id: "TextField0", type: "Text", label: "Text Field 0" })
                    .addCaseField({ id: "TextField1", type: "Text", label: "Text Field 1" })
                        .setFieldProps({ show_condition: 'TextField0!="Hide TextField1" AND TextField0!="Hide all"' })
                    .addCaseField({ id: "TextField2", type: "Text", label: "Text Field 2" })
                        .setFieldProps({ show_condition: 'TextField0!="Hide TextField2" AND TextField0!="Hide all"' })
                    .addCaseField({ id: "TextField3", type: "Text", label: "Text Field 3" })

                .addWizardPage("testPage2", "Test Page 2")
                    .addCaseField({
                        id: "Gender", type: "FixedRadioList", label: "Select your gender",
                        list: [{ code: "male", label: "Male" }, { code: "female", label: "Female" }, { code: "notGiven", label: "Not given" }]
                    })
                        .setFieldProps({ show_condition: 'TextField0!="Hide all"' })
                    .addCaseField({
                        id: "optionsMultiVal", type: "FixedList", label: "Select all that match",
                        list: [{ code: "a", label: "Option A" }, { code: "b", label: "Option B" }, { code: "c", label: "Option c" }]
                    })
                    .addCaseField({ id: "person1", type: "Complex", label: "Person 1", complex_fields: personFields })
                        .setFieldProps({ show_condition: 'TextField0!="Hide all"' })
                    .addCaseField({ id: "person2", type: "Complex", label: "Person 2", complex_fields: personFields })
                        .setFieldProps({ show_condition: 'TextField0!="Hide all"' })
                    .addCaseField({ id: "people", type: "Collection", label: "People", collection_field_type: { id: "person2", type: "Complex", label: "Person 2", complex_fields: personFields } })
                        .setFieldProps({ show_condition: 'TextField0!="Hide all"' })
                .getCase();


    }


    getWorkbasketCases() {
        let cols = [{
            "label": "Case reference",
            "order": 1,
            "metadata": true,
            "case_field_id": "[CASE_REFERENCE]",
            "case_field_type": {
                "id": "Number",
                "type": "Number",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        },
        {
            "label": "Your reference",
            "order": 2,
            "metadata": false,
            "case_field_id": "solsSolicitorAppReference",
            "case_field_type": {
                "id": "solsSolicitorAppReference-1dfb2a37-bfdf-4ff8-a174-41de34b4598a",
                "type": "Text",
                "min": null,
                "max": 100,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        },
        {
            "label": "First name(s) of deceased",
            "order": 3,
            "metadata": false,
            "case_field_id": "deceasedForenames",
            "case_field_type": {
                "id": "deceasedForenames-bae1ec6b-5cd4-41a2-bd4d-89258d36421e",
                "type": "Text",
                "min": 1,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        },
        {
            "label": "Last name(s) of deceased",
            "order": 4,
            "metadata": false,
            "case_field_id": "deceasedSurname",
            "case_field_type": {
                "id": "deceasedSurname-4af50392-b07a-40a8-9e8a-e310faddb800",
                "type": "Text",
                "min": 1,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        },
        {
            "label": "Date of death",
            "order": 5,
            "metadata": false,
            "case_field_id": "deceasedDateOfDeath",
            "case_field_type": {
                "id": "Date",
                "type": "Date",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        },
        {
            "label": "Case printed",
            "order": 6,
            "metadata": false,
            "case_field_id": "casePrinted",
            "case_field_type": {
                "id": "FixedList-casePrintedTypes",
                "type": "FixedList",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [
                    {
                        "code": "Yes",
                        "label": "Yes",
                        "order": null
                    }
                ],
                "complex_fields": [],
                "collection_field_type": null
            },
            "display_context_parameter": null
        }
        ];

        let rows = [];
        for (let rowCounter = 0; rowCounter < 25; rowCounter++) {
            rows.push({
                "supplementary_data" : null,
                "case_id": "0_157125441721456" + rowCounter,
                "case_fields": {
                    "solsConfirmSignSOT2": "You will sign a statement of truth on your client’s behalf.",
                    "solsConfirmSignSOT3": "The executor believes that all the information stated in the legal statement is true. They have authorised ${solsSolicitorFirmName} to sign a statement of truth on their behalf.",
                    "immovableEstateInfo": "You are unable to apply online unless the estate in England and Wales consists wholly of immovable property.",
                    "solicitorMainApplicantInfo": "You cannot apply for letters of administration if you are a solicitor applying as an executor.",
                    "solsSolicitorPhoneNumber": "07963732122",
                    "[LAST_STATE_MODIFIED_DATE]": null,
                    "solsConfirmSignSOT1": "You won’t be able to make changes to the legal statement and declaration after continuing.",
                    "solsDiedOrNotApplyingInfo": "You can’t use this service if an executor/residuary legatee/devisee in trust is alive or applying.",
                    "solsLifeInterestInfo": "You can’t use this service if there is a life interest in respect of the estate.",
                    "solsBeforeSubmitPage": "* Check the information you've given. You can do this on the next pagesn* Review the legal statement and declarationn* Get authorisation from your client to confirm and sign the statement of truth on their behalf",
                    "solsEntitledMinorityInfo": "You can’t use this service if there is a beneficiary under the age of 18.",
                    "[CASE_REFERENCE]": "1_157125441721456 " + rowCounter,
                    "solsStartPage": "# Check you can use this service to apply for a grant.",
                    "[STATE]": "SolAppCreated",
                    "solsSolicitorFirmName": "3ewq",
                    "solsResiduaryInfo": "You can’t use this service if you are not named in the will as a residuary legatee or devisee.",
                    "solsSolicitorEmail": "wdwedwe@gmail.com",
                    "solsMinorityInterestInfo": "You can’t use this service if there is a minority interest.",
                    "solsApplicantSiblingsInfo": "You can’t use this service if the applicant has any siblings.",
                    "deceasedNameSection": "### What's the full name of the deceased? nUse the name on the death certificate",
                    "solsIht400extraInfo": "You'll need to send a stamped (receipted) IHT 421 with this application.",
                    "solsExecutorInfoSection": "Enter all executors named in the will. Only 4 lay executors can apply.",
                    "[JURISDICTION]": "PROBATE",
                    "[CREATED_DATE]": "2019-10-16T19:33:37.257",
                    "solsApplicantNameSection": "## Applicant name",
                    "solsSolicitorAddress": {
                        "County": "",
                        "Country": "United Kingdom",
                        "PostCode": "SW20 0D",
                        "PostTown": "Livingston",
                        "AddressLine1": "69 Haymarket Crescent",
                        "AddressLine2": "",
                        "AddressLine3": ""
                    },
                    "solsReviewLegalStatement2": "You can print the legal statement and declaration and ask your client to sign it for your own records. A photocopy of the signed statement should be submitted along with your evidence in support. nIf you are providing a notarial copy or a court sealed copy of the will please also provide a cover letter with the application indicating where the original will is and why it cannot be released.",
                    "solsReviewLegalStatement1": "This is the legal statement and declaration for you and your client to review. If there are no changes, your client can authorise you to declare on their behalf.",
                    "[SECURITY_CLASSIFICATION]": "PUBLIC",
                    "englishWillNo": "A translation will be required.",
                    "[CASE_TYPE]": "GrantOfRepresentation",
                    "solsSolicitorAppReference": "wdew",
                    "noProofEntitlement": "The will is not entitled to proof in England and Wales.",
                    "[LAST_MODIFIED_DATE]": "2020-07-23T15:19:16.093575"
                },
                "case_fields_formatted": {
                    "solsConfirmSignSOT2": "You will sign a statement of truth on your client’s behalf.",
                    "solsConfirmSignSOT3": "The executor believes that all the information stated in the legal statement is true. They have authorised ${solsSolicitorFirmName} to sign a statement of truth on their behalf.",
                    "immovableEstateInfo": "You are unable to apply online unless the estate in England and Wales consists wholly of immovable property.",
                    "solicitorMainApplicantInfo": "You cannot apply for letters of administration if you are a solicitor applying as an executor.",
                    "solsSolicitorPhoneNumber": "07963732122",
                    "[LAST_STATE_MODIFIED_DATE]": null,
                    "solsConfirmSignSOT1": "You won’t be able to make changes to the legal statement and declaration after continuing.",
                    "solsDiedOrNotApplyingInfo": "You can’t use this service if an executor/residuary legatee/devisee in trust is alive or applying.",
                    "solsLifeInterestInfo": "You can’t use this service if there is a life interest in respect of the estate.",
                    "solsBeforeSubmitPage": "* Check the information you've given. You can do this on the next pagesn* Review the legal statement and declarationn* Get authorisation from your client to confirm and sign the statement of truth on their behalf",
                    "solsEntitledMinorityInfo": "You can’t use this service if there is a beneficiary under the age of 18.",
                    "[CASE_REFERENCE]": "2_157125441721456 " + rowCounter,
                    "solsStartPage": "# Check you can use this service to ap.",
                    "[STATE]": "SolAppCreated",
                    "solsSolicitorFirmName": "3ewq",
                    "solsResiduaryInfo": "You can’t use this sisee.",
                    "solsSolicitorEmail": "wdwedwe@gmail.com",
                    "solsMinorityInterestInfo": "You can’t use this service if there is a minority interest.",
                    "solsApplicantSiblingsInfo": "You can’t use this service if the applicant has any siblings.",
                    "deceasedNameSection": "### What's the full namn the death certificate",
                    "solsIht400extraInfo": "You'll need to send a stamped (receipted) IHT 421 with this application.",
                    "solsExecutorInfoSection": "Enter all executors named in the will. Only 4 lay executors can apply.",
                    "[JURISDICTION]": "PROBATE",
                    "[CREATED_DATE]": "2019-10-16T19:33:37.257",
                    "solsApplicantNameSection": "## Applicant name",
                    "solsSolicitorAddress": {
                        "County": "",
                        "Country": "United Kingdom",
                        "PostCode": "SW20 0D",
                        "PostTown": "Livingston",
                        "AddressLine1": "69 Haymarket Crescent",
                        "AddressLine2": "",
                        "AddressLine3": ""
                    },
                    "solsReviewLegalStatement2": "You can print the legal statement and declaration and ask your client to sign it for your own records. A photocopy of the signed statement should be submitted along with your evidence in support. nIf you are providing a notarial copy or a court sealed copy of the will please also provide a cover letter with the application indicating where the original will is and why it cannot be released.",
                    "solsReviewLegalStatement1": "This is the legal statement and declaration for you and your client to review. If there are no changes, your client can authorise you to declare on their behalf.",
                    "[SECURITY_CLASSIFICATION]": "PUBLIC",
                    "englishWillNo": "A translation will be required.",
                    "[CASE_TYPE]": "GrantOfRepresentation",
                    "solsSolicitorAppReference": "wdew",
                    "noProofEntitlement": "The will is not entitled to proof in England and Wales.",
                    "[LAST_MODIFIED_DATE]": "2020-07-23T15:19:16.093575"
                }
            });
        }
        return { columns: cols, results: rows, total: 1200 };
    }


    getCaseActivity(cases){
        let caseIds = cases.split(',');
        let caseActivities = [];
        for (const caseid in caseIds){
            caseActivities.push({
                "caseId": caseid,
                "viewers": [],
                "unknownViewers": 0,
                "editors": [],
                "unknownEditors": 0
            });
        }
    }


}

module.exports = new CCDApi();


const listItems = [
    {
        "code": "item1",
        "label": "Item 1"
    },
    {
        "code": "item2",
        "label": "Item 2"
    },
    {
        "code": "item3",
        "label": "Item 3"
    }
]
const mockEvents = {
    "complexDynamicList": () =>{
        const caseConfig = new CCDCaseConfig('TEST_CaseType', 'Dynamic list tests', 'Dynamic list tests');

        const dynamicListVal = { "value": listItems[2], "list_items": listItems };

        return caseConfig
            .setEventProps({})
            .addWizardPage("simpleDynamicList", "Root level dynamic list")
            .addCaseField({ id: "testDynamicList", type: "DynamicList", label: "Sample Dynamic List", value: dynamicListVal })
            // .addWizardPage("complexFieldDynamicList", "Complex field level dynamic list")
            .addCaseField({
                id: "complexWithDynamicList", type: "Complex", label: "Comples having dynamic list", value: { "testComplexDynamicList": dynamicListVal }, complex_fields: [
                    { id: "testComplexDynamicList", type: "DynamicList", label: "Complex Dynamic List", }
                ]
            })
            .getCase();
    },


    "collectionDynamicList": () => {
        const caseConfig = new CCDCaseConfig('TEST_CaseType', 'Dynamic list tests', 'Dynamic list tests');

        return caseConfig
            .setEventProps({})
            .addWizardPage("simpleDynamicList", "Root level dynamic list")
            .addCaseField({ id: "testDynamicList", type: "DynamicList", label: "Sample Dynamic List", value: { "value": listItems[2], "list_items": listItems } })
                    .setFieldProps({ display_context_parameter: "#COLLECTION(allowInsert,allowDelete)" })
                .addCaseField({
                    id: "collectionDYnamicList", type: "Collection", label: "Collection DL",
                    collection_field_type: { id: "testCollectionDynamicList", type: "DynamicList", label: "Collection Dynamic List", },
                    value: [
                        { id:1, value : { "value": listItems[2], "list_items": listItems }},
                        { id: 1, value:{ "value": listItems[1], "list_items": listItems }}
                    ]
                })
                    .setFieldProps({ display_context_parameter: "#COLLECTION(allowInsert,allowDelete)"})
            .getCase();
    }
};






