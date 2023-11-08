module.exports = {
    "id": "caseFileView",
    "label": "Case File View",
    "order": 13,
    "fields": [
        {
            "id": "componentLauncher",
            "label": "Component Launcher",
            "hidden": null,
            "value": null,
            "metadata": false,
            "hint_text": null,
            "field_type": {
                "id": "ComponentLauncher",
                "type": "ComponentLauncher",
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
            "display_context_parameter": "#ARGUMENT(CaseFileView)",
            "show_condition": null,
            "show_summary_change_option": null,
            "show_summary_content_option": null,
            "retain_hidden_value": null,
            "publish": null,
            "publish_as": null,
            "acls": [
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-caa"
                },
                {
                    "create": false,
                    "read": true,
                    "update": false,
                    "delete": false,
                    "role": "caseworker-approver"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-privatelaw-courtadmin"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-privatelaw-cafcass"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-privatelaw-judge"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-privatelaw-la"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "caseworker-privatelaw-systemupdate"
                },
                {
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": false,
                    "role": "ctsc-team-leader"
                },
                {
                    "create": false,
                    "read": true,
                    "update": false,
                    "delete": false,
                    "role": "caseworker-privatelaw-externaluser-viewonly"
                },
                {
                    "create": false,
                    "read": true,
                    "update": false,
                    "delete": false,
                    "role": "caseworker-privatelaw-readonly"
                }
            ]
        }
    ],
    "role": null,
    "show_condition": "[STATE]!=\"AWAITING_SUBMISSION_TO_HMCTS\" AND [STATE]!=\"SUBMITTED_NOT_PAID\""
};
