
@functional_enabled
Feature: Case specific access request 


    Scenario: Specific access required

        Given I set MOCK with user details
            | roles        | caseworker,caseworker-ia,caseworker-ia-caseofficer,task-supervisor,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                                                                  |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory   |
            | IA           | Y           | ORGANISATION | 20001        | <roleCategory> |
            | SSCS         | Y           | ORGANISATION | 30001        | <roleCategory> |

        Given I set MOCK case "defaultCase" details with reference "WA_Case"
        Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I set MOCK case details "WA_Case" access process "SPECIFIC" and access granted "BASIC"

        Given I navigate to home page
        Then I click on primary navigation header tab "Case list", I see selected tab page displayed
        Then I see results returned
        When I open second case in search results
        Then I see case details basic view and request access page
        Then I see case details basic view displays banner with message "Authorisation is needed to access this case"

        Then I see case details basic view displays case property "Service" with values "Immigration & Asylum"
        Then I see case details basic view displays case property "Access" with values "Specific"

        When I click request access button in case basic view page

        Then I see specific access request page
        When In specific access request page, I enter reason "test reason"
        Then In specific access request page, I click submit
        Then I see specific access request success page





