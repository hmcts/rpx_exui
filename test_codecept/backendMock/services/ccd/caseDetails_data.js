const caseFileViewTabConfig = require('./caseFileViewTabConfig')

class CaseDetailsData{
    constructor(){
        this.data = getTemplate();
        this.defaultCase = JSON.parse(JSON.stringify(this.data));
        this.hearingCase = JSON.parse(JSON.stringify(this.data));
        this.qmCase = JSON.parse(JSON.stringify(this.data));
        this.caseFileViewCase = JSON.parse(JSON.stringify(this.data));

        this.setupHearingCase()
        this.setupDefaultCase()
        this.setupCaseFileViewCase();
        this.setupQMCase()
    }

    setCaseId(data,id){
        data.case_id = id
       
    }

    setupQMCase(){
        this.setCaseTypeProperties(this.qmCase, {
            id: 'Asylum',
            name: 'Immigration & Asylum'
        })
        this.addTrigger(this.qmCase, {
            id:'queryManagementRaiseQuery', name:'Raise a query'
        })
        this.addTab(this.qmCase, { id: '1', label: 'Queries' })
        this.addFieldToTab(this.qmCase, '1', {
            id: 'test', label: 'test field', value: 'test val',
            field_type: { id: 'Text', type: 'Text' }
        })
        this.addFieldToTab(this.qmCase, '1', {
            id: 'test1', label: 'test field 2', value: 'No',
            field_type: { id: 'yesNo', type: 'YesOrNo' }
        })
    }

    setupHearingCase(){
        this.setCaseTypeProperties(this.hearingCase, {
            id: 'PRLAPPS',
            name: 'Immigration & Asylum',
            "jurisdiction.id": 'PRIVATELAW'
        })
      
    }

    setupCaseFileViewCase() {
        this.setCaseTypeProperties(this.caseFileViewCase, {
            id: 'PRLAPPS',
            name: 'Immigration & Asylum',
            "jurisdiction.id": 'PRIVATELAW'
        })

        this.caseFileViewCase.tabs.push(caseFileViewTabConfig);
    }


    setupDefaultCase(){
        this.setCaseTypeProperties(this.defaultCase,{
            id: 'PRLAPPS',
            name: 'test case type',
            "jurisdiction.id": 'PRIVATELAW'
        })
        this.addTab(this.defaultCase,{ id: '1', label: 'ngIntegration mock data' })
        this.addFieldToTab(this.defaultCase, '1', {
            id: 'test', label: 'test field', value: 'test val',
            field_type: { id: 'Text', type: 'Text' }
        })
        this.addFieldToTab(this.defaultCase,'1', {
            id: 'test1', label: 'test field 2', value: 'No',
            field_type: { id: 'yesNo', type: 'YesOrNo' }
        })
    }

    setCaseTypeProperties(data, props){
        for(const prop of Object.keys(props)){
            if (prop.startsWith("jurisdiction.")){
                data.case_type.jurisdiction[prop.replace('jurisdiction.', '')] = props[prop]
            } else if (prop.startsWith("case_type.")){
                data.case_type[prop.replace('case_type.','')] = props[prop]
            }else{
                data.case_type[prop] = props[prop]
            }
        }
    }

    addTab(data, props){
        data.tabs.push({
            "id": props.id ? props.id : "overview",
            "label": props.label ? props.label : "Overview",
            "order": props.order ? props.order : 15,
            "fields": [],
            "role": props.role ? props.role : null,
            "show_condition": props.show_condition ? props.show_condition : null
        })
    }

    addFieldToTab(data,tabId, fieldConfig){
        const tab = data.tabs.find(t => t.id === tabId)

        tab.fields.push(this.getCaseField(fieldConfig));
    }

    addTrigger(data, props){
        data.triggers.push({
            "id": props.id ? props.id : "FR_applicationPaymentSubmission",
            "name": props.name ? props.name : "Case Submission",
            "description": props.description ? props.description : "Case Submission",
            "order": props.order ? props.order : 2
        })
    }

    getCaseField(props){
        return {
            "id": props.id ? props.id : "payment",
            "label": props.label ? props.label : "#### PAYMENT DETAILS",
            "hidden": props.hidden ? props.hidden : null,
            "value": props.value ? props.value : null,
            "metadata": false,
            "hint_text": props.hint_text ? props.hint_text : null,
            "field_type": {
                "id": props.field_type.id ? props.field_type.id : "Label",
                "type": props.field_type.type ? props.field_type.type : "Label",
                "min": props.field_type.min ? props.field_type.min : null,
                "max": props.field_type.max ? props.field_type.max : null,
                "regular_expression": props.field_type.regular_expression ? props.field_type.regular_expression : null,
                "fixed_list_items": [],
                "complex_fields": [],
                "collection_field_type": props.field_type.collection_field_type ? props.field_type.collection_field_type :null
            },
            "validation_expr": props.validation_expr ? props.validation_expr : null,
            "security_label": "PUBLIC",
            "order": props.order ? props.order : 1,
            "formatted_value": props.formatted_value ? props.formatted_value : null,
            "display_context": props.display_context ? props.display_context : null,
            "display_context_parameter": props.display_context_parameter ? props.display_context_parameter : null,
            "show_condition": props.show_condition ? props.show_condition : null,
            "show_summary_change_option": props.show_summary_change_option ? props.show_summary_change_option : null,
            "show_summary_content_option": props.show_summary_content_option ? props.show_summary_content_option : null,
            "retain_hidden_value": props.retain_hidden_value ? props.retain_hidden_value : null,
            "acls": [
                {
                    "role": "caseworker-divorce-financialremedy",
                    "create": true,
                    "read": true,
                    "update": false,
                    "delete": false
                },
                {
                    "role": "caseworker-divorce-financialremedy-courtadmin",
                    "create": false,
                    "read": true,
                    "update": false,
                    "delete": false
                },
                {
                    "role": "caseworker-divorce-financialremedy-solicitor",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false
                },
                {
                    "role": "caseworker-divorce-financialremedy-judiciary",
                    "create": true,
                    "read": true,
                    "update": false,
                    "delete": false
                }
            ],
            "default_value": props.default_value ? props.default_value : null
        }
    }

}

module.exports = new CaseDetailsData();

function getTemplate(){
    return {
        "_links": {
            "self": {
                "href": "http://ccd-data-store-api-demo.service.core-compute-demo.internal/internal/cases/1604309496714935"
            }
        },
        "case_id": "1604309496714935",
        "case_type": {
            "id": "Asylum",
            "name": "Immigration & Asylum",
            "description": "IA test casey",
            "jurisdiction": {
                "id": "IA",
                "name": "mmigration & Asylum",
                "description": "mmigration & Asylum"
            },
            "printEnabled": false
        },
        "tabs": [
            {
                "id": "overview",
                "label": "Overview",
                "order": 15,
                "fields": [
                    {
                        "id": "divorceCaseNumber",
                        "label": "Divorce Case Number",
                        "hidden": null,
                        "value": "BV18D00152",
                        "metadata": false,
                        "hint_text": "Enter 10 character alphanumeric divorce case number",
                        "field_type": {
                            "id": "divorceCaseNumber-cd9c8be6-d93d-444c-9291-3e27981e0dd8",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": "^([A-Z|a-z][A-Z|a-z])\\d{2}[D|d]\\d{5}$",
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": "^([A-Z|a-z][A-Z|a-z])\\d{2}[D|d]\\d{5}$",
                        "security_label": "PUBLIC",
                        "order": 10,
                        "formatted_value": "BV18D00152",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantDetails",
                        "label": "#### APPLICANT DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantFMName",
                        "label": "Current First and Middle names",
                        "hidden": null,
                        "value": "Madaline Wheeler",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 2,
                        "formatted_value": "Madaline Wheeler",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantLName",
                        "label": "Current Last Name",
                        "hidden": null,
                        "value": "Norman",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": "Norman",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "rRespondentLabel",
                        "label": "#### RESPONDENT DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 4,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentFMName",
                        "label": "Current First and Middle names",
                        "hidden": null,
                        "value": "Wilma Richardson",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 5,
                        "formatted_value": "Wilma Richardson",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentLName",
                        "label": "Current Last Name",
                        "hidden": null,
                        "value": "Hurst",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 6,
                        "formatted_value": "Hurst",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentRep",
                        "label": "Is the respondent represented ?",
                        "hidden": null,
                        "value": "No",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "YesOrNo",
                            "type": "YesOrNo",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 7,
                        "formatted_value": "No",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "caseDetailsLa",
                        "label": "#### CASE DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 8,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "PaymentDetails",
                "label": "Payment details",
                "order": 9,
                "fields": [
                    {
                        "id": "payment",
                        "label": "#### PAYMENT DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": "amountToPay=\"5000\" OR paperApplication=\"Yes\""
            },
            {
                "id": "applicationDetails",
                "label": "Nature of Application",
                "order": 5,
                "fields": [
                    {
                        "id": "provisionMadeForLabel",
                        "label": "#### PROVISION MADE FOR",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantIntendsToLabel",
                        "label": "#### THE APPLICANT INTENDS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "dischargePeriodicalPaymentSubstituteForLabel",
                        "label": "#### DISCHARGE A PERIODICAL PAYMENTS ORDER AND TO SUBSTITUTE FOR IT",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 17,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applyingForConsentOrderLabel",
                        "label": "#### APPLYING FOR A CONSENT ORDER?",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 19,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "natureOfApplication1",
                        "label": "#### NATURE OF THE APPLICATION",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 5,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "natureOfApplication2",
                        "label": "The application is for:",
                        "hidden": null,
                        "value": [
                            "Lump Sum Order",
                            "Property Adjustment Order",
                            "A settlement or a transfer of property",
                            "Periodical Payment Order",
                            "Pension Sharing Order",
                            "Pension Compensation Sharing Order",
                            "Pension Attachment Order",
                            "Pension Compensation Attachment Order"
                        ],
                        "metadata": false,
                        "hint_text": "The applicant is applying for an order by consent in terms of written agreement (a consent order). Within the draft consent order, the Applicant is applying to Court for;",
                        "field_type": {
                            "id": "MultiSelectList-FR_ms_natureApplication",
                            "type": "MultiSelectList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "Lump Sum Order",
                                    "label": "Lump Sum Order",
                                    "order": "1"
                                },
                                {
                                    "code": "Property Adjustment Order",
                                    "label": "Property Adjustment Order",
                                    "order": "2"
                                },
                                {
                                    "code": "A settlement or a transfer of property",
                                    "label": "A settlement or a transfer of property for the benefit of the child(ren)",
                                    "order": "3"
                                },
                                {
                                    "code": "Periodical Payment Order",
                                    "label": "Periodical Payment Order",
                                    "order": "4"
                                },
                                {
                                    "code": "Pension Sharing Order",
                                    "label": "Pension Sharing Order",
                                    "order": "5"
                                },
                                {
                                    "code": "Pension Compensation Sharing Order",
                                    "label": "Pension Compensation Sharing Order",
                                    "order": "6"
                                },
                                {
                                    "code": "Pension Attachment Order",
                                    "label": "Pension Attachment Order",
                                    "order": "7"
                                },
                                {
                                    "code": "Pension Compensation Attachment Order",
                                    "label": "Pension Compensation Attachment Order",
                                    "order": "8"
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 6,
                        "formatted_value": [
                            "Lump Sum Order",
                            "Property Adjustment Order",
                            "A settlement or a transfer of property",
                            "Periodical Payment Order",
                            "Pension Sharing Order",
                            "Pension Compensation Sharing Order",
                            "Pension Attachment Order",
                            "Pension Compensation Attachment Order"
                        ],
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "natureOfApplication3a",
                        "label": "Address details",
                        "hidden": null,
                        "value": "Distinctio Minus do",
                        "metadata": false,
                        "hint_text": "If the application includes an application for a Property Adjustment Order in relation to land, please provide the address(es) of the property or properties, if applicable",
                        "field_type": {
                            "id": "TextArea",
                            "type": "TextArea",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 7,
                        "formatted_value": "Distinctio Minus do",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "natureOfApplication3b",
                        "label": "Mortgage details",
                        "hidden": null,
                        "value": "Lorem atque repellen",
                        "metadata": false,
                        "hint_text": "If the application includes an application for a Property Adjustment Order in relation to land, please provide the name(s) and address(es) of any mortgagee(s), if applicable",
                        "field_type": {
                            "id": "TextArea",
                            "type": "TextArea",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 8,
                        "formatted_value": "Lorem atque repellen",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "natureOfApplication4",
                        "label": "#### ORDER FOR CHILDREN",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 9,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "orderForChildrenQuestion1",
                        "label": "Does the application contain any application for periodical payments, or secured periodical payments for children?",
                        "hidden": null,
                        "value": "No",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "YesOrNo",
                            "type": "YesOrNo",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 10,
                        "formatted_value": "No",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "CaseHistoryViewer",
                "label": "History",
                "order": 1,
                "fields": [
                    {
                        "id": "CaseHistoryViewer",
                        "label": "CaseHistoryViewer",
                        "hidden": null,
                        "value": [
                            {
                                "id": 155533,
                                "timestamp": "2020-11-02T09:31:36.793313",
                                "summary": "",
                                "comment": "",
                                "event_id": "FR_solicitorCreate",
                                "event_name": "Consent Order Application",
                                "user_id": "72f16776-4ff9-4f5a-8b65-860e499bd24e",
                                "user_last_name": "Parker",
                                "user_first_name": "Peter",
                                "state_name": "Application Drafted",
                                "state_id": "caseAdded",
                                "significant_item": null
                            }
                        ],
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "CaseHistoryViewer",
                            "type": "CaseHistoryViewer",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": [
                            {
                                "id": 155533,
                                "timestamp": "2020-11-02T09:31:36.793313",
                                "summary": "",
                                "comment": "",
                                "event_id": "FR_solicitorCreate",
                                "event_name": "Consent Order Application",
                                "user_id": "72f16776-4ff9-4f5a-8b65-860e499bd24e",
                                "user_last_name": "Parker",
                                "user_first_name": "Peter",
                                "state_name": "Application Drafted",
                                "state_id": "caseAdded",
                                "significant_item": null
                            }
                        ],
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-systemupdate",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "authorisation",
                "label": "Authorisation",
                "order": 6,
                "fields": [
                    {
                        "id": "authorisationLa",
                        "label": "#### AUTHORISATION",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "authorisation1",
                        "label": "# I am duly authorised by the Applicant to complete this application.",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 2,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "divorceAbout_F1",
                        "label": "***************",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 7,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": "amountToPay=\"5000\" OR paperApplication=\"Yes\""
            },
            {
                "id": "applicantDetails",
                "label": "Applicant",
                "order": 2,
                "fields": [
                    {
                        "id": "applicantRepresentedLabel",
                        "label": "## Is the Applicant represented ? ##",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 29,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantRepresented",
                        "label": "",
                        "hidden": null,
                        "value": "Yes",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "YesOrNo",
                            "type": "YesOrNo",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 30,
                        "formatted_value": "Yes",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": false,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantContactLabel",
                        "label": "#### Applicant’s Contact details",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 31,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"No\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorAbout_Para-1",
                        "label": "#### SOLICITOR DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": "Create an application for financial remedy by consent",
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 36,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorName",
                        "label": "Solicitor’s name",
                        "hidden": null,
                        "value": "Baker Ramsey",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 37,
                        "formatted_value": "Baker Ramsey",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorFirm",
                        "label": "Name of your firm",
                        "hidden": null,
                        "value": "Nolan Avila",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 38,
                        "formatted_value": "Nolan Avila",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorReference",
                        "label": "Your reference",
                        "hidden": null,
                        "value": "Adipisci eu reprehen",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 39,
                        "formatted_value": "Adipisci eu reprehen",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorAddress",
                        "label": "Your address",
                        "hidden": null,
                        "value": {
                            "County": "",
                            "Country": "United Kingdom",
                            "PostCode": "E11 3EJ",
                            "PostTown": "London",
                            "AddressLine1": "22 Lancaster Road",
                            "AddressLine2": "",
                            "AddressLine3": ""
                        },
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "AddressUK",
                            "type": "Complex",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [
                                {
                                    "id": "AddressLine1",
                                    "label": "Building and Street",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax150",
                                        "type": "Text",
                                        "min": null,
                                        "max": 150,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "AddressLine2",
                                    "label": "Address Line 2",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "AddressLine3",
                                    "label": "Address Line 3",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "PostTown",
                                    "label": "Town or City",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "County",
                                    "label": "County",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "PostCode",
                                    "label": "Postcode/Zipcode",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax14",
                                        "type": "Text",
                                        "min": null,
                                        "max": 14,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "Country",
                                    "label": "Country",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                }
                            ],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 40,
                        "formatted_value": {
                            "County": "",
                            "Country": "United Kingdom",
                            "PostCode": "E11 3EJ",
                            "PostTown": "London",
                            "AddressLine1": "22 Lancaster Road",
                            "AddressLine2": "",
                            "AddressLine3": ""
                        },
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorPhone",
                        "label": "Phone Number",
                        "hidden": null,
                        "value": "+1 (996) 797-8283",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 41,
                        "formatted_value": "+1 (996) 797-8283",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorEmail",
                        "label": "Email",
                        "hidden": null,
                        "value": "tafynu@mailinator.com",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Email",
                            "type": "Email",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 42,
                        "formatted_value": "tafynu@mailinator.com",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorDXnumber",
                        "label": "DX number",
                        "hidden": null,
                        "value": "867",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 43,
                        "formatted_value": "867",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "solicitorAgreeToReceiveEmails",
                        "label": "Future email communications",
                        "hidden": null,
                        "value": "Yes",
                        "metadata": false,
                        "hint_text": "I confirm I am willing to accept service of all correspondence and orders by email at the email address stated above.",
                        "field_type": {
                            "id": "YesOrNo",
                            "type": "YesOrNo",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 44,
                        "formatted_value": "Yes",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "applicantRepresented=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantDetails",
                        "label": "#### APPLICANT DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 2,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantFMName",
                        "label": "Current First and Middle names",
                        "hidden": null,
                        "value": "Madaline Wheeler",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": "Madaline Wheeler",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "applicantLName",
                        "label": "Current Last Name",
                        "hidden": null,
                        "value": "Norman",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 4,
                        "formatted_value": "Norman",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "regionList",
                        "label": "Please choose the Region in which the Applicant resides",
                        "hidden": null,
                        "value": "midlands",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "FixedList-FR_region_list",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "wales",
                                    "label": "Wales",
                                    "order": null
                                },
                                {
                                    "code": "southwest",
                                    "label": "South West",
                                    "order": null
                                },
                                {
                                    "code": "southeast",
                                    "label": "South East",
                                    "order": null
                                },
                                {
                                    "code": "northeast",
                                    "label": "North East",
                                    "order": null
                                },
                                {
                                    "code": "northwest",
                                    "label": "North West",
                                    "order": null
                                },
                                {
                                    "code": "london",
                                    "label": "London",
                                    "order": null
                                },
                                {
                                    "code": "midlands",
                                    "label": "Midlands",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 5,
                        "formatted_value": "midlands",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "midlandsFRCList",
                        "label": "This should be the FRC local to the applicant",
                        "hidden": null,
                        "value": "birmingham",
                        "metadata": false,
                        "hint_text": "This should be the FRC local to the applicant",
                        "field_type": {
                            "id": "FixedList-FR_midlands_frc_list",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "birmingham",
                                    "label": "Birmingham FRC",
                                    "order": null
                                },
                                {
                                    "code": "nottingham",
                                    "label": "Nottingham FRC",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 6,
                        "formatted_value": "birmingham",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "regionList=\"midlands\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "birminghamCourtList",
                        "label": "Where is the Applicant’s Local Court?",
                        "hidden": null,
                        "value": "FR_birminghamList_9",
                        "metadata": false,
                        "hint_text": "Please give the name of the Court which is closest to the Applicants home postcode. If you are unsure, please check on http://courttribunalfinder.service.gov.uk",
                        "field_type": {
                            "id": "FixedList-FR_birminghamList",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "FR_birminghamList_10",
                                    "label": "HEREFORD COUNTY COURT AND FAMILY COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_9",
                                    "label": "STAFFORD COMBINED COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_8",
                                    "label": "WORCESTER COMBINED COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_7",
                                    "label": "STOKE ON TRENT COMBINED COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_6",
                                    "label": "WALSALL COUNTY AND FAMILY COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_5",
                                    "label": "DUDLEY COUNTY COURT AND FAMILY COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_4",
                                    "label": "WOLVERHAMPTON COMBINED COURT CENTRE",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_3",
                                    "label": "TELFORD COUNTY COURT AND FAMILY COURT",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_2",
                                    "label": "COVENTRY COMBINED COURT CENTRE",
                                    "order": null
                                },
                                {
                                    "code": "FR_birminghamList_1",
                                    "label": "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 14,
                        "formatted_value": "FR_birminghamList_9",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "regionList=\"midlands\" AND midlandsFRCList=\"birmingham\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "divorceDetails",
                "label": "Divorce",
                "order": 4,
                "fields": [
                    {
                        "id": "divorceAbout_H1",
                        "label": "#### DIVORCE DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "divorceCaseNumber",
                        "label": "Divorce Case Number",
                        "hidden": null,
                        "value": "BV18D00152",
                        "metadata": false,
                        "hint_text": "Enter 10 character alphanumeric divorce case number",
                        "field_type": {
                            "id": "divorceCaseNumber-cd9c8be6-d93d-444c-9291-3e27981e0dd8",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": "^([A-Z|a-z][A-Z|a-z])\\d{2}[D|d]\\d{5}$",
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": "^([A-Z|a-z][A-Z|a-z])\\d{2}[D|d]\\d{5}$",
                        "security_label": "PUBLIC",
                        "order": 2,
                        "formatted_value": "BV18D00152",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "divorceStageReached",
                        "label": "What stage has the divorce reached ?",
                        "hidden": null,
                        "value": "Petition Issued",
                        "metadata": false,
                        "hint_text": "To ensure the application is linked to the divorce file without delay, please upload a copy of the decree [nisi] [absolute]",
                        "field_type": {
                            "id": "FixedList-FR_fl_StageReached",
                            "type": "FixedList",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [
                                {
                                    "code": "Petition Issued",
                                    "label": "Petition Issued",
                                    "order": null
                                },
                                {
                                    "code": "Decree Absolute",
                                    "label": "Decree Absolute",
                                    "order": null
                                },
                                {
                                    "code": "Decree Nisi",
                                    "label": "Decree Nisi",
                                    "order": null
                                }
                            ],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": "Petition Issued",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "respondentDetails",
                "label": "Respondent",
                "order": 3,
                "fields": [
                    {
                        "id": "rRespondentLabel",
                        "label": "#### RESPONDENT DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 1,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentFMName",
                        "label": "Current First and Middle names",
                        "hidden": null,
                        "value": "Wilma Richardson",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 2,
                        "formatted_value": "Wilma Richardson",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentLName",
                        "label": "Current Last Name",
                        "hidden": null,
                        "value": "Hurst",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": "Hurst",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "appRespondentRep",
                        "label": "Is the respondent represented ?",
                        "hidden": null,
                        "value": "No",
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "YesOrNo",
                            "type": "YesOrNo",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 4,
                        "formatted_value": "No",
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "rSolicitorLabel",
                        "label": "#### RESPONDENT SOLICITOR’S DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 5,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "appRespondentRep=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "rRespondentLabel2",
                        "label": "#### RESPONDENT SERVICE ADDRESS DETAILS",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Label",
                            "type": "Label",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 13,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "appRespondentRep=\"No\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "respondentAddress",
                        "label": "Their address",
                        "hidden": null,
                        "value": {
                            "County": "",
                            "Country": "United Kingdom",
                            "PostCode": "E11 3EJ",
                            "PostTown": "London",
                            "AddressLine1": "22 Lancaster Road",
                            "AddressLine2": "",
                            "AddressLine3": ""
                        },
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "AddressGlobalUK",
                            "type": "Complex",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [
                                {
                                    "id": "AddressLine1",
                                    "label": "Building and Street",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax150",
                                        "type": "Text",
                                        "min": null,
                                        "max": 150,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "AddressLine2",
                                    "label": "Address Line 2",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "AddressLine3",
                                    "label": "Address Line 3",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "PostTown",
                                    "label": "Town or City",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "County",
                                    "label": "County/State",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "Country",
                                    "label": "Country",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax50",
                                        "type": "Text",
                                        "min": null,
                                        "max": 50,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                },
                                {
                                    "id": "PostCode",
                                    "label": "Postcode/Zipcode",
                                    "hidden": null,
                                    "order": null,
                                    "metadata": false,
                                    "case_type_id": null,
                                    "hint_text": null,
                                    "field_type": {
                                        "id": "TextMax14",
                                        "type": "Text",
                                        "min": null,
                                        "max": 14,
                                        "regular_expression": null,
                                        "fixed_list_items": [],
                                        "complex_fields": [],
                                        "collection_field_type": null
                                    },
                                    "security_classification": "PUBLIC",
                                    "live_from": null,
                                    "live_until": null,
                                    "show_condition": null,
                                    "acls": null,
                                    "complexACLs": [],
                                    "display_context": null,
                                    "display_context_parameter": null,
                                    "retain_hidden_value": null,
                                    "formatted_value": null,
                                    "default_value": null
                                }
                            ],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 14,
                        "formatted_value": {
                            "County": "",
                            "Country": "United Kingdom",
                            "PostCode": "E11 3EJ",
                            "PostTown": "London",
                            "AddressLine1": "22 Lancaster Road",
                            "AddressLine2": "",
                            "AddressLine3": ""
                        },
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "appRespondentRep=\"No\" AND respondentAddressConfidential!=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "respondentPhone",
                        "label": "Phone Number",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Text",
                            "type": "Text",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 15,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "appRespondentRep=\"No\" AND respondentAddressConfidential!=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "respondentEmail",
                        "label": "Email",
                        "hidden": null,
                        "value": null,
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Email",
                            "type": "Email",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 16,
                        "formatted_value": null,
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": "appRespondentRep=\"No\" AND respondentAddressConfidential!=\"Yes\"",
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            },
            {
                "id": "CaseDetails",
                "label": "Case Documents",
                "order": 7,
                "fields": [
                    {
                        "id": "consentOrder",
                        "label": "Draft Consent Order",
                        "hidden": null,
                        "value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32/binary"
                        },
                        "metadata": false,
                        "hint_text": "Please upload a scanned copy of the draft consent order that has been signed by both parties. PLEASE NOTE: Pension documents should be uploaded separately on the pension upload page or they will not be returned with a court seal upon approval of the application. Where possible, documents should be scanned in Black and White.",
                        "field_type": {
                            "id": "Document",
                            "type": "Document",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 3,
                        "formatted_value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32/binary"
                        },
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "latestConsentOrder",
                        "label": "Latest Consent Order",
                        "hidden": null,
                        "value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32/binary"
                        },
                        "metadata": false,
                        "hint_text": null,
                        "field_type": {
                            "id": "Document",
                            "type": "Document",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 5,
                        "formatted_value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/c834c7e6-083c-49f3-bb34-a47fd578eb32/binary"
                        },
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "d81Joint",
                        "label": "Form D81 Joint Document",
                        "hidden": null,
                        "value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/ba03d760-96b5-4f2b-9ded-c259b9beeae7",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/ba03d760-96b5-4f2b-9ded-c259b9beeae7/binary"
                        },
                        "metadata": false,
                        "hint_text": "Joint D81 form, signed by both parties",
                        "field_type": {
                            "id": "Document",
                            "type": "Document",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": null
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 6,
                        "formatted_value": {
                            "document_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/ba03d760-96b5-4f2b-9ded-c259b9beeae7",
                            "document_filename": "Redacted-dm-store117030023756863387643594864315275504083.pdf",
                            "document_binary_url": "http://dm-store-demo.service.core-compute-demo.internal/documents/ba03d760-96b5-4f2b-9ded-c259b9beeae7/binary"
                        },
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "pensionCollection",
                        "label": "Pension Documents",
                        "hidden": null,
                        "value": [],
                        "metadata": false,
                        "hint_text": "If the application contains an application for a pension sharing, pension compensation sharing, pension attachment or pension compensation attachment order, please upload the relevant pension form(s) from the list below",
                        "field_type": {
                            "id": "pensionCollection-21406c06-5ea2-49e6-b125-fcc0d78626c1",
                            "type": "Collection",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": {
                                "id": "FR_PensionType",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "typeOfDocument",
                                        "label": "Type of document",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "FixedList-FR_fl_PensionDocument",
                                            "type": "FixedList",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [
                                                {
                                                    "code": "Form PPF2",
                                                    "label": "Form PPF2",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Form PPF1",
                                                    "label": "Form PPF1",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Form PPF",
                                                    "label": "Form PPF",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Form P2",
                                                    "label": "Form P2",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Form P1",
                                                    "label": "Form P1",
                                                    "order": null
                                                }
                                            ],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": null,
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null,
                                        "default_value": null
                                    },
                                    {
                                        "id": "uploadedDocument",
                                        "label": "Document",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "Document",
                                            "type": "Document",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": null,
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null,
                                        "default_value": null
                                    }
                                ],
                                "collection_field_type": null
                            }
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 10,
                        "formatted_value": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    },
                    {
                        "id": "otherCollection",
                        "label": "Other Documents",
                        "hidden": null,
                        "value": [],
                        "metadata": false,
                        "hint_text": "Upload other documentation related to your application",
                        "field_type": {
                            "id": "otherCollection-2f3b95fd-e708-4883-936b-850bfb5bf33d",
                            "type": "Collection",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": {
                                "id": "FR_DocumentType",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "typeOfDocument",
                                        "label": "Type of document",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "FixedList-FR_fl_OtherDocument",
                                            "type": "FixedList",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [
                                                {
                                                    "code": "Other",
                                                    "label": "Other",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Notice of acting",
                                                    "label": "Notice of acting",
                                                    "order": null
                                                },
                                                {
                                                    "code": "Letter",
                                                    "label": "Letter",
                                                    "order": null
                                                },
                                                {
                                                    "code": "ScheduleOfAssets",
                                                    "label": "Schedule of Assets",
                                                    "order": null
                                                }
                                            ],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": null,
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null,
                                        "default_value": null
                                    },
                                    {
                                        "id": "uploadedDocument",
                                        "label": "Document",
                                        "hidden": null,
                                        "order": null,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "Document",
                                            "type": "Document",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": null
                                        },
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": null,
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": null,
                                        "formatted_value": null,
                                        "default_value": null
                                    }
                                ],
                                "collection_field_type": null
                            }
                        },
                        "validation_expr": null,
                        "security_label": "PUBLIC",
                        "order": 11,
                        "formatted_value": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "show_condition": null,
                        "show_summary_change_option": null,
                        "show_summary_content_option": null,
                        "retain_hidden_value": null,
                        "acls": [
                            {
                                "role": "caseworker-divorce-financialremedy",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-courtadmin",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-solicitor",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            },
                            {
                                "role": "caseworker-divorce-financialremedy-judiciary",
                                "create": true,
                                "read": true,
                                "update": false,
                                "delete": false
                            },
                            {
                                "role": "caseworker-caa",
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false
                            }
                        ],
                        "default_value": null
                    }
                ],
                "role": null,
                "show_condition": null
            }
        ],
        "metadataFields": [
            {
                "id": "[STATE]",
                "label": "State",
                "hidden": false,
                "value": "caseAdded",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "FixedList-FinancialRemedyMVP2[STATE]",
                    "type": "FixedList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "close",
                            "label": "Close",
                            "order": null
                        },
                        {
                            "code": "infoReceived",
                            "label": "Information Received",
                            "order": null
                        },
                        {
                            "code": "awaitingInfo",
                            "label": "Awaiting Information",
                            "order": null
                        },
                        {
                            "code": "responseReceived",
                            "label": "Response Received",
                            "order": null
                        },
                        {
                            "code": "awaitingResponse",
                            "label": "Awaiting Response",
                            "order": null
                        },
                        {
                            "code": "consentOrderMade",
                            "label": "Consent Order Made",
                            "order": null
                        },
                        {
                            "code": "consentOrderApproved",
                            "label": "Consent Order Approved",
                            "order": null
                        },
                        {
                            "code": "orderMade",
                            "label": "Consent Order Not Approved",
                            "order": null
                        },
                        {
                            "code": "referredToJudge",
                            "label": "Awaiting Judicial Response",
                            "order": null
                        },
                        {
                            "code": "applicationIssued",
                            "label": "Application Issued",
                            "order": null
                        },
                        {
                            "code": "applicationSubmitted",
                            "label": "Application Submitted",
                            "order": null
                        },
                        {
                            "code": "awaitingPaymentResponse",
                            "label": "Awaiting Payment Response",
                            "order": null
                        },
                        {
                            "code": "awaitingPayment",
                            "label": "Solicitor - Awaiting Payment",
                            "order": null
                        },
                        {
                            "code": "awaitingHWFDecision",
                            "label": "Awaiting HWF Decision",
                            "order": null
                        },
                        {
                            "code": "newPaperCase",
                            "label": "New Paper Case",
                            "order": null
                        },
                        {
                            "code": "caseAdded",
                            "label": "Application Drafted",
                            "order": null
                        }
                    ],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[JURISDICTION]",
                "label": "Jurisdiction",
                "hidden": false,
                "value": "IA",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "Text",
                    "type": "Text",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[CASE_TYPE]",
                "label": "Case Type",
                "hidden": false,
                "value": "FinancialRemedyMVP2",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "Text",
                    "type": "Text",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[SECURITY_CLASSIFICATION]",
                "label": "Security Classification",
                "hidden": false,
                "value": "PUBLIC",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "Text",
                    "type": "Text",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[CASE_REFERENCE]",
                "label": "Case Reference",
                "hidden": false,
                "value": 1604309496714935,
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "Number",
                    "type": "Number",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[CREATED_DATE]",
                "label": "Created Date",
                "hidden": false,
                "value": "2020-11-02T09:31:36.793313",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "DateTime",
                    "type": "DateTime",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[LAST_MODIFIED_DATE]",
                "label": "Last Modified Date",
                "hidden": false,
                "value": "2020-11-02T09:31:37.111545",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "DateTime",
                    "type": "DateTime",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            },
            {
                "id": "[LAST_STATE_MODIFIED_DATE]",
                "label": "Last State Modified Date",
                "hidden": false,
                "value": "2020-11-02T09:31:36.793313",
                "metadata": true,
                "hint_text": null,
                "field_type": {
                    "id": "DateTime",
                    "type": "DateTime",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
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
                "acls": [],
                "default_value": null
            }
        ],
        "state": {
            "id": "caseAdded",
            "name": "Application Drafted",
            "description": null,
            "title_display": "**${[CASE_REFERENCE]}  ${applicantLName}  vs ${appRespondentLName}**"
        },
        "triggers": [
            {
                "id": "FR_applicationPaymentSubmission",
                "name": "Case Submission",
                "description": "Case Submission",
                "order": 2
            },
            {
                "id": "FR_amendApplicationDetails",
                "name": "Amend Application Details",
                "description": "Amend Application Details",
                "order": 109
            }
        ],
        "events": [
            {
                "id": 155533,
                "timestamp": "2020-11-02T09:31:36.793313",
                "summary": "",
                "comment": "",
                "event_id": "FR_solicitorCreate",
                "event_name": "Consent Order Application",
                "user_id": "72f16776-4ff9-4f5a-8b65-860e499bd24e",
                "user_last_name": "Parker",
                "user_first_name": "Peter",
                "state_name": "Application Drafted",
                "state_id": "caseAdded",
                "significant_item": null
            }
        ]
    }
}

