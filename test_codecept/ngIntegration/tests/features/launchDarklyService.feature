@ng
Feature: Launch darkly service testing for targeting users variants

    Background: Mock and browser setup
        Given I init MockApp


    Scenario:  LD values for toggles, user variants IAC_CaseOfficer_R1_withPagination
        Given I set MOCK with user "IAC_CaseOfficer_R1_withPagination" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator" with reference "userDetails"
         Given I start MockApp
        Given I navigate to home page
        Then I validate launch darkly feature toggles response received
        Then I validate launch darkly feature toggle values
            | valueType | name                              | value                  |
            | string    | mc-work-allocation-active-feature | WorkAllocationRelease2 |


    Scenario:  LD values for toggles, user IAC_CaseOfficer_R1_withoutPagination
        Given I set MOCK with user "IAC_CaseOfficer_R1_withoutPagination" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator" with reference "userDetails"
        Given I start MockApp
        Given I navigate to home page
        Then I validate launch darkly feature toggles response received
        Then I validate launch darkly feature toggle values
            | valueType | name                              | value                  |
            | string    | mc-work-allocation-active-feature | WorkAllocationRelease2 |

    Scenario:  LD values for toggles, user IAC_CaseOfficer_R2
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator" with reference "userDetails"
        Given I start MockApp
        Given I navigate to home page
        Then I validate launch darkly feature toggles response received
        Then I validate launch darkly feature toggle values
            | valueType | name                              | value                  |
            | string    | mc-work-allocation-active-feature | WorkAllocationRelease2 |
