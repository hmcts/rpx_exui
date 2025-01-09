

const ccdFieldTemplate = {
    "id": "testTextField",
    "label": "Organisation ID",
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

    ],
    "complexACLs": [],
    "display_context": null,
    "display_context_parameter": null,
    "formatted_value": null,
    "default_value": null,
    "retain_hidden_value": null,
    "show_summary_change_option": true,
    "show_summary_content_option": null,
    "retain_hidden_value": null
};


class CCDcaseField {

    currentCaseField = null;

    getCCDFieldTemplateCopy(fieldConfig) {
        const template = JSON.parse(JSON.stringify(ccdFieldTemplate));

        switch (fieldConfig.type) {
            case "AddressGlobalUK":
            case "AddressGlobal":
            case "AddressUK":
                template.field_type.id = fieldConfig.type;
                template.field_type.type = "Complex";
                const add1 = this.getCCDFieldTemplateCopy({ type: "Text", id: "AddressLine1", label: "Building and Street" });
                add1.field_type.id = "TextMax150";
                const add2 = this.getCCDFieldTemplateCopy({ type: "Text", id: "AddressLine2", label: "Address Line 2" });
                add2.field_type.id = "TextMax50";
                const add3 = this.getCCDFieldTemplateCopy({ type: "Text", id: "AddressLine3", label: "Address Line 3" });
                add3.field_type.id = "TextMax50";
                const postTown = this.getCCDFieldTemplateCopy({ type: "Text", id: "PostTown", label: "Town or City" });
                postTown.field_type.id = "TextMax50";
                const county = this.getCCDFieldTemplateCopy({ type: "Text", id: "County", label: "County" });
                county.field_type.id = "TextMax50";
                const postCode = this.getCCDFieldTemplateCopy({ type: "Text", id: "PostCode", label: "Postcode/Zipcode" });
                postCode.field_type.id = "TextMax14";
                const country = this.getCCDFieldTemplateCopy({ type: "Text", id: "Country", label: "Country" });
                country.field_type.id = "TextMax50";
                template.display_context = "COMPLEX";
                template.field_type.complex_fields = [add1, add2, add3, postTown, county, postCode, country];
                break;
            case "AddressLine1":
                template.field_type.id = "TextMax150";
                template.field_type.type = "Text"
                template.field_type.max = 150;
                break;
            case "AddressLine2":
            case "AddressLine3":
            case "PostTown":
            case "county":
            case "Country":
                template.field_type.id = "TextMax50";
                template.field_type.type = "Text"
                template.field_type.max = 50;
                break;
            case "PostCode":
                template.field_type.id = "TextMax14";
                template.field_type.type = "Text"
                template.field_type.max = 14;
                break
            case "OrderSummary":
            case "CaseLink":

                template.field_type.id = "CaseLink";
                template.field_type.type = "Complex";

                const caseRef = this.getCCDFieldTemplateCopy({ type: "Text", id: "CaseReference", label: "Case Reference" });
                caseRef.field_type.id = "TextCaseReference";
                caseRef.field_type.regular_expression = "(?:^[0-9]{16}$|^\\d{4}-\\d{4}-\\d{4}-\\d{4}$)";
                template.field_type.complex_fields = [caseRef];
                
                break;
            case "Organisation":
                template.field_type.id = "OrganisationPolicy";
                template.field_type.type = "Complex";
                template.display_context = "COMPLEX";
                const OrgPolicyCaseAssignedRole = this.getCCDFieldTemplateCopy({ type: "Text", id: "OrgPolicyCaseAssignedRole", label: "Case Assigned Role" });
                const OrgReference = this.getCCDFieldTemplateCopy({ type: "Text", id: "OrgPolicyReference", label: "Reference" });

                const organisation = this.getCCDFieldTemplateCopy({ type: "Complex", id: "Organisation", label: "Organisation" });
                organisation.field_type.id = "Organisation";
                const orgId = this.getCCDFieldTemplateCopy({ type: "Text", id: "OrganisationID", label: "Organisation ID" });
                const orgNaMe = this.getCCDFieldTemplateCopy({ type: "Text", id: "OrganisationName", label: "Name" });
                organisation.field_type.complex_fields = [orgId, orgNaMe];

                const PrepopulateOrgVal = this.getCCDFieldTemplateCopy({ type: "YesOrNo", id: "PrepopulateToUsersOrganisation", label: "Prepopulate User Organisation" });


                template.field_type.complex_fields = [OrgPolicyCaseAssignedRole, organisation, OrgReference, PrepopulateOrgVal];
                break;

            default:
                template.field_type.id = fieldConfig.type;
                template.field_type.type = fieldConfig.type;
        }


        if (fieldConfig.fixed_list_items || fieldConfig.list) {
            let listItems = fieldConfig.fixed_list_items ? fieldConfig.fixed_list_items : fieldConfig.list;
            template.field_type.fixed_list_items = listItems;
        }


        template.id = fieldConfig.id ? fieldConfig.id : fieldConfig.label ? this.toCamelCase(fieldConfig.label) : "No id or label provided";
        template.label = fieldConfig.label ? fieldConfig.label : fieldConfig.id ? this.toDeCamelize(fieldConfig.id) : "Nameless field";
        this.ConfigureCCDField(template, fieldConfig);
        if (fieldConfig.value) {
            template.value = fieldConfig.value
        }

        if (fieldConfig.props) {
            this.setObjectProps(template, fieldConfig.props);
        }
        return template;
    }

    ConfigureCCDField(parentField, fieldConfig) {

        if (fieldConfig.type === "Complex" && fieldConfig.complex_fields) {
            fieldConfig.complex_fields.forEach((complexFieldConfig) => {
                // console.log(" complex field config " + JSON.stringify(complexFieldConfig));

                const complexCCDField = this.getCCDFieldTemplateCopy(complexFieldConfig)
                parentField.field_type.complex_fields.push(complexCCDField);
                // this.ConfigureCCDField(complexCCDField, complexFieldConfig);
            });
        } else if (fieldConfig.type === "Collection" && fieldConfig.collection_field_type) {
            const collectionCCDField = this.getCCDFieldTemplateCopy(fieldConfig.collection_field_type)
            parentField.field_type.collection_field_type = collectionCCDField.field_type;
            // this.ConfigureCCDField(collectionCCDField, fieldConfig.collectionField);

        }
    }

    setObjectProps(fieldObj, props) {
        Object.keys(props).forEach(key => {
            fieldObj[key] = props[key];
        });
    }

    toCamelCase(str) {
        return str.split(' ').map(function (word, index) {
            // If it is the first word make sure to lowercase all the chars.
            if (index == 0) {
                return word.toLowerCase();
            }
            // If it is not the first word only upper case the first char and lowercase the rest.
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }

    toDeCamelize(str) {
        // console.log("str of toDeCamelize : " + str);
        return str
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
            .toLowerCase();
    }


}

module.exports = CCDcaseField;