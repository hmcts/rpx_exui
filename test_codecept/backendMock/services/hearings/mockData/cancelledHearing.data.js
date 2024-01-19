const hearing = {
    "requestDetails": {
        "status": "CANCELLED",
        "timestamp": "2022-12-19T15:21:01.095486",
        "versionNumber": 3,
        "cancellationReasonCodes": [
            "settled",
            "notpaid"
        ],
        "hearingRequestID": "2000004515"
    },
    "hearingDetails": {
        "listingAutoChangeReasonCode": "user-added-comments",
        "hearingType": "ABA5-FHR",
        "hearingWindow": {
            "firstDateTimeMustBe": "2022-12-23T00:00:00"
        },
        "duration": 180,
        "hearingPriorityType": "Standard",
        "numberOfPhysicalAttendees": 18,
        "hearingInWelshFlag": false,
        "hearingLocations": [
            {
                "locationType": "court",
                "locationId": "20262"
            }
        ],
        "facilitiesRequired": [
            "9",
            "14",
            "11"
        ],
        "listingComments": "TEST UPDATE REQUESTED SIT 557",
        "privateHearingRequiredFlag": false,
        "panelRequirements": {
            "roleType": [],
            "authorisationTypes": [],
            "authorisationSubType": [],
            "panelPreferences": [
                {
                    "memberID": "4925295",
                    "memberType": "JUDGE",
                    "requirementType": "MUSTINC"
                }
            ],
            "panelSpecialisms": []
        },
        "hearingIsLinkedFlag": true,
        "hearingChannels": [
            "INTER",
            "TEL"
        ],
        "autolistFlag": false
    },
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1671135228065835",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1671135228065835",
        "hmctsInternalCaseName": "1671135228065835_1 Test Case DA 21612",
        "publicCaseName": "Applicant Lastname_Respondent Lastname",
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
        "caseSLAStartDate": "2022-12-16"
    },
    "partyDetails": [
        {
            "partyID": "99abcdeb-1378-4bcb-893f-4981986b3487",
            "partyType": "IND",
            "partyRole": "APPL",
            "individualDetails": {
                "title": null,
                "firstName": "Applicant Firstname",
                "lastName": "Applicant Lastname",
                "preferredHearingChannel": "INTER",
                "interpreterLanguage": null,
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": null,
                "hearingChannelEmail": [],
                "hearingChannelPhone": [],
                "relatedParties": [],
                "custodyStatus": null,
                "otherReasonableAdjustmentDetails": null
            }
        },
        {
            "partyID": "7811cee7-ac52-4f88-b254-e449f5e3985e",
            "partyType": "IND",
            "partyRole": "RESP",
            "individualDetails": {
                "title": null,
                "firstName": "Respondent Firstname",
                "lastName": "Respondent Lastname",
                "preferredHearingChannel": "TEL",
                "interpreterLanguage": null,
                "reasonableAdjustments": [],
                "vulnerableFlag": null,
                "vulnerabilityDetails": null,
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
                "hearingStartDateTime": "2022-12-23T10:00:00",
                "hearingEndDateTime": "2022-12-23T13:00:00",
                "hearingVenueId": "20262",
                "hearingRoomId": "RCJ  Chambers 51",
                "hearingJudgeId": null,
                "panelMemberIds": null,
                "attendees": [
                    {
                        "hearingSubChannel": "PERSON",
                        "partyID": "99abcdeb-1378-4bcb-893f-4981986b3487"
                    },
                    {
                        "hearingSubChannel": "TELTEMP",
                        "partyID": "7811cee7-ac52-4f88-b254-e449f5e3985e"
                    }
                ],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "CLOSED",
        "listingStatus": "CNCL",
        "receivedDateTime": "2022-12-19T15:23:00",
        "hearingCancellationReason": "Cancel",
        "requestVersion": 2
    }
}
module.exports = hearing;
