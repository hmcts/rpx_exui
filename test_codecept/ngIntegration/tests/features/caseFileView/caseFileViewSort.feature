@functional_enabled
Feature: Case file view sort documents


    Scenario: Display of case file view V1.1
        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_FILE_VIEW_V1.1_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "caseFileViewCase" details with reference "CaseFileView_case"
        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Case File View" is displayed is "true"
        # Then debug sleep minutes 5
        When I click tab with label "Case File View" in case details page, to see element with css selector "#case-file-view"
        Then In case file view tab, I see documents tree view
        Then In case file view tab, I see documents media view

        Then In case file view tab, I see documents sort icon displayed

        When In case file view tab, I click documents sort icon
        Then In case file view tab, I see documents sort options menu displayed

        Then In case file view tab, I see documents sort options 
            |option|
            |A to Z ascending|
            |Z to A descending|
            |Recent first|
            |Oldest first|

    @AAT_only
    Scenario: Display of case file view V1
        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_FILE_VIEW_V1.1_OFF"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "caseFileViewCase" details with reference "CaseFileView_case"
        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Case File View" is displayed is "true"
        # Then debug sleep minutes 5
        When I click tab with label "Case File View" in case details page, to see element with css selector "#case-file-view"
        Then In case file view tab, I see documents tree view
        Then In case file view tab, I see documents media view

        Then In case file view tab, I see documents sort icon displayed

        When In case file view tab, I click documents sort icon
        Then In case file view tab, I see documents sort options menu displayed

        Then In case file view tab, I see documents sort options
            | option            |
            | A to Z ascending  |
            | Z to A descending |


        Then In case file view tab, I dont see documents sort options
            | option            |
            | Recent first      |
            | Oldest first      |

