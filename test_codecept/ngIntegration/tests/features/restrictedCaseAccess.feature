
Feature: Restricted case access


    Scenario: Restrcited case display

        Given I init MockApp

        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_ACCESS_ON"
            | roles        | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                                                                                |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType | caseId           | roleCategory     | actorId      |
            | IA | Y | CASE | 1234567890123456 | LEGAL_OPERATIONS | 123456781231 |
            | IA | Y | CASE | 1234567890123456 | LEGAL_OPERATIONS | 123456781232 |


        Given I set error response code 403 on api method "OnCaseDetails"

        Given I start MockApp
        Given I navigate to home page

        When I input field "16-digit case reference" with value "1234567890123456" in global search Page
        When I click search button in global search page

        Then I see restricted case access page
        Then In restricted case accesspage, I see banner message "This case is restricted. The details of the users with access are provided below."
       
        Then In restricted case page, I see user table with headers
            | header        |
            | User          |
            | Case role     |
            | Email address |
        Then In restricted case page, I see list of users with access
            | user      | Case role | Email address |
            | case-allocator 1_123456781232 IA_CIVIL | Senior Tribunal Caseworker | ia_civil_case-allocator_1_123456781232@justice.gov.uk |
            | case-allocator 1_123456781233 IA_CIVIL | Senior Tribunal Caseworker | ia_civil_case-allocator_1_123456781233@justice.gov.uk |

       