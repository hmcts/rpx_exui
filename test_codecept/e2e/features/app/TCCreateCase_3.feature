@fullfunctional @test @ignore @functional_enablGI @BAD
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


    Scenario: Validate tabs in case details page against API response
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        Then I see results returned
        When I open first case in search results
        Then I see case details page
        Then I should be able to see tabs in case details page

    Scenario: Validate tab details in case details page against API response
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        Then I see results returned
        When I open first case in search results
        Then I see case details page
        Then I should be validate tab details in case details page


