@fullfunctional @functional_enablGI @BAD
Feature: Case flags tab

    Background: Setup case
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with with case flags


    Scenario: Create case flag

        Given I navigate to page route "/cases/case-details/1698247586927453"
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field #read-case-flag-title"

        Then I validate case flags table for "Applicant" has 3 flags
        Then I validate case flags tab table data for "Applicant"
          | Party level flags                 | Comments          | Creation date | Last modified | Flag status |
          | Support filling in forms          | Test auto comment | 25 Oct 2023   |               | ACTIVE      |
          | Support filling in forms          | test              | 25 Oct 2023   |               | ACTIVE      |
          | Guidance on how to complete forms | Test              | 30 Oct 2023   |               | ACTIVE      |


  Scenario: Create case flag 2

        Given I navigate to page route "/cases/case-details/1698247586927453"
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field #read-case-flag-title"

        Then I validate case flags table for "Applicant" has 3 flags
        Then I validate case flags tab table data for "Applicant"
          | Party level flags                 | Comments          | Creation date | Last modified | Flag status |
          | Support filling in forms          | Test auto comment | 25 Oct 2023   |               | ACTIVE      |
          | Support filling in forms          | test              | 25 Oct 2023   |               | ACTIVE      |
          | Guidance on how to complete forms | Test              | 30 Oct 2023   |               | ACTIVE      |
