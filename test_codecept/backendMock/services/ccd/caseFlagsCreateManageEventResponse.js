module.exports = {
    "id": "manageFlags",
    "name": "Manage Flags",
    "description": "Manage Case Flags",
    "case_id": "1694603955401732",
    "case_fields": [
        {
            "id": "flagLauncher",
            "label": "Launch the Flags screen",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": null,
            "field_type": {
                "id": "FlagLauncher",
                "type": "FlagLauncher",
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
            "display_context_parameter": "#ARGUMENT(UPDATE)",
            "show_condition": null,
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "publish": false,
            "publish_as": null,
            "acls": [
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-judiciary"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-courtadmin"
                }
            ]
        },
        {
            "id": "respondentFlags",
            "label": "Flags for Respondent",
            "hidden": null,
            "value": {
                "details": [],
                "partyName": "Janet Smith",
                "roleOnCase": "Respondent"
            },
            "metadata": false,
            "hint_text": "Flags for Respondent",
            "field_type": {
                "id": "Flags",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "roleOnCase",
                        "label": "Flag Type",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "partyName",
                        "label": "Party Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "details",
                        "label": "Flag Details",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "FlagDetailsCollection",
                            "type": "Collection",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": {
                                "id": "FlagDetails",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "name",
                                        "label": "Name",
                                        "hidden": null,
                                        "order": 1,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "name_cy",
                                        "label": "Name in Welsh",
                                        "hidden": null,
                                        "order": 2,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue",
                                        "label": "Value",
                                        "hidden": null,
                                        "order": 3,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue_cy",
                                        "label": "Value in Welsh",
                                        "hidden": null,
                                        "order": 4,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeKey",
                                        "label": "Key",
                                        "hidden": null,
                                        "order": 5,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription",
                                        "label": "Other Description",
                                        "hidden": null,
                                        "order": 6,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription_cy",
                                        "label": "Other Description in Welsh",
                                        "hidden": null,
                                        "order": 7,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment",
                                        "label": "Comments",
                                        "hidden": null,
                                        "order": 8,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment_cy",
                                        "label": "Comments in Welsh",
                                        "hidden": null,
                                        "order": 9,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagUpdateComment",
                                        "label": "Update Comments",
                                        "hidden": null,
                                        "order": 10,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeModified",
                                        "label": "Modified Date",
                                        "hidden": null,
                                        "order": 11,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeCreated",
                                        "label": "Created Date",
                                        "hidden": null,
                                        "order": 12,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "path",
                                        "label": "Path",
                                        "hidden": null,
                                        "order": 13,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "PathCollection",
                                            "type": "Collection",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": {
                                                "id": "Text",
                                                "type": "Text",
                                                "min": null,
                                                "max": null,
                                                "regular_expression": null,
                                                "fixed_list_items": [],
                                                "complex_fields": [],
                                                "collection_field_type": null
                                            }
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
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "hearingRelevant",
                                        "label": "Requires Hearing",
                                        "hidden": null,
                                        "order": 14,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagCode",
                                        "label": "Reference Code",
                                        "hidden": null,
                                        "order": 15,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "status",
                                        "label": "Status",
                                        "hidden": null,
                                        "order": 16,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "availableExternally",
                                        "label": "Availability to Non Staff",
                                        "hidden": null,
                                        "order": 17,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    }
                                ],
                                "collection_field_type": null
                            }
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
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "details": [],
                "partyName": "Janet Smith",
                "roleOnCase": "Respondent"
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "[STATE]=\"IMPOSSIBLE\"",
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "publish": false,
            "publish_as": null,
            "acls": [
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-judiciary"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-courtadmin"
                }
            ]
        },
        {
            "id": "applicantFlags",
            "label": "Flags for Applicant",
            "hidden": null,
            "value": {
                "details": [],
                "partyName": "Bob Smith",
                "roleOnCase": "Applicant"
            },
            "metadata": false,
            "hint_text": "Flags for Applicant",
            "field_type": {
                "id": "Flags",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "roleOnCase",
                        "label": "Flag Type",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "partyName",
                        "label": "Party Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "details",
                        "label": "Flag Details",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "FlagDetailsCollection",
                            "type": "Collection",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": {
                                "id": "FlagDetails",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "name",
                                        "label": "Name",
                                        "hidden": null,
                                        "order": 1,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "name_cy",
                                        "label": "Name in Welsh",
                                        "hidden": null,
                                        "order": 2,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue",
                                        "label": "Value",
                                        "hidden": null,
                                        "order": 3,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue_cy",
                                        "label": "Value in Welsh",
                                        "hidden": null,
                                        "order": 4,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeKey",
                                        "label": "Key",
                                        "hidden": null,
                                        "order": 5,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription",
                                        "label": "Other Description",
                                        "hidden": null,
                                        "order": 6,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription_cy",
                                        "label": "Other Description in Welsh",
                                        "hidden": null,
                                        "order": 7,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment",
                                        "label": "Comments",
                                        "hidden": null,
                                        "order": 8,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment_cy",
                                        "label": "Comments in Welsh",
                                        "hidden": null,
                                        "order": 9,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagUpdateComment",
                                        "label": "Update Comments",
                                        "hidden": null,
                                        "order": 10,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeModified",
                                        "label": "Modified Date",
                                        "hidden": null,
                                        "order": 11,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeCreated",
                                        "label": "Created Date",
                                        "hidden": null,
                                        "order": 12,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "path",
                                        "label": "Path",
                                        "hidden": null,
                                        "order": 13,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "PathCollection",
                                            "type": "Collection",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": {
                                                "id": "Text",
                                                "type": "Text",
                                                "min": null,
                                                "max": null,
                                                "regular_expression": null,
                                                "fixed_list_items": [],
                                                "complex_fields": [],
                                                "collection_field_type": null
                                            }
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
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "hearingRelevant",
                                        "label": "Requires Hearing",
                                        "hidden": null,
                                        "order": 14,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagCode",
                                        "label": "Reference Code",
                                        "hidden": null,
                                        "order": 15,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "status",
                                        "label": "Status",
                                        "hidden": null,
                                        "order": 16,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "availableExternally",
                                        "label": "Availability to Non Staff",
                                        "hidden": null,
                                        "order": 17,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    }
                                ],
                                "collection_field_type": null
                            }
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
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "details": [],
                "partyName": "Bob Smith",
                "roleOnCase": "Applicant"
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "[STATE]=\"IMPOSSIBLE\"",
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "publish": false,
            "publish_as": null,
            "acls": [
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-judiciary"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-courtadmin"
                }
            ]
        },
        {
            "id": "caseFlags",
            "label": "Case Flags",
            "hidden": null,
            "value": {
                "details": [],
                "partyName": "Case",
                "roleOnCase": "Case"
            },
            "metadata": false,
            "hint_text": "Case Flags",
            "field_type": {
                "id": "Flags",
                "type": "Complex",
                "min": null,
                "max": null,
                "regular_expression": null,
                "fixed_list_items": [],
                "complex_fields": [
                    {
                        "id": "roleOnCase",
                        "label": "Flag Type",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "partyName",
                        "label": "Party Name",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
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
                        "security_classification": "PUBLIC",
                        "live_from": null,
                        "live_until": null,
                        "show_condition": null,
                        "acls": [
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": null,
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    },
                    {
                        "id": "details",
                        "label": "Flag Details",
                        "hidden": null,
                        "order": null,
                        "metadata": false,
                        "case_type_id": null,
                        "hint_text": null,
                        "field_type": {
                            "id": "FlagDetailsCollection",
                            "type": "Collection",
                            "min": null,
                            "max": null,
                            "regular_expression": null,
                            "fixed_list_items": [],
                            "complex_fields": [],
                            "collection_field_type": {
                                "id": "FlagDetails",
                                "type": "Complex",
                                "min": null,
                                "max": null,
                                "regular_expression": null,
                                "fixed_list_items": [],
                                "complex_fields": [
                                    {
                                        "id": "name",
                                        "label": "Name",
                                        "hidden": null,
                                        "order": 1,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "name_cy",
                                        "label": "Name in Welsh",
                                        "hidden": null,
                                        "order": 2,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue",
                                        "label": "Value",
                                        "hidden": null,
                                        "order": 3,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeValue_cy",
                                        "label": "Value in Welsh",
                                        "hidden": null,
                                        "order": 4,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "subTypeKey",
                                        "label": "Key",
                                        "hidden": null,
                                        "order": 5,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription",
                                        "label": "Other Description",
                                        "hidden": null,
                                        "order": 6,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "otherDescription_cy",
                                        "label": "Other Description in Welsh",
                                        "hidden": null,
                                        "order": 7,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment",
                                        "label": "Comments",
                                        "hidden": null,
                                        "order": 8,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagComment_cy",
                                        "label": "Comments in Welsh",
                                        "hidden": null,
                                        "order": 9,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagUpdateComment",
                                        "label": "Update Comments",
                                        "hidden": null,
                                        "order": 10,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeModified",
                                        "label": "Modified Date",
                                        "hidden": null,
                                        "order": 11,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "dateTimeCreated",
                                        "label": "Created Date",
                                        "hidden": null,
                                        "order": 12,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "path",
                                        "label": "Path",
                                        "hidden": null,
                                        "order": 13,
                                        "metadata": false,
                                        "case_type_id": null,
                                        "hint_text": null,
                                        "field_type": {
                                            "id": "PathCollection",
                                            "type": "Collection",
                                            "min": null,
                                            "max": null,
                                            "regular_expression": null,
                                            "fixed_list_items": [],
                                            "complex_fields": [],
                                            "collection_field_type": {
                                                "id": "Text",
                                                "type": "Text",
                                                "min": null,
                                                "max": null,
                                                "regular_expression": null,
                                                "fixed_list_items": [],
                                                "complex_fields": [],
                                                "collection_field_type": null
                                            }
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
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "hearingRelevant",
                                        "label": "Requires Hearing",
                                        "hidden": null,
                                        "order": 14,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "flagCode",
                                        "label": "Reference Code",
                                        "hidden": null,
                                        "order": 15,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "status",
                                        "label": "Status",
                                        "hidden": null,
                                        "order": 16,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    },
                                    {
                                        "id": "availableExternally",
                                        "label": "Availability to Non Staff",
                                        "hidden": null,
                                        "order": 17,
                                        "metadata": false,
                                        "case_type_id": null,
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
                                        "security_classification": "PUBLIC",
                                        "live_from": null,
                                        "live_until": null,
                                        "show_condition": null,
                                        "acls": [
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-judiciary"
                                            },
                                            {
                                                "create": true,
                                                "read": true,
                                                "update": true,
                                                "delete": false,
                                                "role": "caseworker-divorce-financialremedy-courtadmin"
                                            }
                                        ],
                                        "complexACLs": [],
                                        "display_context": null,
                                        "display_context_parameter": null,
                                        "retain_hidden_value": true,
                                        "formatted_value": null,
                                        "category_id": null
                                    }
                                ],
                                "collection_field_type": null
                            }
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
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-judiciary"
                            },
                            {
                                "create": true,
                                "read": true,
                                "update": true,
                                "delete": false,
                                "role": "caseworker-divorce-financialremedy-courtadmin"
                            }
                        ],
                        "complexACLs": [],
                        "display_context": null,
                        "display_context_parameter": "#COLLECTION(allowInsert,allowUpdate)",
                        "retain_hidden_value": true,
                        "formatted_value": null,
                        "category_id": null
                    }
                ],
                "collection_field_type": null
            },
            "validation_expr": null,
            "security_label": "PUBLIC",
            "order": null,
            "formatted_value": {
                "details": [],
                "partyName": "Case",
                "roleOnCase": "Case"
            },
            "display_context": "OPTIONAL",
            "display_context_parameter": null,
            "show_condition": "[STATE]=\"IMPOSSIBLE\"",
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": true,
            "publish": false,
            "publish_as": null,
            "acls": [
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-judiciary"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-divorce-financialremedy-courtadmin"
                }
            ]
        }
    ],
    "event_token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJzcGRnbHViNTA1djczbDVlZDFsbTlkM2dzbCIsInN1YiI6IjEyMGIzNjY1LTBiOGEtNGU4MC1hY2UwLTAxZDhkNjNjMTAwNSIsImlhdCI6MTY5NTIyMjg2MSwiY2FzZS1pZCI6IjkxMDgyOTAiLCJldmVudC1pZCI6Im1hbmFnZUZsYWdzIiwiY2FzZS10eXBlLWlkIjoiRmluYW5jaWFsUmVtZWR5Q29udGVzdGVkIiwianVyaXNkaWN0aW9uLWlkIjoiRElWT1JDRSIsImNhc2Utc3RhdGUiOiJjYXNlQWRkZWQiLCJjYXNlLXZlcnNpb24iOiIzZTIyODdlZmE0ZDgwZDYyNmY2Y2MyODMxNjFhNjI1Y2M5MzU5ZmEwODM3YjUzMmY0NWQ1OWZhN2E2Y2RhYzg1IiwiZW50aXR5LXZlcnNpb24iOjF9.Jod7Evprruw6q9orTsvEALJt1xQarcrrPG0ODfJj1fU",
    "wizard_pages": [
        {
            "id": "manageFlags1",
            "label": null,
            "order": 1,
            "wizard_page_fields": [
                {
                    "case_field_id": "respondentFlags",
                    "order": 3,
                    "page_column_no": 1,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "flagLauncher",
                    "order": 4,
                    "page_column_no": 1,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "caseFlags",
                    "order": 1,
                    "page_column_no": 1,
                    "complex_field_overrides": []
                },
                {
                    "case_field_id": "applicantFlags",
                    "order": 2,
                    "page_column_no": 1,
                    "complex_field_overrides": []
                }
            ],
            "show_condition": null,
            "callback_url_mid_event": null,
            "retries_timeout_mid_event": []
        }
    ],
    "show_summary": true,
    "show_event_notes": false,
    "end_button_label": null,
    "can_save_draft": null,
    "access_granted": "SPECIFIC",
    "access_process": "NONE",
    "title_display": "**${[CASE_REFERENCE]}  ${applicantLName}  vs ${respondentLName}**",
    "supplementary_data": {
        "HMCTSServiceId": "ABA2"
    },
    "_links": {
        "self": {
            "href": "http://gateway-ccd.aat.platform.hmcts.net/internal/cases/1694603955401732/event-triggers/manageFlags?ignore-warning=false"
        }
    }
}
