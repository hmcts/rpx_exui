Feature: Check media viewer

    # Background:
    #     When I navigate to Expert UI Url
    #     Given I am logged into Expert UI with hrs testes user details
    #     Then I should be redirected to EUI dashboard page
    #     When I click on create case button
    #     Then Create case page should be displayed

    # Scenario: Start create case for Hearing Recordings and check document
    #     When I start case with jurisdiction "Hearing Recordings" case type "Recorded Hearings v.1.0|Recorded Hearings v.03|Recorded Hearings" and event "Create a case"
    #     Then I am on case form page
    #     When I create Hearing Recordings case
    #     # Given I save current window handle reference "mainTab"
    #     When I click on Case Hearing Files tab
    #     When I click on a file
    #     Given I switch to new window opened
    #     # Given I save current window handle reference "mediaViewerTest"
    #     Then I see the file displayed in Media Viewer

    Background:
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with valid user details
        Then I should be redirected to EUI dashboard page

    Scenario: Validate media viewer text redaction working
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        Then I see results returned
        When I open second case in search results
        Then I see case details page
        When I click tab with label "Tab 1" in case details page
        When I open dummy document
        Then I see the file displayed in Media Viewer
        Then I verify that text redaction is working

    Scenario: Validate media viewer bookmark feature working
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        Then I see results returned
        When I open second case in search results
        Then I see case details page
        When I click tab with label "Tab 1" in case details page
        When I open dummy document
        Then I see the file displayed in Media Viewer
        Then I verify that bookmark feature is working

    Scenario: Validate media viewer comment feature working
        When I click on search button
        Then Search page should be displayed
        When I enter search fields jurisdiction "Family Divorce" case type "XUI Test Case type dev"
        When I click apply to perform case search
        Then I see results returned
        When I open second case in search results
        Then I see case details page
        When I click tab with label "Tab 1" in case details page
        When I open dummy document
        Then I see the file displayed in Media Viewer
        Then I verify that comment feature is working


