@ng @functional_enabled  
Feature: WA Release 2: My work - Work filters

    Background: Mock and brow ser setup
        # Given I navigate to home page
    Scenario Outline:  Work filters show hide button and Apply for "<UserType>"


        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<Roles>" with reference "userDetails"
        # Given I set MOCK with user "IAC_CaseOfficer_R2" and roles " caseworker-ia-caseofficer,caseworker-ia-admofficer, task-supervisor,task-supervisor,case-allocator" with reference "userDetails"

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 30001        |

        # Given I navigate to home page
        When I click on primary navigation header tab "My work", I see selected tab page displayed
        Then I see work filter button displayed
        Then I validate work filter button text is "Show work filter"
        # Then I validate work location filter batch and hint labels are not displayed
        Then I validate location filter is not displayed
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"


        Then I validate my work filter services container displayed
        Then I validate my work filter location search displayed



        When I click work location filter Apply button

        Then I validate my work filter services container not displayed
        When I click work filter button to "Show" filter
        Then I validate my work filter services container displayed

        Examples:
            | UserType       | Roles                                                            |
            | Caseworker IAC | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer |
    # | Judge          | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker    |

    Scenario Outline:  Work filters types for selected sub navigation tabs
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<Roles>" with reference "userDetails"
        # Given I set MOCK with user "IAC_CaseOfficer_R2" and roles " caseworker-ia-caseofficer,caseworker-ia-admofficer, task-supervisor,task-supervisor,case-allocator" with reference "userDetails"

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA | Y | ORGANISATION | 20001 |
            | SSCS         | Y           | ORGANISATION | 30001        |


        Given I start MockApp
        When I click on primary navigation header tab "My work", I see selected tab page displayed
        Then I see work filter button displayed
        Then I validate work filter button text is "Show work filter"
        # Then I validate work location filter batch and hint labels are not displayed
        Then I validate location filter is not displayed

        Then I validate work filter button text is "Show work filter"
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"
        Then I see work filter of type "Services" is displayed
        Then I see work filter of type "Locations" is displayed
        # Then I see work filter of type "Work types" is displayed
        When I click work location filter Apply button
        Then I validate my work filter services container not displayed

        When I navigate to My work sub navigation tab "Available tasks"
        Then I validate work filter button text is "Show work filter"
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"
        Then I see work filter of type "Services" is displayed
        Then I see work filter of type "Locations" is displayed
        # Then I see work filter of type "Work types" is displayed
        When I click work location filter Apply button
        Then I validate my work filter services container not displayed

        When I navigate to My work sub navigation tab "My cases"
        Then I validate work filter button text is "Show work filter"
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"
        Then I see work filter of type "Services" is displayed
        Then I see work filter of type "Locations" is displayed
        # Then I see work filter of type "Work types" is displayed
        When I click work location filter Apply button
        Then I validate my work filter services container not displayed

        When I navigate to My work sub navigation tab "My tasks"
        Then I validate work filter button text is "Show work filter"
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"
        Then I see work filter of type "Services" is displayed
        Then I see work filter of type "Locations" is displayed
        # Then I see work filter of type "Work types" is displayed
        When I click work location filter Apply button
        Then I validate my work filter services container not displayed

        Examples:
            | UserType       | Roles                                                            |
            | Caseworker IAC | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer |
    # | Judge          | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker    |


    Scenario Outline:  Work filters mandatory field validations and filter selection
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<Roles>" with reference "userDetails"
        # Given I set MOCK with user "IAC_CaseOfficer_R2" and roles " caseworker-ia-caseofficer,caseworker-ia-admofficer, task-supervisor,task-supervisor,case-allocator" with reference "userDetails"

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA | Y | ORGANISATION | 20001 |
            | CIVIL | Y | ORGANISATION |  |


        Given I start MockApp
        When I click on primary navigation header tab "My work", I see selected tab page displayed

        Then I see work filter button displayed
        Then I validate work filter button text is "Show work filter"
        # Then I validate work location filter batch and hint labels are not displayed
        Then I validate location filter is not displayed
        When I click work filter button to "Show" filter
        When I unselect service "Civil" in my work filter
        When I unselect service "Immigration and Asylum" in my work filter
        When I click work location filter Apply button
        # Then I see error message "Select a service" for service work filter in my work page
    
        # When I select service "Immigration and Asylum" in my work filter

        # When I remove slected location "IA Court Center 1" from my work filters

        # When I click work location filter Apply button

        Then I validate work filter button text is "Show work filter"
        Then I validate location filter is not displayed


        Examples:
            | UserType       | Roles                                                            |
            | Caseworker IAC | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer |
    # | Judge    | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker |

    Scenario Outline: Work filters locations based on organisation role and base location


        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles " caseworker-ia-caseofficer,caseworker-ia-admofficer, task-supervisor,task-supervisor,case-allocator" with reference "userDetails"

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType        |
            | IA           | Y           | <IA_roleType>   |
            | SSCS         | Y           | <SSCS_roleType> |


        Given I start MockApp
        When I click on primary navigation header tab "My work", I see selected tab page displayed
        Then I see work filter button displayed
        Then I validate work filter button text is "Show work filter"
        # Then I validate work location filter batch and hint labels are not displayed
        Then I validate location filter is not displayed
        When I click work filter button to "Show" filter
        Then I validate work filter button text is "Hide work filter"
        Then I validate my work filter services container displayed
        Then I validate my work filter location search displayed

        When I remove all selected locations from my work filters


        When I search for location text "Court" in my work filters



        Examples:
            | IA_roleType  | IA_baseLocation | SSCS_roleType | SSCS_baseLocation | resultCount | searchableServices |
            | ORGANISATION |                 | ORGANISATION  |                   | 18          | IA,SSCS            |
            | CASE         | 20001           | ORGANISATION  | 30001             | 9           | SSCS               |
            | ORGANISATION | 20001           | CASE          | 20001             | 9           | IA                 |

