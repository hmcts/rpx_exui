@fullfunctional  @staffUI @ignore
Feature: Staff UI Search


    Scenario: Toggle search
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI
        Then I validate basic search in Staff UI
        When I click Advanced search link in Staff UI
        Then I validate advanced search in Staff UI
        When I click Hide advanced search link in Staff UI
        Then I validate basic search in Staff UI



    Scenario: Simplified search
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI
        Then I validate basic search in Staff UI


        Then I validate staff UI search results displayed
        # Seatch with name


    Scenario: Advanced search
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI
        Then I validate basic search in Staff UI
        When I click Advanced search link in Staff UI
        Then I validate advanced search in Staff UI
        Then I validate staff UI search results displayed


    Scenario: Simplified search results
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "STAFF_ADMIN"

        Then I click on primary navigation header tab "Staff", I see selected tab page displayed
        Then I see basic search displayed in staff UI
        Then I validate basic search in Staff UI

        Then I validate staff UI search results displayed

