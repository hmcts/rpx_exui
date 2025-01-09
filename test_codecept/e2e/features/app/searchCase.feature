@search @ignore
Feature: search criteria workflow

  Background:
    When I navigate to Expert UI Url
    Given I am logged into Expert UI with valid user details
    Then I should be redirected to EUI dashboard page

  Scenario Outline:  search criteria apply workflow from Search Case Page
    When I click on search button
    Then Search page should be displayed
    When I enter search fields jurisdiction "<Jurisdiction>" case type "<CaseType>"
    When I reset case search fields
    When I enter search fields jurisdiction "<Jurisdiction>" case type "<CaseType>" and click apply
    Then I see results returned
    When I open first case in search results
    Then I see case details page

    Examples:
      | Jurisdiction   | CaseType           |
      | Family Divorce | XUI Test Case type dev |



  Scenario Outline:  search criteria apply workflow from Search Case Page

    When I select search criteria jurisdiction "<Jurisdiction>" case type "<CaseType>" state "Any" in case list page
    When I click search Reset in case list page
    When I select search criteria jurisdiction "<Jurisdiction>" case type "<CaseType>" state "Any" in case list page and click apply
    Then I see results returned
    When I open first case in case list page
    Then I see case details page

    Examples:
      | Jurisdiction   | CaseType           |
      | Family Divorce | XUI Test Case type dev |
