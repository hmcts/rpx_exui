
@ng @functional_enabled 
Feature:  Hearings: Hearings tab

    Scenario Outline:  Hearings tab for "<UserIdentifier>" role "<UserRole>"
        Given I set MOCK with user details with user identifier "<UserIdentifier>"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,<UserRole> |
            | roleCategory | LEGAL_OPERATIONS                                                                 |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

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

        # Then I see hearing "TEST_TYPE_1" in hearings "Current and upcoming" in hearings tab page
        # Then I see hearing "TEST_TYPE_2" in hearings "Past or cancelled" in hearings tab page

        # Then In hearings tab, I see hearing "TEST_TYPE_1" with values under "Current and upcoming"
        #     | Hearing date | Status               | Actions             |
        #     | -3           | WAITING TO BE LISTED | View or edit,Cancel |

        Then In hearings tab, I see hearings with values under "Current and upcoming"
            | hearingName                 | Hearing date | Status                   | Actions                    |
            | TEST_AWAITING_LISTING       | -3           | WAITING TO BE LISTED     | <EditActions>              |
            | TEST_LISTED                 | -3           | LISTED                   | <EditActions>              |
            | TEST_UPDATE_REQUESTED       | -3           | UPDATE REQUESTED         | <EditActions>              |
            | TEST_UPDATE_SUBMITTED       | -3           | UPDATE REQUESTED         | <EditActions>              |
            | TEST_CANCELLATION_REQUESTED | 2            | CANCELLATION REQUESTED   | View details               |
            | TEST_CANCELLATION_SUBMITTED | 2            | CANCELLATION REQUESTED   | View details               |
            | TEST_AWAITING_ACTUALS       | 2            | AWAITING HEARING DETAILS | <Awaiting_hearing_Actions> |
            | TEST_EXCEPTION              | 2            | REQUEST FAILURE          | View details               |


        Then In hearings tab, I see hearings with values under "Past or cancelled"
            | hearingName    | Hearing date | Status    | Actions      |
            | TEST_ADJOURNED | 2            | ADJOURNED | View details |
            | TEST_COMPLETED | 2            | COMPLETED | View details |
            | TEST_CANCELLED | 2            | CANCELLED | View details |


        # Then In hearings tab, I see hearing "TEST_TYPE_2" with values under "Past or cancelled"
        #     | Hearing date | Status    | Actions      |
        #     | 2            | COMPLETED | View details |


        Examples:
            | UserIdentifier           | UserRole        | EditActions         | Awaiting_hearing_Actions |
            | HEARING_MANAGER_CR84_ON | hearing-manager | View or edit,Cancel | Add or edit |
            | HEARING_MANAGER_CR84_ON | hearing-viewer | View details | View details |
            | HEARING_MANAGER_CR84_OFF | hearing-manager | View or edit,Cancel | Add or edit |
            | HEARING_MANAGER_CR84_OFF | hearing-viewer | View details | View details |
# Then debug sleep minutes 30
# Then I see hearings tab displayed

