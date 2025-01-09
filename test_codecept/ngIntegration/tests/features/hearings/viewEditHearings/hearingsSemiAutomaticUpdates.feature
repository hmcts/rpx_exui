
@ng @functional_enabled @ignore
Feature: Hearings CR84: Semi automatic updates


    Scenario: Hearing semi automatic updates display of Case flags and parties
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"
        Given I set mock case hearings
            | hmcStatus        | hearingType           | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED           | TEST_TYPE             | -3                     | 0                            | -3                                      | 2                                     |
            | COMPLETED        | TEST_TYPE             | -5                     | -1                           | 2                                       | 4                                     |
            | CANCELLED        | TEST_TYPE             | -5                     | -1                           | 2                                       | 4                                     |
            | AWAITING_ACTUALS | TEST_AWAITING_HEARING | -5                     | -1                           | 2                                       | 4                                     |

        Given I set mock get hearing with with status "LISTED" and values at jsonpath
            | jsonpath                            | value                 |
            | $.caseDetails.hmctsInternalCaseName | 1234567812345678      |
            | $.caseDetails.publicCaseName        | Mock case public name |
            | $.hearingDetails.hearingType        | ABA5-ABC              |
            | $.hearingDetails.hearingType | ABA5-ABC |


        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
            | partyName   | partyID |
            | Party1 name | party_1 |
            | Party2 name | party_2 |
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "caseFlags"
            | partyID | partyName   | flagParentId | flagId | flagDescription | flagStatus |
            | party_1 | Party1 name | PARENT_0     | RA001  | Party1 comment  | ACTIVE     |
            | party_2 | Party2 name | PARENT_0     | RA001  | Party2 comment  | ACTIVE     |
            | party_1 | Party1 name | PARENT_0     | OT001  | Party1 comment  | ACTIVE     |
            | party_2 | Party2 name | PARENT_0     | OT001  | Party2 comment  | ACTIVE     |

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                                                          | value                         |
            | $.parties[0].individualDetails.reasonableAdjustments | [RA0042] |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"


        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "caseFlags"
            | partyID | partyName   | flagParentId | flagId | flagDescription | flagStatus |
            | party_1 | Party1 name | PARENT_0     | RA001  | Party1 comment  | ACTIVE     |
            | party_2 | Party2 name | PARENT_0     | RA001  | Party2 comment  | ACTIVE     |
            | party_1 | Party1 name | PARENT_0     | OT001  | Party1 comment  | ACTIVE     |
            | party_2 | Party2 name | PARENT_0     | OT001  | Party2 comment  | ACTIVE     |
            | party_1 | Party1 name | PARENT_0     | RA0042 | Party1 comment  | ACTIVE     |


        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"


        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed


        Then I validate fields displayed in view or edit hearing page
            | field                                 | value  | changeLinkDisplay | amendedFlagDisplay |
            | Status                                | LISTED | false             | false              |
            | Will additional security be required? | No     | true              | false              |


        When In view or edit hearing page, I click change link for field "Reasonable adjustments"
        Then I am on hearings workflow page "Hearing requirements"
        Then In hearings requirements page, I see case flags displayed for parties
            | partyName   |
            | Party1 name |
            | Party2 name |
        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed

        When In view or edit hearing page, I click change link for field "Select any additional facilities required"
        Then I am on hearings workflow page "Do you require any additional facilities?"
        Then In additional facilities page, I see case flags displayed for parties
            | partyName   |
            | Party1 name |
            | Party2 name |
        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed


        When In view or edit hearing page, I click change link for field "Will this be a paper hearing?"
        Then I am on hearings workflow page "Participant attendance"
        When In create hearing page "Participant attendance", I input values
            | field                         | value |
            | Will this be a paper hearing? | No    |
        Then In hearings Participant attendance page, I see parties
            | partyName   |
            | Party1 name |
            | Party2 name |

        When In hearing page "Participant attendance", I input values
            | field                                                    | value                               |
            | Will this be a paper hearing?                            | No                                  |
            | What will be the methods of attendance for this hearing? | Hearing channel 1,Hearing channel 2 |
            | How will each participant attend the hearing?            | Party1 name,Hearing channel 1       |
            | How will each participant attend the hearing?            | Party2 name,Hearing channel 1       |
            | How many people will attend the hearing in person?       | 2                                   |
        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"

        Then I am on hearings workflow page "Provide a reason for changing this hearing"
        When In hearing page "Provide a reason for changing this hearing", I input values
            | field                                      | value                |
            | Provide a reason for changing this hearing | Change reason code 1 |

        When I click button with label "Submit change request"
        Then I am on hearing page "Hearing request submitted"
        Given I captured "OnPutHearing" request body from mock
        # Then I validate hearings request body "OnPutHearing"

        Then I validate request body json "OnPutHearing", jsonpaths
            | jsonpath                                                     | value       |
            | $.requestDetails.status                                      | LISTED      |
            | $.hearingDetails.hearingType                                 | ABA5-ABC    |
            | $.partyDetails[0].partyName                                  | Party1 name |
            | $.partyDetails[1].partyName                                  | Party2 name |
            | $.partyDetails[0].individualDetails.reasonableAdjustments[0] | RA0042      |


