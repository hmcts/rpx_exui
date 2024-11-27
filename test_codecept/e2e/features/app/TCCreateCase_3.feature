@fullfunctional @test @ignore @functional_enabled
Feature: Test case type case creation and case details validations Part 3

    Background:
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with valid user details
        Then I should be redirected to EUI dashboard page

    Scenario: Validate Case event check your answers summary page links
        When I click on primary navigation header tab "Create case", I see selected tab page displayed
        Then Create case page should be displayed
        When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
        Then I am on case form page
        Then I should be able to fill the form pages
        Then Should be able to see check your answers summary page links



