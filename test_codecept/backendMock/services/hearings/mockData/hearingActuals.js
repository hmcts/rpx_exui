
const data = {
    "hmcStatus": "COMPLETED",
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1701706095671139",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1701706095671139#Case File View",
        "hmctsInternalCaseName": "1701706095671139_Test4444",
        "publicCaseName": "Re-Minor",
        "caseAdditionalSecurityFlag": false,
        "caseInterpreterRequiredFlag": false,
        "caseCategories": [
            {
                "categoryType": "caseType",
                "categoryValue": "ABA5-PRL"
            },
            {
                "categoryType": "caseSubType",
                "categoryValue": "ABA5-PRL",
                "categoryParent": "ABA5-PRL"
            }
        ],
        "caseManagementLocationCode": "234946",
        "caserestrictedFlag": false,
        "caseSLAStartDate": "2023-12-06"
    },
    "hearingPlanned": {
        "plannedHearingType": "ABA5-FFH",
        "plannedHearingDays": [
            {
                "plannedStartTime": "2023-12-07T10:00:00",
                "plannedEndTime": "2023-12-07T16:00:00",
                "parties": [
                    {
                        "partyID": "624adbee-9ecb-4221-af1b-a26925361811",
                        "partyRole": "APPL",
                        "individualDetails": {
                            "title": null,
                            "firstName": "Applicant1",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "21efde92-50a0-409c-808c-d5ad1364c19d",
                        "partyRole": "RESP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "respond",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "6d26eb0f-b589-4fd3-8d90-d692cca1d494",
                        "partyRole": "LGRP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "Jhon",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "86969b15-37fc-4617-91a1-4dc0eb4872b0",
                        "partyRole": "LGRP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "respondent",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "48a58bb4-8ae1-444c-b590-3880dc45276d",
                        "partyRole": "LGRP",
                        "individualDetails": null,
                        "organisationDetails": {
                            "name": "org-name9",
                            "cftOrganisationID": "36D1IN0"
                        },
                        "partyChannelSubType": null
                    }
                ]
            },
            {
                "plannedStartTime": "2023-12-06T10:00:00",
                "plannedEndTime": "2023-12-06T16:00:00",
                "parties": [
                    {
                        "partyID": "624adbee-9ecb-4221-af1b-a26925361811",
                        "partyRole": "APPL",
                        "individualDetails": {
                            "title": null,
                            "firstName": "Applicant1",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "21efde92-50a0-409c-808c-d5ad1364c19d",
                        "partyRole": "RESP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "respond",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "6d26eb0f-b589-4fd3-8d90-d692cca1d494",
                        "partyRole": "LGRP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "Jhon",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "86969b15-37fc-4617-91a1-4dc0eb4872b0",
                        "partyRole": "LGRP",
                        "individualDetails": {
                            "title": null,
                            "firstName": "respondent",
                            "lastName": "data 1"
                        },
                        "organisationDetails": null,
                        "partyChannelSubType": "INTER"
                    },
                    {
                        "partyID": "48a58bb4-8ae1-444c-b590-3880dc45276d",
                        "partyRole": "LGRP",
                        "individualDetails": null,
                        "organisationDetails": {
                            "name": "org-name9",
                            "cftOrganisationID": "36D1IN0"
                        },
                        "partyChannelSubType": null
                    }
                ]
            }
        ]
    },
    "hearingActuals": {
        "hearingOutcome": {
            "hearingType": "ABA5-FFH",
            "hearingFinalFlag": false,
            "hearingResult": "COMPLETED",
            "hearingResultReasonType": "",
            "hearingResultDate": "2023-12-06"
        },
        "actualHearingDays": []
    }
}

module.exports = data