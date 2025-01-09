const hearing = {
    "requestDetails": {
        "status": "CANCELLED",
        "timestamp": "2022-12-19T12:07:15.636435",
        "versionNumber": 2,
        "cancellationReasonCodes": [
            "listerr",
            "settled",
            "notpaid",
            "jodir",
            "withdraw",
            "unable",
            "other"
        ],
        "hearingRequestID": "2000004493"
    },
    "hearingDetails": {
        "listingAutoChangeReasonCode": "user-added-comments",
        "hearingType": "ABA5-CMH",
        "hearingWindow": {},
        "duration": 660,
        "hearingPriorityType": "Standard",
        "numberOfPhysicalAttendees": 0,
        "hearingInWelshFlag": false,
        "hearingLocations": [
            {
                "locationType": "court",
                "locationId": "36791"
            }
        ],
        "listingComments": "test",
        "privateHearingRequiredFlag": false,
        "panelRequirements": {
            "roleType": [
                "45"
            ],
            "authorisationTypes": [],
            "authorisationSubType": [],
            "panelPreferences": [],
            "panelSpecialisms": []
        },
        "hearingIsLinkedFlag": false,
        "hearingChannels": [
            "ONPPRS"
        ],
        "autolistFlag": false
    },
    "caseDetails": {
        "hmctsServiceCode": "ABA5",
        "caseRef": "1670864127030167",
        "caseDeepLink": "https://manage-case-hearings-int.demo.platform.hmcts.net/cases/case-details/1670864127030167",
        "hmctsInternalCaseName": "1670864127030167_1 Test Case C100 21212",
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
        "caseManagementLocationCode": "36791",
        "caserestrictedFlag": false,
        "caseSLAStartDate": "2022-12-12"
    },
    "partyDetails": [
        {
            "partyID": "d452e869-dace-4e6b-89ef-ee7e0519b11f",
            "partyType": "IND",
            "partyRole": "RESP",
            "individualDetails": {
                "title": null,
                "firstName": "Respondent Firstname",
                "lastName": "Respondent Lastname",
                "preferredHearingChannel": null,
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
            "partyID": "1e848fde-00fe-42dd-a2c4-880aa8176a81",
            "partyType": "IND",
            "partyRole": "APPL",
            "individualDetails": {
                "title": null,
                "firstName": "Applicant Firstname",
                "lastName": "Applicant Lastname",
                "preferredHearingChannel": null,
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
                "hearingStartDateTime": null,
                "hearingEndDateTime": null,
                "hearingVenueId": null,
                "hearingRoomId": null,
                "hearingJudgeId": null,
                "panelMemberIds": null,
                "attendees": [],
                "listAssistSessionID": null
            }
        ],
        "laCaseStatus": "CLOSED",
        "receivedDateTime": "2022-12-19T12:08:00",
        "requestVersion": 1
    }
}


module.exports = hearing;
