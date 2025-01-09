
@ng @functional_enabled
Feature: Hearings: Hearings tab Hearing action based on roles


    Scenario Outline: Hearigs: Hearing actions display for roles
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_OFF"
            | roles        | <role>,caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                                                             |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"
        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
        # | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |
        # | CANCELLED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |
        # | AWAITING_ACTUALS | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Then In hearings tab, I see hearing "TEST_TYPE" with values under "Current and upcoming"
            | Hearing date | Status | Actions   |
            | -3           | LISTED | <actions> |
        # Then debug sleep minutes 20

        Examples:
            | role                  | actions             |
            | hearing-manager       | View or edit,Cancel |
            | hearing-viewer        | View details        |
            | listed-hearing-viewer | View details        |

    Scenario: Hearing actions with status AWAITING_HEARING_DETAILS
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_OFF"
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

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page
        When In hearings tab, I click action "Add or edit" for hearing "TEST_AWAITING_HEARING" under table "Current and upcoming"

        Then I see hearing actuals page
        Then I see hearing actuals page with details
            | field        | value |
            | Hearing date |       |

        Then I see hearing actuals update link
        When I click hearing actuals update link

        Then I see Hearing stage and result update page

        When In Hearing stage and result page, I set "Hearing stage" to "Breach 1"
        When In Hearing stage and result page, I set "Hearing result" to "Heard"
        When In Hearing stage and result update page, click save and continue

        Then I see hearing actuals page
        Then I see hearing actuals page with details
            | field          | value     |
            | Hearing stage  |   |
            | Hearing result | COMPLETED |



        When In hearing actuals page, I click continue
        Then I am hearing actuals check your answers page
        Then I validate hearing actuals details in CYA
            | field          | value     |
            | Paper hearing  | No       |
            | Hearing stage  |   |
            | Hearing result | COMPLETED |

        When I click Submit hearing details button in hearing actuals CYA
        Then I see hearing details success confirmation message "You have successfully submitted the hearing details."
# Then In hearings tab, I see hearing "TEST_TYPE" with values under "Current and upcoming"
#     | Hearing date | Status | Actions   |
#     | -3           | LISTED | <actions> |

