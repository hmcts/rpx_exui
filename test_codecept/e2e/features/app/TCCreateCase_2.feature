@ignore @fullfunctional @test @functional_enabled 
Feature: Test case type case creation and case details validations Part 2

    Background:
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with valid user details
        Then I should be redirected to EUI dashboard page


    Scenario: Validate check your answers summary page
        When I click on primary navigation header tab "Create case", I see selected tab page displayed
        Then Create case page should be displayed
        When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
        Then I am on case form page
        Then I should be able to fill the form pages
        # Then debug sleep minutes 30
        Then Validate check your answer summery page

    Scenario: Validate mandatory fields condition check in page
        When I click on primary navigation header tab "Create case", I see selected tab page displayed
        Then Create case page should be displayed
        When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
        Then I am on case form page
        Then Validate mandatory fields functionality

    Scenario:  Validate event pages display show condition logic
        When I click on primary navigation header tab "Create case", I see selected tab page displayed
        Then Create case page should be displayed
        When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
        Then I am on case form page
        Then Validate event pages display show condition logic
