const hearing = {
    "requestDetails": {
        "status": "COMPLETED",
        "timestamp": "2023-03-08T10:12:28.318469",
        "versionNumber": 1,
        "hearingRequestID": "2000005096"
    },
    "hearingDetails": {
        "listingAutoChangeReasonCode": "user-added-comments",
        "hearingType": "ABA5-ALL",
        "hearingWindow": {
            "dateRangeStart": "2024-11-22",
            "dateRangeEnd": "2024-11-30"
        },
        "duration": 120,
        "hearingPriorityType": "Standard",
        "numberOfPhysicalAttendees": 0,
        "hearingInWelshFlag": false,
        "hearingLocations": [
            {
                "locationType": "court",
                "locationId": "20001"
            }
        ],
        "facilitiesRequired": [
            "9"
        ],
        "listingComments": "This hearing request will need to be manually reviewed before listing if you enter additional details.\n",
        "privateHearingRequiredFlag": true,
        "panelRequirements": {
            "roleType": [
                "51"
            ],
            "authorisationTypes": [],
            "authorisationSubType": [],
            "panelPreferences": [],
            "panelSpecialisms": []
        },
        "hearingIsLinkedFlag": true,
        "hearingChannels": [
            "ABA1-HRC"
        ],
        "autolistFlag": false
    },
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1678209414171716",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1678209414171716#Case File View",
        "hmctsInternalCaseName": "1678209414171716_hallow 07/03",
        "publicCaseName": "Re-Minor",
        "caseAdditionalSecurityFlag": true,
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
        "caseManagementLocationCode": "20262",
        "caserestrictedFlag": false,
        "caseSLAStartDate": "2023-03-08"
    },
    "partyDetails": [
        {
            "partyID": "30b71661-bc9a-4461-b2b3-ae9fd3bc89ef",
            "partyType": "IND",
            "partyRole": "LGRP",
            "individualDetails": {
                "title": null,
                "firstName": "repfirstname",
                "lastName": "replastname",
                "preferredHearingChannel": null,
                "interpreterLanguage": null,
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": null,
                "hearingChannelEmail": [
                    "abcd1223@gov.uk"
                ],
                "hearingChannelPhone": [],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "ddbd08a1-7450-41d9-a10e-470c325e5cb9",
            "partyType": "IND",
            "partyRole": "APPL",
            "individualDetails": {
                "title": null,
                "firstName": "Shirley",
                "lastName": "King",
                "preferredHearingChannel": null,
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [],
                "hearingChannelPhone": [
                    "074070951559"
                ],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "ccbee022-46c9-4918-94a9-ed0916ef26f3",
            "partyType": "IND",
            "partyRole": "RESP",
            "individualDetails": {
                "title": null,
                "firstName": "resfirstname",
                "lastName": "reslastname",
                "preferredHearingChannel": null,
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [],
                "hearingChannelPhone": [],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        }
    ],
    "hearingResponse": {
        "hearingDaySchedule": [
            {
                "hearingStartDateTime": "2023-05-04T09:00:00",
                "hearingEndDateTime": "2023-05-04T15:00:00",
                "hearingVenueId": "20262",
                "hearingRoomId": "RCJ Courtroom 01",
                "hearingJudgeId": "4925295",
                "panelMemberIds": [],
                "attendees": [
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "ddbd08a1-7450-41d9-a10e-470c325e5cb9"
                    },
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "ccbee022-46c9-4918-94a9-ed0916ef26f3"
                    },
                    {
                        "hearingSubChannel": "INTER",
                        "partyID": "30b71661-bc9a-4461-b2b3-ae9fd3bc89ef"
                    }
                ],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "LISTED",
        "listingStatus": "FIXED",
        "receivedDateTime": "2023-03-08T11:06:01",
        "requestVersion": 1
    }
}

module.exports = hearing;
