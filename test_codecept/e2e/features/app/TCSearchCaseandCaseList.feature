@fullfunctional @test @functional_enabled 
Feature: Test case type case list and find case workflow

  Background:
    When I navigate to Expert UI Url
    Given I am logged into Expert UI with valid user details
    Then I should be redirected to EUI dashboard page

    Scenario: validating the case list headers against api response
        When I click on Case list
        Then I am on case list page
        When I select search criteria jurisdiction "Family Divorce" case type "XUI Test Case type dev" state "Case created" in case list page and click apply
        Then I wait to see case results displayed
        # Then validating the case list header against the api response
# @ignore
#     Scenario: Validate workbasket update on case type change
#         When I click on Case list
#         Then I am on case list page
#         When I select search criteria jurisdiction "Family Divorce" case type "Contested Financial Remedy" state "Any" in case list page and click apply
#         Then I wait to see case results displayed
#         When I select search criteria jurisdiction "Family Divorce" case type "XUI Test Case type dev" state "Case created" in case list page and click apply
#         Then I wait to see case results displayed

    Scenario: Validate search-inputs against the API response
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        # Then Validate search inputs against the API response

#  @ignore
#    Scenario: Validating the search inputs case list headers against api response
#        When I click on search button
#        Then Search page should be displayed
#        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
#        When I click apply to perform case search
#        Then I see results returned
#        # Then Validating the search inputs case list headers against api response

# @ignore
#     Scenario: Validate search inputs on case type change
#         When I click on search button
#         Then Search page should be displayed
#         When I enter search fields jurisdiction "Family Divorce" case type "Divorce case - v115.00"
#         When I reset case search fields
#         When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
#         When I click apply to perform case search
#         Then I see results returned
#         When I open first case in search results
#         Then I see case details page

# @ignore
#     Scenario: Search filters being retained
#         When I click on search button
#         Then Search page should be displayed
#         When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
#         When I click apply to perform case search
#         Then I see results returned
#         When I open first case in search results
#         Then I see case details page
#         When I click on search button
#         Then I verify search filters have jurisdiction "Family Divorce" and case type "XUI Test Case type dev"

