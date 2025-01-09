@fullfunctional @test @functional_enabled

Feature: Test case type case creation and case details validations Part 1

  Background:
    When I navigate to Expert UI Url
    Given I am logged into Expert UI with valid user details
    Then I should be redirected to EUI dashboard page

# @ignore
#     Scenario: Start create case page form fields validating against API response
#         When I click on primary navigation header tab "Create case", I see selected tab page displayed
#         Then Create case page should be displayed
#         When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
#         Then I am on case form page
#         Then Validate create case form pages fields against the api response


    Scenario: Validate update form page click on next step trigger actions
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Case PoC"
        When I click apply to perform case search
        Then I see results returned
        When I open first case in search results
        Then I see case details page
        When I start case next step "Update case"
        Then Validate Case event update populating form page

    Scenario: Validate invalid date error message
        When I click on primary navigation header tab "Create case", I see selected tab page displayed
        Then Create case page should be displayed
        When I start case with jurisdiction "Family Divorce" case type "XUI Test Case type dev" and event "Create a case"
        Then I am on case form page
        When I create case with invalid date
        Then I see error message of type "validation" displayed with message "Date is not valid"



