
@ng @functional_enabled 
Feature:  Hearings CR84: Hearing View details

    Scenario Outline:  Hearings tab for "<UserIdentifier>" role "<UserRole>"
        Given I set MOCK with user details with user identifier "<UserIdentifier>"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,<UserRole> |
            | roleCategory | LEGAL_OPERATIONS                                                                 |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "CIVIL"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "CIVIL"

        Given I set mock case hearings
            | hmcStatus              | hearingType                 | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | AWAITING_LISTING       | TEST_AWAITING_LISTING       | -3                     | 0                            | -3                                      | 2                                     |
            | LISTED                 | TEST_LISTED                 | -3                     | 0                            | -3                                      | 2                                     |
            | UPDATE_REQUESTED       | TEST_UPDATE_REQUESTED       | -3                     | 0                            | -3                                      | 2                                     |
            | UPDATE_SUBMITTED       | TEST_UPDATE_SUBMITTED       | -3                     | 0                            | -3                                      | 2                                     |
            | CANCELLATION_REQUESTED | TEST_CANCELLATION_REQUESTED | -3                     | -1                           | 2                                       | 4                                     |
            | CANCELLATION_SUBMITTED | TEST_CANCELLATION_SUBMITTED | -3                     | -1                           | 2                                       | 4                                     |
            | CANCELLED              | TEST_CANCELLED              | -3                     | -1                           | 2                                       | 4                                     |
            | VACATED                | TEST_VACATED                | -3                     | -1                           | 2                                       | 4                                     |
            | AWAITING_ACTUALS       | TEST_AWAITING_ACTUALS       | -3                     | -1                           | 2                                       | 4                                     |
            | ADJOURNED              | TEST_ADJOURNED              | -3                     | -1                           | 2                                       | 4                                     |
            | EXCEPTION              | TEST_EXCEPTION              | -3                     | -1                           | 2                                       | 4                                     |
            | COMPLETED              | TEST_COMPLETED              | -3                     | -1                           | 2                                       | 4                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page
        Then I see hearings table for "Past or cancelled" in hearings tab page


        # Given I set mock get hearing with with status "<HearingType>"
        Given I set mock get hearing with with status "<HearingType>" and values at jsonpath
            | jsonpath                            | value                 |
            | $.caseDetails.hmctsInternalCaseName | 1234567812345678      |
            | $.caseDetails.publicCaseName        | Mock case public name |

        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath          | value |
            | $.publicCaseName | Mock case public name |

        When In hearings tab, I click action "View details" for hearing "<HearingType>" under table "<Table>"

        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "TEST_<EditHearing>"

        Then I validate fields displayed in view hearing page
            | field                                 | value                 | changeLinkDisplay | amendedFlagDisplay |
            | Status                                | <HearingStatus>       | false             | false              |
            | Will additional security be required? | No                    | false             | false              |
            | Case internal name                    | 1234567812345678      | false             | false              |
            # | Case public name                      | Mock case public name | false             | false              |



        Examples:
            | UserIdentifier          | UserRole        | EditActions  | EditHearing | HearingType      | HearingStatus            | Table                |
            | HEARING_MANAGER_CR84_ON | hearing-manager | View or edit | true        | LISTED           | LISTED                   | Current and upcoming |
            | HEARING_MANAGER_CR84_ON | hearing-manager | View or edit | true        | AWAITING_LISTING | AWAITING HEARING DETAILS | Current and upcoming |
            | HEARING_MANAGER_CR84_ON | hearing-manager | View or edit | true        | UPDATE_REQUESTED | UPDATE REQUESTED         | Current and upcoming |

