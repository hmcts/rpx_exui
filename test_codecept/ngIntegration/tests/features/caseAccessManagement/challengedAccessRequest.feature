
@functional_enabled
Feature: Case challeged access request

Background: setup

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

        Given I set MOCK case details "WA_Case" access process "CHALLENGED" and access granted "BASIC"

        Given I navigate to home page
        Then I click on primary navigation header tab "Case list", I see selected tab page displayed
        Then I see results returned
        When I open second case in search results

Scenario: Challenged access required, page validations

        Then I see case details basic view and request access page
        Then I see case details basic view displays banner with message "This case requires challenged access"
        

        Then I see case details basic view displays case property "Service" with values "Immigration & Asylum"
        Then I see case details basic view displays case property "Access" with values "Challenged"
       
        When I click request access button in case basic view page
        Then I see challenged access request page

        Then In challenged access request page, I do not see other reason input
        Then In challenged access request page, I do not see case reference input
        
        When In challenged access request page, I select radio option "The cases or parties are linked to the case I am working on"
        Then In challenged access request page, I see case reference input
        Then In challenged access request page, I do not see other reason input


        When In challenged access request page, I select radio option "To determine if the case needs to be consolidated"
        Then In challenged access request page, I do not see case reference input
        Then In challenged access request page, I do not see other reason input

        When In challenged access request page, I select radio option "To consider an order for transfer"
        Then In challenged access request page, I do not see case reference input
        Then In challenged access request page, I do not see other reason input

        When In challenged access request page, I select radio option "Other reason"
        Then In challenged access request page, I do not see case reference input
        Then In challenged access request page, I see other reason input

        When In challenged access request page, I select radio option "The cases or parties are linked to the case I am working on"
        Then In challenged access request page, I see case reference input
        When In challenged access request page, I enter case reference "1234567812345678"
      
    
Scenario: Submit with case ref
        Then I see case details basic view and request access page
      
        When I click request access button in case basic view page
        Then I see challenged access request page

        Then In challenged access request page, I do not see other reason input
        Then In challenged access request page, I do not see case reference input

        When In challenged access request page, I select radio option "The cases or parties are linked to the case I am working on"
        Then In challenged access request page, I see case reference input
        When In challenged access request page, I enter case reference "1234567812345678"
        Then In challenged access request page, I click submit
        Then I see challenged access request success page


    Scenario: Submit with other reason
        Then I see case details basic view and request access page

        When I click request access button in case basic view page
        Then I see challenged access request page

        Then In challenged access request page, I do not see other reason input
        Then In challenged access request page, I do not see case reference input

        When In challenged access request page, I select radio option "Other reason"
        Then In challenged access request page, I see other reason input
        When In challenged access request page, I enter other reason "some test reason"
        Then In challenged access request page, I click submit
        Then I see challenged access request success page


    # Scenario: Cancel
    #     Then I see case details basic view and request access page

    #     When I click request access button in case basic view page
    #     Then I see challenged access request page

    #     Then In challenged access request page, I do not see other reason input
    #     Then In challenged access request page, I do not see case reference input

    #     When In challenged access request page, I select radio option "The cases or parties are linked to the case I am working on"
    #     Then In challenged access request page, I see case reference input
    #     When In challenged access request page, I enter other reason "some test reason"
    #     Then In challenged access request page, I click cancel
    #     Then I see challenged access request success page
    #     Then debug sleep minutes 15
