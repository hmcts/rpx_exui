
@ng @functional_enabled
Feature:  Hearings: Feature toggles

    Scenario:  Hearings in feature toggle mc-hearings-jurisdictions is enabled, mc-enable-hearings-amendments-service enabled
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "CIVIL"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "CIVIL"

        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_LISTED | -3                     | 0                            | -3                                      | 2                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page
        When In hearings tab, I click action "View details" for hearing "TEST_LISTED" under table "Current and upcoming"
        Then I validate view hearing page displayed

    Scenario:  Hearings in feature toggle mc-hearings-jurisdictions is enabled,  mc-enable-hearings-amendments-service disabled
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "SSCS"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "Benefit"

        Given I set mock case hearings
            | hmcStatus              | hearingType                 | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED                 | TEST_LISTED                 | -3                     | 0                            | -3                                      | 2                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page
        When In hearings tab, I click action "View or edit" for hearing "TEST_LISTED" under table "Current and upcoming"
        Then I validate view or edit hearing page displayed



    Scenario:  Hearings in feature toggle mc-hearings-jurisdictions is disabled, mc-enable-hearings-amendments-service disabled
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "DIVORCE"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "DIVORCE"

        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_LISTED | -3                     | 0                            | -3                                      | 2                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "false"

