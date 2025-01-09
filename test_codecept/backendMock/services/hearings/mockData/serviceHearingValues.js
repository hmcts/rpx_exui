

const loadServicehearingValues = {
    "hmctsServiceID": "ABA5",
    "hmctsInternalCaseName": "1690807693531270_John Doe Vs Mary Richards",
    "publicCaseName": "Re-Minor",
    "caseAdditionalSecurityFlag": false,
    "caseCategories": [
        {
            "categoryType": "caseType",
            "categoryValue": "ABA5-PRL",
            "categoryParent": null
        },
        {
            "categoryType": "caseSubType",
            "categoryValue": "ABA5-PRL",
            "categoryParent": "ABA5-PRL"
        }
    ],
    "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1690807693531270#Case File View",
    "externalCaseReference": "",
    "caseManagementLocationCode": "283922",
    "autoListFlag": false,
    "hearingType": "",
    "hearingWindow": {
        "dateRangeStart": "",
        "dateRangeEnd": "",
        "firstDateTimeMustBe": ""
    },
    "duration": 0,
    "hearingPriorityType": "Standard",
    "numberOfPhysicalAttendees": 0,
    "hearingInWelshFlag": false,
    "hearingLocations": [
        {
            "locationType": "court",
            "locationId": "283922"
        }
    ],
    "facilitiesRequired": [],
    "listingComments": "",
    "hearingRequester": "",
    "privateHearingRequiredFlag": true,
    "caseInterpreterRequiredFlag": false,
    "panelRequirements": null,
    "leadJudgeContractType": "",
    "judiciary": {},
    "hearingIsLinkedFlag": false,
    "parties": [
        {
            "partyID": "209334d6-97e3-44ef-a206-58468f6bc43a",
            "partyType": "IND",
            "partyName": "mock party",
            "partyRole": "APPL",
            "individualDetails": {
                "firstName": "First Applicant FN",
                "lastName": "First Applicant LN",
                "interpreterLanguage": "",
                "reasonableAdjustments": [
                ],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "applicant@test.com"
                ],
                "hearingChannelPhone": [
                    "1234567890"
                ],
                "relatedParties": []
            }
        },
        {
            "partyID": "648a54a3-3adb-4abc-88c0-e0fc2158973c",
            "partyType": "ORG",
            "partyName": "Aat orgtest65",
            "partyRole": "LGRP",
            "organisationDetails": {
                "name": "Aat orgtest65",
                "organisationType": "ORG",
                "cftOrganisationID": "ECKZ4BE"
            }
        },
        {
            "partyID": "84f10300-c2ad-4733-8d26-46b5ebfc9450",
            "partyType": "IND",
            "partyName": "Solicitor First Name Solicitor Last Name",
            "partyRole": "LGRP",
            "individualDetails": {
                "firstName": "Solicitor First Name",
                "lastName": "Solicitor Last Name",
                "hearingChannelEmail": [
                    "solicitor@TEST.COM"
                ]
            }
        },
        {
            "partyID": "107f3aa0-991a-48be-a3a2-4c5145576e6b",
            "partyType": "IND",
            "partyName": "Mary Richards",
            "partyRole": "RESP",
            "individualDetails": {
                "firstName": "Mary",
                "lastName": "Richards",
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "repondent1@example.net"
                ],
                "hearingChannelPhone": [],
                "relatedParties": []
            }
        },
        {
            "partyID": "b8f8c362-77bc-479a-b8ee-ae3f6e4c9475",
            "partyType": "IND",
            "partyName": "Elise Lynn",
            "partyRole": "RESP",
            "individualDetails": {
                "firstName": "Elise",
                "lastName": "Lynn",
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "respondent2@example.net"
                ],
                "hearingChannelPhone": [],
                "relatedParties": []
            }
        },
        {
            "partyID": "98ffefe7-ad04-4139-87e1-fffdb2bf4c99",
            "partyType": "IND",
            "partyName": "David Carman",
            "partyRole": "RESP",
            "individualDetails": {
                "firstName": "David",
                "lastName": "Carman",
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "respondent3@example.net"
                ],
                "hearingChannelPhone": [],
                "relatedParties": []
            }
        }
    ],
    "caseFlags": {
        "flags": [
            {
                "partyId": "P1",
                "partyName": "Jane Smith",
                "flagParentId": "PARENT_0",
                "flagId": "RA001",
                "flagDescription": "Sreasonable adjustment flags",
                "flagStatus": "ACTIVE"
            }, {
                "partyId": "P1",
                "partyName": "Jane Smith 2",
                "flagParentId": "PARENT_0",
                "flagId": "PF0015",
                "flagDescription": "language interpreter",
                "flagStatus": "ACTIVE"
            }, {
                "partyId": "P1",
                "partyName": "Jane Smith 2",
                "flagParentId": "PARENT_0",
                "flagId": "OT001",
                "flagDescription": "others",
                "flagStatus": "ACTIVE"
            }
        ],
        "flagAmendURL": '/'
    },
    "screenFlow": [
        {
            "navigation": [
                {
                    "resultValue": "hearing-facilities"
                }
            ],
            "screenName": "hearing-requirements"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-stage"
                }
            ],
            "screenName": "hearing-facilities"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-attendance"
                }
            ],
            "screenName": "hearing-stage"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-venue"
                }
            ],
            "screenName": "hearing-attendance"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-welsh",
                    "conditionOperator": "INCLUDE",
                    "conditionValue": "7"
                },
                {
                    "resultValue": "hearing-judge",
                    "conditionOperator": "NOT INCLUDE",
                    "conditionValue": "7"
                }
            ],
            "conditionKey": "regionId",
            "screenName": "hearing-venue"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-judge"
                }
            ],
            "screenName": "hearing-welsh"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-timing"
                }
            ],
            "screenName": "hearing-judge"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-link"
                }
            ],
            "screenName": "hearing-timing"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-additional-instructions"
                }
            ],
            "screenName": "hearing-link"
        },
        {
            "navigation": [
                {
                    "resultValue": "hearing-create-edit-summary"
                }
            ],
            "screenName": "hearing-additional-instructions"
        }
    ],
    "hearingChannels": [],
    "caserestrictedFlag": false,
    "caseSLAStartDate": null
};

module.exports = loadServicehearingValues