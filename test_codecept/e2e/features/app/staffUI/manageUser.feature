@fullfunctional @ignore  @staffUI 
Feature: Staff UI Manager user

@functional_enabled
    Scenario: User details
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI
        Then I validate basic search in Staff UI
        Then I validate staff UI search results displayed
        Then I validate staff user details display

@functional_enabled
    Scenario: Add new user work flow - back, cancel and change
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI

        Then I validate add new staff user work flow controls
            | First name       | xui auto test                                                                                      |
            | Last name        | last name                                                                                          |
            | Email            | xui_auto_test                                                                                      |
            | Region           | Region 1                                                                                           |
            | Services         | Specified Money Claims,Damages,Family Public Law,Family Private Law,Immigration and Asylum Appeals |
            | Primary location | Bir                                                                                                |
            | User type        | Legal office                                                                                       |
            | Roles            | Case Allocator                                                                                     |
            | Job title        | Legal Caseworker                                                                                   |


    Scenario: Add new user
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI


        When I add new staff user details
            | First name       | xui auto test                                                                                      |
            | Last name        | last name                                                                                          |
            | Email            | xui_auto_test                                                                                      |
            | Region           | Region 1                                                                                           |
            | Services         | Specified Money Claims,Damages,Family Public Law,Family Private Law,Immigration and Asylum Appeals |
            | Primary location | Bir                                                                                                |
            | User type        | Legal office                                                                                       |
            | Roles            | Case Allocator                                                                                     |
            | Job title        | Legal Caseworker                                                                                   |

        Then I see basic search displayed in staff UI


    Scenario: Update user
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI

        Then I see basic search displayed in staff UI
        Then I validate user profile "xui auto user for update" update in staff UI
            | Last name | xui test update |


    Scenario: Copy user
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI

        Then I see basic search displayed in staff UI
        Then I validate user profile "xui auto test last name" copy in staff UI
            | First name | xui auto test copy |
            | Last name  | test copy          |
            | Email      | xui_auto_test_copy |

