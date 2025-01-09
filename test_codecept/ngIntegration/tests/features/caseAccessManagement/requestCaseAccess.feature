
@functional_enabled @ignore
Feature: Case access management - Request access
    Background: Setup
        Given I init MockApp
        Given I set MOCK with user "CASEWORKER_GLOBALSEARCH" and roles "caseworker,caseworker-befta_master,caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer" with reference "mockUserDetails"
        Given I start MockApp
        Given I navigate to home page
        Then I click on primary navigation header tab "Search", I see selected tab page displayed
        Then I see global search Page


    Scenario: Case search results view validations challenged access
        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" service name as "Immigration Asylum test"
        # Given I set MOCK case details "caseDetails" state as "ngIntegration test state"
        Given I set MOCK case details "caseDetails" property "case_type" as "Asylum"
        Given I set MOCK case details "caseDetails" access process "CHALLENGED" and access granted "BASIC"

        Given I set set global search mock results response and resultInfo
            | caseStartRecord | casesReturned | moreResultsToGo |
            | 1               | 10            | false           |

        Given I set global search mock results with values
            | index | processForAccess | caseNameHmctsInternal | caseReference    | CCDJurisdictionName | stateId      | baseLocationName |
            | 0     | CHALLENGED       | Test case 1           | 1234567812345678 | Test Jurisdiction   | Case created | Test location 1  |
            | 1     | SPECIFIC         | Test case 2           | 8765432187654321 | Test Jurisdiction   | Case created | Test location 2  |
        Given I start MockApp
        When I input field "16-digit case reference" with value "1234567890123456" in global search Page

        When I click search button in global search page
        Then I see global search results page


        Then I validate global search results displayed count 10


        When I click action link "Challenged access" at row 1 in global search results page

        Then I see case details basic view and request access page
        Then I see case details basic view displays banner with message "This case requires challenged access"

        Then I see case details basic view displays case property "Service" with values "Immigration Asylum test"
        # Then I see case details basic view displays case property "State" with values "ngIntegration test state"
        Then I see case details basic view displays case property "Access" with values "Challenged"


        When I click request access button in case basic view page
        Then I see case details challenged access request page


    Scenario: Case search results view validations Specific access
        Given I set MOCK case details with reference "caseDetailsSpecific"
        Given I set MOCK case details "caseDetailsSpecific" property "Jurisdiction" as "Civil"
        Given I set MOCK case details "caseDetailsSpecific" property "case_type" as "Civil"
        Given I set MOCK case details "caseDetailsSpecific" access process "SPECIFIC" and access granted "BASIC"

        Given I set set global search mock results response and resultInfo
            | caseStartRecord | casesReturned | moreResultsToGo |
            | 1               | 10            | false           |

        Given I set global search mock results with values
            | index | processForAccess | caseNameHmctsInternal | caseReference    | CCDJurisdictionName | stateId      | baseLocationName |
            | 0     | CHALLENGED       | Test case 1           | 1234567812345678 | Test Jurisdiction   | Case created | Test location 1  |
            | 1     | SPECIFIC         | Test case 2           | 8765432187654321 | Test Jurisdiction   | Case created | Test location 2  |

        Given I start MockApp
        When I input field "16-digit case reference" with value "1234567890123456" in global search Page

        When I click search button in global search page
        Then I see global search results page


        Then I validate global search results displayed count 10
        # Then I validate global search results values
        #     ||||

        When I click action link "Specific access" at row 2 in global search results page

        Then I see case details basic view and request access page
        Then I see case details basic view displays banner with message "Authorisation is needed to access this case"
        When I click request access button in case basic view page
        Then I see case details specific access request page
