
const hearing = {
    "requestDetails": {
        "status": "UPDATE_REQUESTED",
        "timestamp": "2023-11-06T14:01:32.836316",
        "versionNumber": 1,
        "hearingRequestID": "2000007311"
    },
    "hearingDetails": {
        "hearingType": "ABA5-FOF",
        "hearingWindow": {
            "firstDateTimeMustBe": "2024-02-13T00:00:00"
        },
        "duration": 120,
        "hearingPriorityType": "Standard",
        "numberOfPhysicalAttendees": 0,
        "hearingInWelshFlag": false,
        "hearingLocations": [
            {
                "locationType": "court",
                "locationId": "827534"
            }
        ],
        "privateHearingRequiredFlag": true,
        "panelRequirements": {
            "roleType": [
                "19",
                "30"
            ],
            "authorisationTypes": [],
            "authorisationSubType": [],
            "panelPreferences": [],
            "panelSpecialisms": []
        },
        "hearingIsLinkedFlag": false,
        "hearingChannels": [
            "INTER"
        ],
        "autolistFlag": false
    },
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1698398901677065",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1698398901677065#Case File View",
        "hmctsInternalCaseName": "1698398901677065_Cafcass scenario4",
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
        "caseManagementLocationCode": "827534",
        "caserestrictedFlag": false,
        "caseSLAStartDate": "2023-10-27"
    },
    "partyDetails": [
        {
            "partyID": "74cd4c05-ca05-41f6-a215-98150714e31f",
            "partyType": "ORG",
            "partyRole": "LGRP",
            "organisationDetails": {
                "name": "org-name9",
                "organisationType": "ORG",
                "cftOrganisationID": "36D1IN0"
            }
        },
        {
            "partyID": "c13fd753-043c-4c62-a85c-0e45796714cb",
            "partyType": "IND",
            "partyRole": "APPL",
            "individualDetails": {
                "title": null,
                "firstName": "ApplC10001Fn",
                "lastName": "ApplC10001Ln",
                "preferredHearingChannel": "INTER",
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "test01@test.com"
                ],
                "hearingChannelPhone": [
                    "123333232323"
                ],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "a59233cf-8535-4551-bab7-3a5aeb3416c7",
            "partyType": "IND",
            "partyRole": "LGRP",
            "individualDetails": {
                "title": null,
                "firstName": "TestC10001RepFn",
                "lastName": "TestC10001RepLn",
                "preferredHearingChannel": "INTER",
                "interpreterLanguage": null,
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": null,
                "hearingChannelEmail": [
                    "test@test.com"
                ],
                "hearingChannelPhone": [],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "afd259b3-066c-43f4-8c7a-823bef896803",
            "partyType": "IND",
            "partyRole": "RESP",
            "individualDetails": {
                "title": null,
                "firstName": "TestC10001RespFn",
                "lastName": "TestC10001RespLn",
                "preferredHearingChannel": "INTER",
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": false,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [
                    "testresp@test.com"
                ],
                "hearingChannelPhone": [
                    "1231231231"
                ],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        }
    ],
    "hearingResponse": {
        "hearingDaySchedule": [
            {
                "hearingStartDateTime": "2024-02-13T10:00:00",
                "hearingEndDateTime": "2024-02-13T12:00:00",
                "hearingVenueId": "827534",
                "hearingRoomId": "Aberystwyth Courtroom 01",
                "hearingJudgeId": "",
                "panelMemberIds": [],
                "attendees": [
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "c13fd753-043c-4c62-a85c-0e45796714cb"
                    },
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "afd259b3-066c-43f4-8c7a-823bef896803"
                    },
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "a59233cf-8535-4551-bab7-3a5aeb3416c7"
                    },
                    {
                        "hearingSubChannel": null,
                        "partyID": "74cd4c05-ca05-41f6-a215-98150714e31f"
                    }
                ],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "LISTED",
        "listingStatus": "FIXED",
        "receivedDateTime": "2023-11-06T15:10:01",
        "requestVersion": 1
    }
}

module.exports = hearing;

