
@ng @functional_enabled
Feature: Hearings : Linked hearing

    Scenario: Link hearings
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_OFF"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page


        When In hearings tab, I click action "Link hearing" for hearing "LISTED" under table "Current and upcoming"

        Then I am on linked hearing page "Which hearings should be linked?"
        When In link hearing page I select case hearings
        |caseReference|hearing|
            | 1234-5678-8765-4320 | LISTED |
            | 1234-5678-8765-4321 | LISTED |

        When In link hearing workflow I click continue button
        Then I am on linked hearing page "How should these linked hearings be heard?"
        When In link hearing How should these linked hearings be heard? page, I select option "Hearings should be heard in a particular order, but not together"
        When In link hearing How should these linked hearings be heard? page, I select case hearing order
        |caseReference|position|
            | 1234-5678-8765-4320 | 1 |
            | 1234-5678-8765-4321 | 2 |
        When In link hearing workflow I click continue button
        Then I am on linked hearing page "Check your answers"
        When In link hearing workflow I click Link hearings button
        Then I see link hearings confirmatin page with message "2 hearings are now linked"
# Then debug sleep minutes 20
