@fullfunctional @ignore
Feature: Case flags tab

    Background: Setup case
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with case flags


    Scenario: View case flag

        Given I navigate to page route "/cases/case-details/1698182796208883"
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field #read-case-flag-title"

        Then I validate case flags table for "Applicant" has 4 flags
        Then I validate case flags tab table data for "Applicant"
          | Party level flags                 | Comments          | Creation date | Last modified | Flag status |
          | Documents in a specified colour   | Test              | 24 Oct 2023   |               | ACTIVE      |
          | Documents in a specified colour   | Test              | 24 Oct 2023   |               | ACTIVE      |
          | Support filling in forms          | Test              | 24 Oct 2023   |               | ACTIVE      |
          | Documents in a specified colour   | Test auto comment | 05 Feb 2024   |               | REQUESTED   |

  Scenario: Create case flag 2

        Given I navigate to page route "/cases/case-details/1698182796208883"
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field #read-case-flag-title"

        Then I validate case flags table for "Respondant" has 1 flags
        Then I validate case flags tab table data for "Respondant"
          | Party level flags                 | Comments          | Creation date | Last modified | Flag status |
          | Language Interpreter              | Test              | 24 Oct 2023   |               | ACTIVE      |
