@fullfunctional @crossbrowser
Feature: Login

    @all
  Scenario: un-authenticated user login
    When I navigate to Expert UI Url
    Then I am on Idam login page
    When I enter an Invalid email-address and password to login
    Then I should be redirected to the Idam login page
    Then I should see failure error summary

  Scenario: login and log out from EUI with valid user
    When I navigate to Expert UI Url
    Given I am logged into Expert UI with valid user details
    Then I should be redirected to EUI dashboard page
    When I select the sign out link
    Then I should be redirected to the Idam login page

  Scenario: login and log out from EUI as Probate user
    When I navigate to Expert UI Url
    Given I am logged into Expert UI with Probate user details
    Then I should be redirected to EUI dashboard page
    When I select the sign out link
    Then I should be redirected to the Idam login page



  # Scenario: Verify the direct link navigate to login page
  #   Given I navigate to Expert UI Url direct link
  #   Then I should be redirected back to Login page after direct link

  # @iauserslogin @ignore
  # Scenario Outline: Login as IA "<Usertype>"
  #   Given I am logged into Expert UI as IA "<Usertype>"
  #   Then I should be redirected to EUI dashboard page
  #   Then I see primary navigation tabs "<mainHeaders>" in main header
  #   Then I should see the expected banner for IA "<Usertype>"
  #   When I select the sign out link
  #   Then I should be redirected to the Idam login page

  #   Examples:
  #     | Usertype              | mainHeaders                                    |
  #     | case_officer          | My work,Case list, Create case |
  #     | legal_rep             | Case list, Create case            |
  #     | admin_officer         | Case list, Create case                         |
  #     | homeoffice_respondent | Case list, Create case                         |
  #     | homeoffice_apc        | Case list, Create case                         |
  #     | homeoffice_larts      | Case list, Create case                         |
  #     | homeoffice_pou        | Case list, Create case                         |
  #     | judge                 | Case list                                      |
