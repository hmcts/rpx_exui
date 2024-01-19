const hearing = {
    "requestDetails": {
        "status": "COMPLETED",
        "timestamp": "2023-03-10T14:31:26.750413",
        "versionNumber": 1,
        "hearingRequestID": "2000005109"
    },
    "hearingDetails": {
        "listingAutoChangeReasonCode": "user-added-comments",
        "hearingType": "ABA5-DIR",
        "hearingWindow": {
            "dateRangeStart": "2023-03-28",
            "dateRangeEnd": "2023-05-29"
        },
        "duration": 11000,
        "hearingPriorityType": "Standard",
        "numberOfPhysicalAttendees": 0,
        "hearingInWelshFlag": false,
        "hearingLocations": [
            {
                "locationType": "court",
                "locationId": "497679"
            }
        ],
        "facilitiesRequired": [
            "10"
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
            "ONPPRS"
        ],
        "autolistFlag": false
    },
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1678454800421503",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1678454800421503#Case File View",
        "hmctsInternalCaseName": "1678454800421503_hallow 10/03",
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
        "caseManagementLocationCode": "20262",
        "caserestrictedFlag": false,
        "caseSLAStartDate": "2023-03-10"
    },
    "partyDetails": [
        {
            "partyID": "04c01933-3fbb-4c8f-bd42-da09064a36d4",
            "partyType": "IND",
            "partyRole": "APPL",
            "individualDetails": {
                "title": null,
                "firstName": "appfirstname",
                "lastName": "applastname",
                "preferredHearingChannel": null,
                "interpreterLanguage": "",
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": "",
                "hearingChannelEmail": [],
                "hearingChannelPhone": [
                    "07407095159"
                ],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "fcfd8c99-dea2-42f5-b1b5-5f2dc6e68321",
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
        },
        {
            "partyID": "c1b5e151-52f6-497e-a725-10d017380ab7",
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
        }
    ],
    "hearingResponse": {
        "hearingDaySchedule": [
            {
                "hearingStartDateTime": "2023-04-19T09:00:00",
                "hearingEndDateTime": "2023-04-19T15:00:00",
                "hearingVenueId": "20262",
                "hearingRoomId": "RCJ Courtroom 01",
                "hearingJudgeId": "4925295",
                "panelMemberIds": [],
                "attendees": [
                    {
                        "hearingSubChannel": null,
                        "partyID": "04c01933-3fbb-4c8f-bd42-da09064a36d4"
                    },
                    {
                        "hearingSubChannel": null,
                        "partyID": "fcfd8c99-dea2-42f5-b1b5-5f2dc6e68321"
                    },
                    {
                        "hearingSubChannel": null,
                        "partyID": "c1b5e151-52f6-497e-a725-10d017380ab7"
                    }
                ],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "LISTED",
        "listingStatus": "FIXED",
        "receivedDateTime": "2023-03-10T16:02:05",
        "requestVersion": 1
    }
}

module.exports = hearing;
