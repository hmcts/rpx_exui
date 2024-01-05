@fullfunctional @ignore
Feature: Global search


    Scenario Outline: Search from page "Search"
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "CASEWORKER_GLOBALSEARCH"

        Then I click on primary navigation header tab "Search", I see selected tab page displayed

        # Seatch with name
        Then I see global search Page
        When I input field "<SearchField>" with value "<Input>" in global search Page

        When I click search button in global search page
        Then I see global search results page

        Then I validate global search results displayed
        Then I validate global search results values displayed
            | name    |
            | Case    |
            | Service |
            | State   |
        Examples:
            | SearchField             | Input            |
            | Name                    | test             |
            | 16-digit case reference | 1696932564343458 |



    Scenario: Search from menu 16-digit find control
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "CASEWORKER_GLOBALSEARCH"
        When If env is "demo", I enter "1662020492250902" in  case ref in header 16 digit ref search
        When If env is "aat", I enter "1696932564343458" in  case ref in header 16 digit ref search
        When I click find in case ref in header 16 digit ref search
        Then I see case details page
