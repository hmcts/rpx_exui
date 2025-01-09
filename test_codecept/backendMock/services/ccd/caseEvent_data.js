
const caseFlagsEventResponse = require('./caseFlagsCreateManageEventResponse')

class CaseEventData{

    constructor(){
        this.eventData = getTemplate()
    }

    setEventProps(props){
        for(const prop of Object.keys(props)){
            this.eventData[prop] = props[prop]
        }
    }

    addCaseField(fieldProps){
        this.eventData.case_fields.push();
    }

    getCaseFlagsEventResponse() {
        return caseFlagsEventResponse;
    }

}

module.exports = new CaseEventData();

function getTemplate(){
    return {
        "id": "editAppealAfterSubmit",
        "name": "Edit appeal",
        "description": "Edit appeal",
        "case_id": "1603298245304919",
        "case_fields": [
            {
                "id": "applicationOutOfTimeDocument",
                "label": "",
                "hidden": null,
                "value": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "OPTIONAL",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "applicationOutOfTimeExplanation",
                "label": "You can upload a document or fill out the box below.",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "OPTIONAL",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "applicationOutOfTimeText",
                "label": "You've missed the deadline for appealing.\n\nYou can ask for permission to appeal outside of the deadline.\n\nExplain why you believe your late appeal should be allowed to proceed.",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "submissionOutOfTime",
                "label": "Was the appeal submission late?",
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
                "order": null,
                "formatted_value": "No",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "applicationOutOfTimeText=\"DUMMY_VALUE_TO_HIDE_FIELD\"",
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "legalRepReferenceNumber",
                "label": "Own reference",
                "hidden": null,
                "value": "ia-legal-fenn",
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
                "order": null,
                "formatted_value": "ia-legal-fenn",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-caa"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-approver"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "legalRepName",
                "label": "Name",
                "hidden": null,
                "value": "Stephen Fenn",
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
                "order": null,
                "formatted_value": "Stephen Fenn",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "legalRepCompany",
                "label": "Company",
                "hidden": null,
                "value": "IA Legal Services",
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
                "order": null,
                "formatted_value": "IA Legal Services",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-caa"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-approver"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "legalRepDetailsHintAndTitle",
                "label": "Enter your details.",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "otherAppeals",
                "label": "Appeal number",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "otherAppeals-29ea17ff-85d0-4aa9-bfb7-d5d8d28f25ca",
                    "type": "Collection",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
                    "collection_field_type": {
                        "id": "appealNumber",
                        "type": "Complex",
                        "min": null,
                        "max": null,
                        "regular_expression": null,
                        "fixed_list_items": [],
                        "complex_fields": [
                            {
                                "id": "value",
                                "label": "",
                                "hidden": null,
                                "order": null,
                                "metadata": false,
                                "case_type_id": null,
                                "hint_text": null,
                                "field_type": {
                                    "id": "value-987f861c-f8b0-47d9-953c-82c9d8b58b5a",
                                    "type": "Text",
                                    "min": null,
                                    "max": null,
                                    "regular_expression": "^(RP|PA|EA|HU|DC|DA|AA|IA|OA|VA)\\/[0-9]{5}\\/[0-9]{4}$",
                                    "fixed_list_items": [],
                                    "complex_fields": [],
                                    "collection_field_type": null
                                },
                                "security_classification": "PUBLIC",
                                "live_from": null,
                                "live_until": null,
                                "show_condition": null,
                                "acls": [
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-legalrep-solicitor"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-caseofficer"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-admofficer"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficeapc"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficelart"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficepou"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-respondentofficer"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-iacjudge"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-wa-task-configuration"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_judge_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_legal_ops_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_admin_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_ctsc_profile"
                                    }
                                ],
                                "complexACLs": [],
                                "display_context": null,
                                "display_context_parameter": null,
                                "retain_hidden_value": null,
                                "formatted_value": null,
                                "category_id": null
                            }
                        ],
                        "collection_field_type": null
                    }
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": "#COLLECTION(allowDelete,allowInsert,allowUpdate)",
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "otherAppealsTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "hasOtherAppeals",
                "label": "Previous appeals",
                "hidden": null,
                "value": "No",
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "FixedList-otherAppeals",
                    "type": "FixedList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "Yes",
                            "label": "Yes",
                            "order": "1"
                        },
                        {
                            "code": "YesWithoutAppealNumber",
                            "label": "Yes, but I don't have an appeal number",
                            "order": "2"
                        },
                        {
                            "code": "No",
                            "label": "No",
                            "order": "3"
                        },
                        {
                            "code": "NotSure",
                            "label": "I'm not sure",
                            "order": "4"
                        }
                    ],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": "No",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "hasOtherAppealsTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "newMatters",
                "label": "Explain these new matters and their relevance to the appeal",
                "hidden": null,
                "value": "Birth of a child",
                "metadata": false,
                "hint_text": null,
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
                "order": null,
                "formatted_value": "Birth of a child",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "hasNewMatters=\"Yes\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "hasNewMatters",
                "label": "Are there any new reasons your client wishes to remain in the UK or any new grounds on which they should be permitted to stay?",
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
                "order": null,
                "formatted_value": "Yes",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "newMattersTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "deportationOrderOptions",
                "label": "Has a deportation order been made against the appellant?",
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
                "order": null,
                "formatted_value": "Yes",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "deportationOrderTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorAuthorisation",
                "label": "Does your client give authorisation for the sponsor to access information relating to the appeal?",
                "hidden": null,
                "value": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorMobileNumber",
                "label": "Mobile phone number",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "sponsorMobileNumber-81098844-9b5a-4ee0-9f15-51af099b0cbc",
                    "type": "Text",
                    "min": null,
                    "max": null,
                    "regular_expression": "^((\\+44(\\s\\(0\\)\\s|\\s0\\s|\\s)?)|0)7\\d{3}(\\s)?\\d{6}$",
                    "fixed_list_items": [],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "sponsorContactPreference=\"wantsSms\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorEmail",
                "label": "Email address",
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "sponsorContactPreference=\"wantsEmail\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorContactPreference",
                "label": "Contact details",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "FixedRadioList-contactPreference",
                    "type": "FixedRadioList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "wantsEmail",
                            "label": "Email",
                            "order": "1"
                        },
                        {
                            "code": "wantsSms",
                            "label": "Text message",
                            "order": "2"
                        }
                    ],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorAddress",
                "label": "Address",
                "hidden": null,
                "value": null,
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
                        }
                    ],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorFamilyName",
                "label": "Family name",
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "sponsorGivenNames",
                "label": "Given names",
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "hasSponsor",
                "label": "Does your client have a sponsor?",
                "hidden": null,
                "value": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantSponsorTitle",
                "label": "## Sponsor",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "mobileNumber",
                "label": "Mobile phone number",
                "hidden": null,
                "value": "07977111111",
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
                "order": null,
                "formatted_value": "07977111111",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "contactPreference=\"wantsSms\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "email",
                "label": "Email address",
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "contactPreference=\"wantsEmail\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "contactPreference",
                "label": "Communication Preference",
                "hidden": null,
                "value": "wantsSms",
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "FixedRadioList-contactPreference",
                    "type": "FixedRadioList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "wantsEmail",
                            "label": "Email",
                            "order": "1"
                        },
                        {
                            "code": "wantsSms",
                            "label": "Text message",
                            "order": "2"
                        }
                    ],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": "wantsSms",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantContactPreferenceTitle",
                "label": "Select the communication method which best suits the appellant. \n\n The Tribunal needs this to: \n- provide standard guidance on the appeal process\n- update the appellant at key points in the appeal\n- send the Hearing Notice and guidance on what to expect at hearing\n- contact the appellant if, for any reason, your representation ends",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantOutOfCountryAddress",
                "label": "Enter the address",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "hasCorrespondenceAddress=\"Yes\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "hasCorrespondenceAddress",
                "label": "Does your client have a correspondence address outside the UK?",
                "hidden": null,
                "value": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantCorrespAddressTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantAddress",
                "label": "Address",
                "hidden": null,
                "value": null,
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
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
                            "acls": [
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "citizen"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-legalrep-solicitor"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-caseofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-admofficer"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficeapc"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficelart"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-homeofficepou"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "caseworker-ia-respondentofficer"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-ia-iacjudge"
                                },
                                {
                                    "create": true,
                                    "read": true,
                                    "update": true,
                                    "delete": true,
                                    "role": "caseworker-wa-task-configuration"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_judge_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_legal_ops_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_admin_profile"
                                },
                                {
                                    "create": false,
                                    "read": true,
                                    "update": false,
                                    "delete": false,
                                    "role": "ia_specific_access_ctsc_profile"
                                }
                            ],
                            "complexACLs": [],
                            "display_context": null,
                            "display_context_parameter": null,
                            "retain_hidden_value": null,
                            "formatted_value": null,
                            "category_id": null
                        }
                    ],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "appellantHasFixedAddress=\"Yes\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantHasFixedAddressLabel",
                "label": "**We will use the address of your legal practice.**",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": "appellantHasFixedAddress=\"No\"",
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantHasFixedAddress",
                "label": "Does the appellant have a fixed address?",
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
                "order": null,
                "formatted_value": "No",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantAddressTitle",
                "label": "We'll use this to work out which hearing centre is best for them.",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantNationalities",
                "label": "Nationality",
                "hidden": null,
                "value": [
                    {
                        "value": {
                            "code": "FI"
                        },
                        "id": "dcc1b843-8472-475c-8f97-3278f453338b"
                    }
                ],
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "appellantNationalities-36b9c89d-0057-45af-b125-cfd96f85ed7d",
                    "type": "Collection",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [],
                    "complex_fields": [],
                    "collection_field_type": {
                        "id": "nationality",
                        "type": "Complex",
                        "min": null,
                        "max": null,
                        "regular_expression": null,
                        "fixed_list_items": [],
                        "complex_fields": [
                            {
                                "id": "code",
                                "label": "Nationality",
                                "hidden": null,
                                "order": null,
                                "metadata": false,
                                "case_type_id": null,
                                "hint_text": null,
                                "field_type": {
                                    "id": "FixedList-isoCountries",
                                    "type": "FixedList",
                                    "min": null,
                                    "max": null,
                                    "regular_expression": null,
                                    "fixed_list_items": [
                                        {
                                            "code": "AF",
                                            "label": "Afghanistan",
                                            "order": "1"
                                        },
                                        {
                                            "code": "AX",
                                            "label": "Aland Islands",
                                            "order": "2"
                                        },
                                        {
                                            "code": "AL",
                                            "label": "Albania",
                                            "order": "3"
                                        },
                                        {
                                            "code": "DZ",
                                            "label": "Algeria",
                                            "order": "4"
                                        },
                                        {
                                            "code": "AS",
                                            "label": "American Samoa",
                                            "order": "5"
                                        },
                                        {
                                            "code": "AD",
                                            "label": "Andorra",
                                            "order": "6"
                                        },
                                        {
                                            "code": "AO",
                                            "label": "Angola",
                                            "order": "7"
                                        },
                                        {
                                            "code": "AI",
                                            "label": "Anguilla",
                                            "order": "8"
                                        },
                                        {
                                            "code": "AQ",
                                            "label": "Antarctica",
                                            "order": "9"
                                        },
                                        {
                                            "code": "AG",
                                            "label": "Antigua and Barbuda",
                                            "order": "10"
                                        },
                                        {
                                            "code": "AR",
                                            "label": "Argentina",
                                            "order": "11"
                                        },
                                        {
                                            "code": "AM",
                                            "label": "Armenia",
                                            "order": "12"
                                        },
                                        {
                                            "code": "AW",
                                            "label": "Aruba",
                                            "order": "13"
                                        },
                                        {
                                            "code": "AU",
                                            "label": "Australia",
                                            "order": "14"
                                        },
                                        {
                                            "code": "AT",
                                            "label": "Austria",
                                            "order": "15"
                                        },
                                        {
                                            "code": "AZ",
                                            "label": "Azerbaijan",
                                            "order": "16"
                                        },
                                        {
                                            "code": "BS",
                                            "label": "Bahamas",
                                            "order": "17"
                                        },
                                        {
                                            "code": "BH",
                                            "label": "Bahrain",
                                            "order": "18"
                                        },
                                        {
                                            "code": "BD",
                                            "label": "Bangladesh",
                                            "order": "19"
                                        },
                                        {
                                            "code": "BB",
                                            "label": "Barbados",
                                            "order": "20"
                                        },
                                        {
                                            "code": "BY",
                                            "label": "Belarus",
                                            "order": "21"
                                        },
                                        {
                                            "code": "BE",
                                            "label": "Belgium",
                                            "order": "22"
                                        },
                                        {
                                            "code": "BZ",
                                            "label": "Belize",
                                            "order": "23"
                                        },
                                        {
                                            "code": "BJ",
                                            "label": "Benin",
                                            "order": "24"
                                        },
                                        {
                                            "code": "BM",
                                            "label": "Bermuda",
                                            "order": "25"
                                        },
                                        {
                                            "code": "BT",
                                            "label": "Bhutan",
                                            "order": "26"
                                        },
                                        {
                                            "code": "BO",
                                            "label": "Bolivia",
                                            "order": "27"
                                        },
                                        {
                                            "code": "BQ",
                                            "label": "Bonaire, Sint Eustatius and Saba",
                                            "order": "28"
                                        },
                                        {
                                            "code": "BA",
                                            "label": "Bosnia and Herzegovina",
                                            "order": "29"
                                        },
                                        {
                                            "code": "BW",
                                            "label": "Botswana",
                                            "order": "30"
                                        },
                                        {
                                            "code": "BV",
                                            "label": "Bouvet Island",
                                            "order": "31"
                                        },
                                        {
                                            "code": "BR",
                                            "label": "Brazil",
                                            "order": "32"
                                        },
                                        {
                                            "code": "VG",
                                            "label": "British Virgin Islands",
                                            "order": "33"
                                        },
                                        {
                                            "code": "IO",
                                            "label": "British Indian Ocean Territory",
                                            "order": "34"
                                        },
                                        {
                                            "code": "BN",
                                            "label": "Brunei Darussalam",
                                            "order": "35"
                                        },
                                        {
                                            "code": "BG",
                                            "label": "Bulgaria",
                                            "order": "36"
                                        },
                                        {
                                            "code": "BF",
                                            "label": "Burkina Faso",
                                            "order": "37"
                                        },
                                        {
                                            "code": "BI",
                                            "label": "Burundi",
                                            "order": "38"
                                        },
                                        {
                                            "code": "KH",
                                            "label": "Cambodia",
                                            "order": "39"
                                        },
                                        {
                                            "code": "CM",
                                            "label": "Cameroon",
                                            "order": "40"
                                        },
                                        {
                                            "code": "CA",
                                            "label": "Canada",
                                            "order": "51"
                                        },
                                        {
                                            "code": "CV",
                                            "label": "Cape Verde",
                                            "order": "52"
                                        },
                                        {
                                            "code": "KY",
                                            "label": "Cayman Islands",
                                            "order": "53"
                                        },
                                        {
                                            "code": "CF",
                                            "label": "Central African Republic",
                                            "order": "54"
                                        },
                                        {
                                            "code": "TD",
                                            "label": "Chad",
                                            "order": "55"
                                        },
                                        {
                                            "code": "CL",
                                            "label": "Chile",
                                            "order": "56"
                                        },
                                        {
                                            "code": "CN",
                                            "label": "China",
                                            "order": "57"
                                        },
                                        {
                                            "code": "HK",
                                            "label": "Hong Kong, Special Administrative Region of China",
                                            "order": "58"
                                        },
                                        {
                                            "code": "MO",
                                            "label": "Macao, Special Administrative Region of China",
                                            "order": "59"
                                        },
                                        {
                                            "code": "CX",
                                            "label": "Christmas Island",
                                            "order": "60"
                                        },
                                        {
                                            "code": "CC",
                                            "label": "Cocos (Keeling) Islands",
                                            "order": "61"
                                        },
                                        {
                                            "code": "CO",
                                            "label": "Colombia",
                                            "order": "62"
                                        },
                                        {
                                            "code": "KM",
                                            "label": "Comoros",
                                            "order": "63"
                                        },
                                        {
                                            "code": "CG",
                                            "label": "Congo (Brazzaville)",
                                            "order": "64"
                                        },
                                        {
                                            "code": "CD",
                                            "label": "Congo, Democratic Republic of the",
                                            "order": "65"
                                        },
                                        {
                                            "code": "CK",
                                            "label": "Cook Islands",
                                            "order": "66"
                                        },
                                        {
                                            "code": "CR",
                                            "label": "Costa Rica",
                                            "order": "67"
                                        },
                                        {
                                            "code": "CI",
                                            "label": "Côte d'Ivoire",
                                            "order": "68"
                                        },
                                        {
                                            "code": "HR",
                                            "label": "Croatia",
                                            "order": "69"
                                        },
                                        {
                                            "code": "CU",
                                            "label": "Cuba",
                                            "order": "70"
                                        },
                                        {
                                            "code": "CW",
                                            "label": "Curaçao",
                                            "order": "71"
                                        },
                                        {
                                            "code": "CY",
                                            "label": "Cyprus",
                                            "order": "72"
                                        },
                                        {
                                            "code": "CZ",
                                            "label": "Czech Republic",
                                            "order": "73"
                                        },
                                        {
                                            "code": "DK",
                                            "label": "Denmark",
                                            "order": "74"
                                        },
                                        {
                                            "code": "DJ",
                                            "label": "Djibouti",
                                            "order": "75"
                                        },
                                        {
                                            "code": "DM",
                                            "label": "Dominica",
                                            "order": "76"
                                        },
                                        {
                                            "code": "DO",
                                            "label": "Dominican Republic",
                                            "order": "77"
                                        },
                                        {
                                            "code": "EC",
                                            "label": "Ecuador",
                                            "order": "78"
                                        },
                                        {
                                            "code": "EG",
                                            "label": "Egypt",
                                            "order": "79"
                                        },
                                        {
                                            "code": "SV",
                                            "label": "El Salvador",
                                            "order": "80"
                                        },
                                        {
                                            "code": "GQ",
                                            "label": "Equatorial Guinea",
                                            "order": "81"
                                        },
                                        {
                                            "code": "ER",
                                            "label": "Eritrea",
                                            "order": "82"
                                        },
                                        {
                                            "code": "EE",
                                            "label": "Estonia",
                                            "order": "83"
                                        },
                                        {
                                            "code": "ET",
                                            "label": "Ethiopia",
                                            "order": "84"
                                        },
                                        {
                                            "code": "FK",
                                            "label": "Falkland Islands (Malvinas)",
                                            "order": "85"
                                        },
                                        {
                                            "code": "FO",
                                            "label": "Faroe Islands",
                                            "order": "86"
                                        },
                                        {
                                            "code": "FJ",
                                            "label": "Fiji",
                                            "order": "87"
                                        },
                                        {
                                            "code": "FI",
                                            "label": "Finland",
                                            "order": "88"
                                        },
                                        {
                                            "code": "FR",
                                            "label": "France",
                                            "order": "89"
                                        },
                                        {
                                            "code": "GF",
                                            "label": "French Guiana",
                                            "order": "90"
                                        },
                                        {
                                            "code": "PF",
                                            "label": "French Polynesia",
                                            "order": "101"
                                        },
                                        {
                                            "code": "TF",
                                            "label": "French Southern Territories",
                                            "order": "102"
                                        },
                                        {
                                            "code": "GA",
                                            "label": "Gabon",
                                            "order": "103"
                                        },
                                        {
                                            "code": "GM",
                                            "label": "Gambia",
                                            "order": "104"
                                        },
                                        {
                                            "code": "GE",
                                            "label": "Georgia",
                                            "order": "105"
                                        },
                                        {
                                            "code": "DE",
                                            "label": "Germany",
                                            "order": "106"
                                        },
                                        {
                                            "code": "GH",
                                            "label": "Ghana",
                                            "order": "107"
                                        },
                                        {
                                            "code": "GI",
                                            "label": "Gibraltar",
                                            "order": "108"
                                        },
                                        {
                                            "code": "GR",
                                            "label": "Greece",
                                            "order": "109"
                                        },
                                        {
                                            "code": "GL",
                                            "label": "Greenland",
                                            "order": "110"
                                        },
                                        {
                                            "code": "GD",
                                            "label": "Grenada",
                                            "order": "111"
                                        },
                                        {
                                            "code": "GP",
                                            "label": "Guadeloupe",
                                            "order": "112"
                                        },
                                        {
                                            "code": "GU",
                                            "label": "Guam",
                                            "order": "113"
                                        },
                                        {
                                            "code": "GT",
                                            "label": "Guatemala",
                                            "order": "114"
                                        },
                                        {
                                            "code": "GG",
                                            "label": "Guernsey",
                                            "order": "115"
                                        },
                                        {
                                            "code": "GN",
                                            "label": "Guinea",
                                            "order": "116"
                                        },
                                        {
                                            "code": "GW",
                                            "label": "Guinea-Bissau",
                                            "order": "117"
                                        },
                                        {
                                            "code": "GY",
                                            "label": "Guyana",
                                            "order": "118"
                                        },
                                        {
                                            "code": "HT",
                                            "label": "Haiti",
                                            "order": "119"
                                        },
                                        {
                                            "code": "HM",
                                            "label": "Heard Island and Mcdonald Islands",
                                            "order": "120"
                                        },
                                        {
                                            "code": "VA",
                                            "label": "Holy See (Vatican City State)",
                                            "order": "121"
                                        },
                                        {
                                            "code": "HN",
                                            "label": "Honduras",
                                            "order": "122"
                                        },
                                        {
                                            "code": "HU",
                                            "label": "Hungary",
                                            "order": "123"
                                        },
                                        {
                                            "code": "IS",
                                            "label": "Iceland",
                                            "order": "124"
                                        },
                                        {
                                            "code": "IN",
                                            "label": "India",
                                            "order": "125"
                                        },
                                        {
                                            "code": "ID",
                                            "label": "Indonesia",
                                            "order": "126"
                                        },
                                        {
                                            "code": "IR",
                                            "label": "Iran, Islamic Republic of",
                                            "order": "127"
                                        },
                                        {
                                            "code": "IQ",
                                            "label": "Iraq",
                                            "order": "128"
                                        },
                                        {
                                            "code": "IE",
                                            "label": "Ireland",
                                            "order": "129"
                                        },
                                        {
                                            "code": "IM",
                                            "label": "Isle of Man",
                                            "order": "130"
                                        },
                                        {
                                            "code": "IL",
                                            "label": "Israel",
                                            "order": "131"
                                        },
                                        {
                                            "code": "IT",
                                            "label": "Italy",
                                            "order": "132"
                                        },
                                        {
                                            "code": "JM",
                                            "label": "Jamaica",
                                            "order": "133"
                                        },
                                        {
                                            "code": "JP",
                                            "label": "Japan",
                                            "order": "134"
                                        },
                                        {
                                            "code": "JE",
                                            "label": "Jersey",
                                            "order": "135"
                                        },
                                        {
                                            "code": "JO",
                                            "label": "Jordan",
                                            "order": "136"
                                        },
                                        {
                                            "code": "KZ",
                                            "label": "Kazakhstan",
                                            "order": "137"
                                        },
                                        {
                                            "code": "KE",
                                            "label": "Kenya",
                                            "order": "138"
                                        },
                                        {
                                            "code": "KI",
                                            "label": "Kiribati",
                                            "order": "139"
                                        },
                                        {
                                            "code": "KP",
                                            "label": "Korea, Democratic People's Republic of",
                                            "order": "140"
                                        },
                                        {
                                            "code": "KR",
                                            "label": "Korea, Republic of",
                                            "order": "151"
                                        },
                                        {
                                            "code": "KW",
                                            "label": "Kuwait",
                                            "order": "152"
                                        },
                                        {
                                            "code": "KG",
                                            "label": "Kyrgyzstan",
                                            "order": "153"
                                        },
                                        {
                                            "code": "LA",
                                            "label": "Lao PDR",
                                            "order": "154"
                                        },
                                        {
                                            "code": "LV",
                                            "label": "Latvia",
                                            "order": "155"
                                        },
                                        {
                                            "code": "LB",
                                            "label": "Lebanon",
                                            "order": "156"
                                        },
                                        {
                                            "code": "LS",
                                            "label": "Lesotho",
                                            "order": "157"
                                        },
                                        {
                                            "code": "LR",
                                            "label": "Liberia",
                                            "order": "158"
                                        },
                                        {
                                            "code": "LY",
                                            "label": "Libya",
                                            "order": "159"
                                        },
                                        {
                                            "code": "LI",
                                            "label": "Liechtenstein",
                                            "order": "160"
                                        },
                                        {
                                            "code": "LT",
                                            "label": "Lithuania",
                                            "order": "161"
                                        },
                                        {
                                            "code": "LU",
                                            "label": "Luxembourg",
                                            "order": "162"
                                        },
                                        {
                                            "code": "MK",
                                            "label": "Macedonia, Republic of",
                                            "order": "163"
                                        },
                                        {
                                            "code": "MG",
                                            "label": "Madagascar",
                                            "order": "164"
                                        },
                                        {
                                            "code": "MW",
                                            "label": "Malawi",
                                            "order": "165"
                                        },
                                        {
                                            "code": "MY",
                                            "label": "Malaysia",
                                            "order": "166"
                                        },
                                        {
                                            "code": "MV",
                                            "label": "Maldives",
                                            "order": "167"
                                        },
                                        {
                                            "code": "ML",
                                            "label": "Mali",
                                            "order": "168"
                                        },
                                        {
                                            "code": "MT",
                                            "label": "Malta",
                                            "order": "169"
                                        },
                                        {
                                            "code": "MH",
                                            "label": "Marshall Islands",
                                            "order": "170"
                                        },
                                        {
                                            "code": "MQ",
                                            "label": "Martinique",
                                            "order": "171"
                                        },
                                        {
                                            "code": "MR",
                                            "label": "Mauritania",
                                            "order": "172"
                                        },
                                        {
                                            "code": "MU",
                                            "label": "Mauritius",
                                            "order": "173"
                                        },
                                        {
                                            "code": "YT",
                                            "label": "Mayotte",
                                            "order": "174"
                                        },
                                        {
                                            "code": "MX",
                                            "label": "Mexico",
                                            "order": "175"
                                        },
                                        {
                                            "code": "FM",
                                            "label": "Micronesia, Federated States of",
                                            "order": "176"
                                        },
                                        {
                                            "code": "MD",
                                            "label": "Moldova",
                                            "order": "177"
                                        },
                                        {
                                            "code": "MC",
                                            "label": "Monaco",
                                            "order": "178"
                                        },
                                        {
                                            "code": "MN",
                                            "label": "Mongolia",
                                            "order": "179"
                                        },
                                        {
                                            "code": "ME",
                                            "label": "Montenegro",
                                            "order": "180"
                                        },
                                        {
                                            "code": "MS",
                                            "label": "Montserrat",
                                            "order": "181"
                                        },
                                        {
                                            "code": "MA",
                                            "label": "Morocco",
                                            "order": "182"
                                        },
                                        {
                                            "code": "MZ",
                                            "label": "Mozambique",
                                            "order": "183"
                                        },
                                        {
                                            "code": "MM",
                                            "label": "Myanmar",
                                            "order": "184"
                                        },
                                        {
                                            "code": "NA",
                                            "label": "Namibia",
                                            "order": "185"
                                        },
                                        {
                                            "code": "NR",
                                            "label": "Nauru",
                                            "order": "186"
                                        },
                                        {
                                            "code": "NP",
                                            "label": "Nepal",
                                            "order": "187"
                                        },
                                        {
                                            "code": "NL",
                                            "label": "Netherlands",
                                            "order": "188"
                                        },
                                        {
                                            "code": "AN",
                                            "label": "Netherlands Antilles",
                                            "order": "189"
                                        },
                                        {
                                            "code": "NC",
                                            "label": "New Caledonia",
                                            "order": "190"
                                        },
                                        {
                                            "code": "NZ",
                                            "label": "New Zealand",
                                            "order": "201"
                                        },
                                        {
                                            "code": "NI",
                                            "label": "Nicaragua",
                                            "order": "202"
                                        },
                                        {
                                            "code": "NE",
                                            "label": "Niger",
                                            "order": "203"
                                        },
                                        {
                                            "code": "NG",
                                            "label": "Nigeria",
                                            "order": "204"
                                        },
                                        {
                                            "code": "NU",
                                            "label": "Niue",
                                            "order": "205"
                                        },
                                        {
                                            "code": "NF",
                                            "label": "Norfolk Island",
                                            "order": "206"
                                        },
                                        {
                                            "code": "MP",
                                            "label": "Northern Mariana Islands",
                                            "order": "207"
                                        },
                                        {
                                            "code": "NO",
                                            "label": "Norway",
                                            "order": "208"
                                        },
                                        {
                                            "code": "OM",
                                            "label": "Oman",
                                            "order": "209"
                                        },
                                        {
                                            "code": "PK",
                                            "label": "Pakistan",
                                            "order": "210"
                                        },
                                        {
                                            "code": "PW",
                                            "label": "Palau",
                                            "order": "211"
                                        },
                                        {
                                            "code": "PS",
                                            "label": "Palestinian Territory, Occupied",
                                            "order": "212"
                                        },
                                        {
                                            "code": "PA",
                                            "label": "Panama",
                                            "order": "213"
                                        },
                                        {
                                            "code": "PG",
                                            "label": "Papua New Guinea",
                                            "order": "214"
                                        },
                                        {
                                            "code": "PY",
                                            "label": "Paraguay",
                                            "order": "215"
                                        },
                                        {
                                            "code": "PE",
                                            "label": "Peru",
                                            "order": "216"
                                        },
                                        {
                                            "code": "PH",
                                            "label": "Philippines",
                                            "order": "217"
                                        },
                                        {
                                            "code": "PN",
                                            "label": "Pitcairn",
                                            "order": "218"
                                        },
                                        {
                                            "code": "PL",
                                            "label": "Poland",
                                            "order": "219"
                                        },
                                        {
                                            "code": "PT",
                                            "label": "Portugal",
                                            "order": "220"
                                        },
                                        {
                                            "code": "PR",
                                            "label": "Puerto Rico",
                                            "order": "221"
                                        },
                                        {
                                            "code": "QA",
                                            "label": "Qatar",
                                            "order": "222"
                                        },
                                        {
                                            "code": "RE",
                                            "label": "Réunion",
                                            "order": "223"
                                        },
                                        {
                                            "code": "RO",
                                            "label": "Romania",
                                            "order": "224"
                                        },
                                        {
                                            "code": "RU",
                                            "label": "Russian Federation",
                                            "order": "225"
                                        },
                                        {
                                            "code": "RW",
                                            "label": "Rwanda",
                                            "order": "226"
                                        },
                                        {
                                            "code": "BL",
                                            "label": "Saint-Barthélemy",
                                            "order": "227"
                                        },
                                        {
                                            "code": "SH",
                                            "label": "Saint Helena",
                                            "order": "228"
                                        },
                                        {
                                            "code": "KN",
                                            "label": "Saint Kitts and Nevis",
                                            "order": "229"
                                        },
                                        {
                                            "code": "LC",
                                            "label": "Saint Lucia",
                                            "order": "230"
                                        },
                                        {
                                            "code": "MF",
                                            "label": "Saint-Martin (French part)",
                                            "order": "231"
                                        },
                                        {
                                            "code": "PM",
                                            "label": "Saint Pierre and Miquelon",
                                            "order": "232"
                                        },
                                        {
                                            "code": "VC",
                                            "label": "Saint Vincent and Grenadines",
                                            "order": "233"
                                        },
                                        {
                                            "code": "WS",
                                            "label": "Samoa",
                                            "order": "234"
                                        },
                                        {
                                            "code": "SM",
                                            "label": "San Marino",
                                            "order": "235"
                                        },
                                        {
                                            "code": "ST",
                                            "label": "Sao Tome and Principe",
                                            "order": "236"
                                        },
                                        {
                                            "code": "SA",
                                            "label": "Saudi Arabia",
                                            "order": "237"
                                        },
                                        {
                                            "code": "SN",
                                            "label": "Senegal",
                                            "order": "238"
                                        },
                                        {
                                            "code": "RS",
                                            "label": "Serbia",
                                            "order": "239"
                                        },
                                        {
                                            "code": "SC",
                                            "label": "Seychelles",
                                            "order": "240"
                                        },
                                        {
                                            "code": "SL",
                                            "label": "Sierra Leone",
                                            "order": "251"
                                        },
                                        {
                                            "code": "SG",
                                            "label": "Singapore",
                                            "order": "252"
                                        },
                                        {
                                            "code": "SX",
                                            "label": "Sint Maarten (Dutch part)",
                                            "order": "253"
                                        },
                                        {
                                            "code": "SK",
                                            "label": "Slovakia",
                                            "order": "254"
                                        },
                                        {
                                            "code": "SI",
                                            "label": "Slovenia",
                                            "order": "256"
                                        },
                                        {
                                            "code": "SB",
                                            "label": "Solomon Islands",
                                            "order": "257"
                                        },
                                        {
                                            "code": "SO",
                                            "label": "Somalia",
                                            "order": "258"
                                        },
                                        {
                                            "code": "ZA",
                                            "label": "South Africa",
                                            "order": "259"
                                        },
                                        {
                                            "code": "GS",
                                            "label": "South Georgia and the South Sandwich Islands",
                                            "order": "260"
                                        },
                                        {
                                            "code": "SS",
                                            "label": "South Sudan",
                                            "order": "261"
                                        },
                                        {
                                            "code": "ES",
                                            "label": "Spain",
                                            "order": "262"
                                        },
                                        {
                                            "code": "LK",
                                            "label": "Sri Lanka",
                                            "order": "263"
                                        },
                                        {
                                            "code": "ZZ",
                                            "label": "Stateless",
                                            "order": "264"
                                        },
                                        {
                                            "code": "SD",
                                            "label": "Sudan",
                                            "order": "265"
                                        },
                                        {
                                            "code": "SR",
                                            "label": "Suriname *",
                                            "order": "266"
                                        },
                                        {
                                            "code": "SJ",
                                            "label": "Svalbard and Jan Mayen Islands",
                                            "order": "267"
                                        },
                                        {
                                            "code": "SZ",
                                            "label": "Swaziland",
                                            "order": "268"
                                        },
                                        {
                                            "code": "SE",
                                            "label": "Sweden",
                                            "order": "269"
                                        },
                                        {
                                            "code": "CH",
                                            "label": "Switzerland",
                                            "order": "270"
                                        },
                                        {
                                            "code": "SY",
                                            "label": "Syrian Arab Republic (Syria)",
                                            "order": "271"
                                        },
                                        {
                                            "code": "TW",
                                            "label": "Taiwan",
                                            "order": "272"
                                        },
                                        {
                                            "code": "TJ",
                                            "label": "Tajikistan",
                                            "order": "273"
                                        },
                                        {
                                            "code": "TZ",
                                            "label": "Tanzania *, United Republic of",
                                            "order": "274"
                                        },
                                        {
                                            "code": "TH",
                                            "label": "Thailand",
                                            "order": "275"
                                        },
                                        {
                                            "code": "TL",
                                            "label": "Timor-Leste",
                                            "order": "276"
                                        },
                                        {
                                            "code": "TG",
                                            "label": "Togo",
                                            "order": "277"
                                        },
                                        {
                                            "code": "TK",
                                            "label": "Tokelau",
                                            "order": "278"
                                        },
                                        {
                                            "code": "TO",
                                            "label": "Tonga",
                                            "order": "279"
                                        },
                                        {
                                            "code": "TT",
                                            "label": "Trinidad and Tobago",
                                            "order": "280"
                                        },
                                        {
                                            "code": "TN",
                                            "label": "Tunisia",
                                            "order": "281"
                                        },
                                        {
                                            "code": "TR",
                                            "label": "Turkey",
                                            "order": "282"
                                        },
                                        {
                                            "code": "TM",
                                            "label": "Turkmenistan",
                                            "order": "283"
                                        },
                                        {
                                            "code": "TC",
                                            "label": "Turks and Caicos Islands",
                                            "order": "284"
                                        },
                                        {
                                            "code": "TV",
                                            "label": "Tuvalu",
                                            "order": "285"
                                        },
                                        {
                                            "code": "UG",
                                            "label": "Uganda",
                                            "order": "286"
                                        },
                                        {
                                            "code": "UA",
                                            "label": "Ukraine",
                                            "order": "287"
                                        },
                                        {
                                            "code": "AE",
                                            "label": "United Arab Emirates",
                                            "order": "288"
                                        },
                                        {
                                            "code": "GB",
                                            "label": "United Kingdom",
                                            "order": "289"
                                        },
                                        {
                                            "code": "US",
                                            "label": "United States of America",
                                            "order": "290"
                                        },
                                        {
                                            "code": "UM",
                                            "label": "United States Minor Outlying Islands",
                                            "order": "301"
                                        },
                                        {
                                            "code": "UY",
                                            "label": "Uruguay",
                                            "order": "302"
                                        },
                                        {
                                            "code": "UZ",
                                            "label": "Uzbekistan",
                                            "order": "303"
                                        },
                                        {
                                            "code": "VU",
                                            "label": "Vanuatu",
                                            "order": "304"
                                        },
                                        {
                                            "code": "VE",
                                            "label": "Venezuela (Bolivarian Republic of)",
                                            "order": "305"
                                        },
                                        {
                                            "code": "VN",
                                            "label": "Viet Nam",
                                            "order": "306"
                                        },
                                        {
                                            "code": "VI",
                                            "label": "Virgin Islands, US",
                                            "order": "307"
                                        },
                                        {
                                            "code": "WF",
                                            "label": "Wallis and Futuna Islands",
                                            "order": "308"
                                        },
                                        {
                                            "code": "EH",
                                            "label": "Western Sahara",
                                            "order": "309"
                                        },
                                        {
                                            "code": "YE",
                                            "label": "Yemen",
                                            "order": "310"
                                        },
                                        {
                                            "code": "ZM",
                                            "label": "Zambia",
                                            "order": "311"
                                        },
                                        {
                                            "code": "ZW",
                                            "label": "Zimbabwe",
                                            "order": "312"
                                        }
                                    ],
                                    "complex_fields": [],
                                    "collection_field_type": null
                                },
                                "security_classification": "PUBLIC",
                                "live_from": null,
                                "live_until": null,
                                "show_condition": null,
                                "acls": [
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "citizen"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-legalrep-solicitor"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-caseofficer"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-admofficer"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficeapc"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficelart"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-homeofficepou"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "caseworker-ia-respondentofficer"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-ia-iacjudge"
                                    },
                                    {
                                        "create": true,
                                        "read": true,
                                        "update": true,
                                        "delete": true,
                                        "role": "caseworker-wa-task-configuration"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_judge_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_legal_ops_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_admin_profile"
                                    },
                                    {
                                        "create": false,
                                        "read": true,
                                        "update": false,
                                        "delete": false,
                                        "role": "ia_specific_access_ctsc_profile"
                                    }
                                ],
                                "complexACLs": [],
                                "display_context": null,
                                "display_context_parameter": null,
                                "retain_hidden_value": null,
                                "formatted_value": null,
                                "category_id": null
                            }
                        ],
                        "collection_field_type": null
                    }
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": [
                    {
                        "value": {
                            "code": "FI"
                        },
                        "id": "dcc1b843-8472-475c-8f97-3278f453338b"
                    }
                ],
                "display_context": "MANDATORY",
                "display_context_parameter": "#COLLECTION(allowDelete,allowInsert,allowUpdate)",
                "show_condition": "appellantStateless=\"hasNationality\" AND appellantStateless!=\"isStateless\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantStateless",
                "label": "Nationality",
                "hidden": null,
                "value": "hasNationality",
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "FixedRadioList-appellantStateless",
                    "type": "FixedRadioList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "isStateless",
                            "label": "Stateless",
                            "order": "1"
                        },
                        {
                            "code": "hasNationality",
                            "label": "Has a nationality",
                            "order": "2"
                        }
                    ],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": "hasNationality",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantDateOfBirth",
                "label": "Date of birth",
                "hidden": null,
                "value": "1999-12-31",
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "Date",
                    "type": "Date",
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
                "formatted_value": "1999-12-31",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-system"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantFamilyName",
                "label": "Family name",
                "hidden": null,
                "value": "González",
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
                "order": null,
                "formatted_value": "González",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-system"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-caa"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-system-access"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantGivenNames",
                "label": "Given names",
                "hidden": null,
                "value": "José",
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
                "order": null,
                "formatted_value": "José",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-system"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-caa"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantTitle",
                "label": "Title",
                "hidden": null,
                "value": "Mr",
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
                "order": null,
                "formatted_value": "Mr",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantBasicDetailsTitle",
                "label": "Enter the basic details for your client.",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "decisionLetterReceivedDate",
                "label": "Date letter received",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": "For example, 03 04 2019",
                "field_type": {
                    "id": "Date",
                    "type": "Date",
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
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk=\"No\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "decisionLetterReceivedDateTitle",
                "label": "### What date was the Home Office decision letter received?",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk=\"No\"",
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "homeOfficeDecisionDate",
                "label": "Enter the date the decision letter was sent",
                "hidden": null,
                "value": "2020-10-21",
                "metadata": false,
                "hint_text": "You can usually find this stamped on the envelope. Alternatively enter the\ndate given on the decision letter.\n\nFor example, 03 04 2019",
                "field_type": {
                    "id": "Date",
                    "type": "Date",
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
                "formatted_value": "2020-10-21",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": "appellantInUk!=\"No\"",
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "homeOfficeReferenceNumber",
                "label": "Home Office Reference/Case ID",
                "hidden": null,
                "value": "A123456",
                "metadata": false,
                "hint_text": "Enter the 9-digit or 16-digit number on the decision letter",
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
                "formatted_value": "A123456",
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "homeOfficeDecisionTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-wa-task-configuration"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "dateClientLeaveUk",
                "label": "When did your client leave the UK?",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "Date",
                    "type": "Date",
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
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "departureDateTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "dateEntryClearanceDecision",
                "label": "Date Entry clearance decision letter received",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": "For example, 31 3 1980",
                "field_type": {
                    "id": "Date",
                    "type": "Date",
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
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "gwfReferenceNumber",
                "label": "Global Web Form (GWF) reference number",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": "Your GWF reference number was given to you when you first applied. You can find it on emails and letters from the Home Office about your application. For example GWF12345667",
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
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "entryClearanceDecisionTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "outOfCountryDecisionType",
                "label": "What type of decision are you appealing?",
                "hidden": null,
                "value": null,
                "metadata": false,
                "hint_text": null,
                "field_type": {
                    "id": "FixedRadioList-outOfCountryDecisionType",
                    "type": "FixedRadioList",
                    "min": null,
                    "max": null,
                    "regular_expression": null,
                    "fixed_list_items": [
                        {
                            "code": "refusalOfHumanRights",
                            "label": "A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016",
                            "order": "1"
                        },
                        {
                            "code": "refusalOfProtection",
                            "label": "A decision to refuse a protection or human rights claim where your client may only apply after leaving the UK",
                            "order": "2"
                        },
                        {
                            "code": "removalOfClient",
                            "label": "A decision either 1) to remove your client from the UK under the Immigration (European Economic Area) Regulations 2016, where they are currently outside the UK or 2) to deprive your client of British citizenship, where they are currently outside the UK",
                            "order": "3"
                        },
                        {
                            "code": "refusePermit",
                            "label": "A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.",
                            "order": "4"
                        }
                    ],
                    "complex_fields": [],
                    "collection_field_type": null
                },
                "validation_expr": null,
                "security_label": "PUBLIC",
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "outOfCountryDecisionTypeTitle",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "appellantInUk",
                "label": "Is your client currently living in the United Kingdom?",
                "hidden": null,
                "value": null,
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
                "order": null,
                "formatted_value": null,
                "display_context": "MANDATORY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": true,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "checklistTitle3",
                "label": "",
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
                "order": null,
                "formatted_value": null,
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": null,
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "homeOfficeReferenceNumberBeforeEdit",
                "label": "Internal flag managed by API for Home Office reference number before edit",
                "hidden": null,
                "value": "A123456",
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
                "order": null,
                "formatted_value": "A123456",
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": "checklistTitle4=\"DUMMY_VALUE_TO_HIDE_FIELD\"",
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            },
            {
                "id": "isOutOfCountryEnabled",
                "label": "Out of country feature flag value",
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
                "order": null,
                "formatted_value": "No",
                "display_context": "READONLY",
                "display_context_parameter": null,
                "show_condition": "checklistTitle4=\"DUMMY_VALUE_TO_HIDE_FIELD\"",
                "show_summary_change_option": false,
                "show_summary_content_option": null,
                "retain_hidden_value": null,
                "publish": false,
                "publish_as": null,
                "acls": [
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "citizen"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-legalrep-solicitor"
                    },
                    {
                        "create": true,
                        "read": true,
                        "update": true,
                        "delete": true,
                        "role": "caseworker-ia-caseofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-admofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficeapc"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficelart"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-homeofficepou"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-respondentofficer"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "caseworker-ia-iacjudge"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_judge_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_legal_ops_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_admin_profile"
                    },
                    {
                        "create": false,
                        "read": true,
                        "update": false,
                        "delete": false,
                        "role": "ia_specific_access_ctsc_profile"
                    }
                ]
            }
        ],
        "event_token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhdGhpMHJrM2M1c2tsbmtmdWJiNjZiMGw4aCIsInN1YiI6IjUyYjVhNGIwLWE2OWYtNDFjNS1hODlmLTg0Yjg4NGQ3YTA0ZCIsImlhdCI6MTY5MDM4NzQ0MCwiY2FzZS1pZCI6IjE2NjAxMzAiLCJldmVudC1pZCI6ImVkaXRBcHBlYWxBZnRlclN1Ym1pdCIsImNhc2UtdHlwZS1pZCI6IkFzeWx1bSIsImp1cmlzZGljdGlvbi1pZCI6IklBIiwiY2FzZS1zdGF0ZSI6ImZ0cGFEZWNpZGVkIiwiY2FzZS12ZXJzaW9uIjoiZTY5OTAzMTM1NzVkNDViYmRmYjgxMzg2YjlmOGIwMDNjMThlOTI3NGZiOWRiNGU1Mjk5OGI0N2ZmODZkYWQ1YSIsImVudGl0eS12ZXJzaW9uIjoyMn0.ORjv4hg3Eg9BaFz6K-vPxpwqLMtbssUEBYynRCZpoTc",
        "wizard_pages": [
            {
                "id": "editAppealAfterSubmitoutOfCountry",
                "label": null,
                "order": 1,
                "wizard_page_fields": [
                    {
                        "case_field_id": "homeOfficeReferenceNumberBeforeEdit",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "checklistTitle3",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantInUk",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "isOutOfCountryEnabled",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitoutOfCountryDecisionType",
                "label": null,
                "order": 7,
                "wizard_page_fields": [
                    {
                        "case_field_id": "outOfCountryDecisionType",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "outOfCountryDecisionTypeTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitentryClearanceDecision",
                "label": null,
                "order": 10,
                "wizard_page_fields": [
                    {
                        "case_field_id": "gwfReferenceNumber",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "entryClearanceDecisionTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "dateEntryClearanceDecision",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND outOfCountryDecisionType!=\"refusalOfProtection\" AND outOfCountryDecisionType!=\"removalOfClient\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitdepartureDate",
                "label": null,
                "order": 12,
                "wizard_page_fields": [
                    {
                        "case_field_id": "departureDateTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "dateClientLeaveUk",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND outOfCountryDecisionType=\"refusalOfProtection\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmithomeOfficeDecision",
                "label": null,
                "order": 14,
                "wizard_page_fields": [
                    {
                        "case_field_id": "decisionLetterReceivedDateTitle",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "decisionLetterReceivedDate",
                        "order": 5,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "homeOfficeDecisionTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "homeOfficeReferenceNumber",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "homeOfficeDecisionDate",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "appellantInUk=\"Yes\" OR outOfCountryDecisionType!=\"refusalOfHumanRights\" AND outOfCountryDecisionType!=\"refusePermit\"",
                "callback_url_mid_event": "http://ia-case-api-aat.service.core-compute-aat.internal/asylum/ccdMidEvent",
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitappellantBasicDetails",
                "label": null,
                "order": 16,
                "wizard_page_fields": [
                    {
                        "case_field_id": "appellantTitle",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantFamilyName",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantDateOfBirth",
                        "order": 5,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantGivenNames",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantBasicDetailsTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": "http://ia-case-api-aat.service.core-compute-aat.internal/asylum/ccdMidEvent",
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitappellantNationalities",
                "label": null,
                "order": 18,
                "wizard_page_fields": [
                    {
                        "case_field_id": "appellantStateless",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantNationalities",
                        "order": 6,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitappellantAddress",
                "label": null,
                "order": 20,
                "wizard_page_fields": [
                    {
                        "case_field_id": "appellantHasFixedAddress",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantAddress",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantHasFixedAddressLabel",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantAddressTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "appellantInUk!=\"No\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitoocAppellantAddress",
                "label": null,
                "order": 24,
                "wizard_page_fields": [
                    {
                        "case_field_id": "appellantCorrespAddressTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "hasCorrespondenceAddress",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantOutOfCountryAddress",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk=\"No\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitappellantContactPreference",
                "label": null,
                "order": 30,
                "wizard_page_fields": [
                    {
                        "case_field_id": "email",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantContactPreferenceTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "contactPreference",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "mobileNumber",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsponsor",
                "label": null,
                "order": 35,
                "wizard_page_fields": [
                    {
                        "case_field_id": "hasSponsor",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "appellantSponsorTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsponsorName",
                "label": null,
                "order": 40,
                "wizard_page_fields": [
                    {
                        "case_field_id": "sponsorFamilyName",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "sponsorGivenNames",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND hasSponsor=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsponsorAddress",
                "label": null,
                "order": 45,
                "wizard_page_fields": [
                    {
                        "case_field_id": "sponsorAddress",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND hasSponsor=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsponsorContactPreference",
                "label": null,
                "order": 50,
                "wizard_page_fields": [
                    {
                        "case_field_id": "sponsorContactPreference",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "sponsorMobileNumber",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "sponsorEmail",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND hasSponsor=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsponsorAuthorisation",
                "label": null,
                "order": 55,
                "wizard_page_fields": [
                    {
                        "case_field_id": "sponsorAuthorisation",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "isOutOfCountryEnabled=\"Yes\" AND appellantInUk!=\"Yes\" AND hasSponsor=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitdeportationOrderPage",
                "label": null,
                "order": 58,
                "wizard_page_fields": [
                    {
                        "case_field_id": "deportationOrderOptions",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "deportationOrderTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "outOfCountryDecisionType!=\"refusalOfHumanRights\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitnewMatters",
                "label": null,
                "order": 60,
                "wizard_page_fields": [
                    {
                        "case_field_id": "newMatters",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "newMattersTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "hasNewMatters",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmithasOtherAppeals",
                "label": null,
                "order": 65,
                "wizard_page_fields": [
                    {
                        "case_field_id": "hasOtherAppealsTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "hasOtherAppeals",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitotherAppeals",
                "label": null,
                "order": 70,
                "wizard_page_fields": [
                    {
                        "case_field_id": "otherAppeals",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "otherAppealsTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "hasOtherAppeals=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitlegalRepresentativeDetails",
                "label": null,
                "order": 75,
                "wizard_page_fields": [
                    {
                        "case_field_id": "legalRepCompany",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "legalRepName",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "legalRepReferenceNumber",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "legalRepDetailsHintAndTitle",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": null,
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            },
            {
                "id": "editAppealAfterSubmitsubmissionOutOfTimePage",
                "label": null,
                "order": 80,
                "wizard_page_fields": [
                    {
                        "case_field_id": "applicationOutOfTimeDocument",
                        "order": 4,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "applicationOutOfTimeExplanation",
                        "order": 3,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "submissionOutOfTime",
                        "order": 1,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    },
                    {
                        "case_field_id": "applicationOutOfTimeText",
                        "order": 2,
                        "page_column_no": null,
                        "complex_field_overrides": []
                    }
                ],
                "show_condition": "submissionOutOfTime=\"Yes\"",
                "callback_url_mid_event": null,
                "retries_timeout_mid_event": []
            }
        ],
        "show_summary": true,
        "show_event_notes": false,
        "end_button_label": "Save and continue",
        "can_save_draft": null,
        "access_granted": "BASIC,STANDARD",
        "access_process": "NONE",
        "title_display": "# Case record for ${appealReferenceNumber}",
        "supplementary_data": {
            "HMCTSServiceId": "BFA1"
        },
        "_links": {
            "self": {
                "href": "http://gateway-ccd.aat.platform.hmcts.net/internal/cases/1603298245304919/event-triggers/editAppealAfterSubmit?ignore-warning=false"
            }
        }
    }

}
