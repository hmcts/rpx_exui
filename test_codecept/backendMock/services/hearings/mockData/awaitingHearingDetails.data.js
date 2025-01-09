const hearing = {
    "requestDetails": {
        "status": "AWAITING_ACTUALS",
        "timestamp": "2023-03-13T16:16:40.128402",
        "versionNumber": 1,
        "hearingRequestID": "2000005127"
    },
    "hearingDetails": {
        "listingAutoChangeReasonCode": "user-added-comments",
        "hearingType": "ABA5-JMT",
        "hearingWindow": {
            "dateRangeStart": "2023-03-29",
            "dateRangeEnd": "2023-05-29"
        },
        "duration": 10995,
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
            "11"
        ],
        "listingComments": "This hearing request will need to be manually reviewed before listing if you enter additional details.\n",
        "privateHearingRequiredFlag": true,
        "panelRequirements": {
            "roleType": [
                "19"
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
            "partyID": "402c11bc-25e7-409b-ac7f-e23730d3b234",
            "partyType": "ORG",
            "partyRole": "LGRP",
            "organisationDetails": {
                "name": "My New Org",
                "organisationType": "ORG",
                "cftOrganisationID": "WIC75A3"
            }
        },
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
                "vulnerableFlag": false,
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
                "vulnerableFlag": false,
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
                "hearingStartDateTime": "2023-04-03T09:00:00",
                "hearingEndDateTime": "2023-04-03T15:00:00",
                "hearingVenueId": "497679",
                "hearingRoomId": "Coventry Combined Chambers 02",
                "hearingJudgeId": null,
                "panelMemberIds": null,
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
                    },
                    {
                        "hearingSubChannel": null,
                        "partyID": "402c11bc-25e7-409b-ac7f-e23730d3b234"
                    }
                ],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "LISTED",
        "listingStatus": "FIXED",
        "receivedDateTime": "2023-03-14T07:45:02",
        "requestVersion": 1
    }
}

module.exports = hearing
