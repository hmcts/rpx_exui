
@ng @functional_enabled
Feature: Hearings : Summary page validations EUI-9097
    Background: Setup
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "CIVIL"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "CIVIL"

        Given I set mock case hearings from file "viewEditHearings/caseHearings"

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        # Given I set mock hearing data for state "LISTED"
        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup"


    Scenario: No changes,EUI-9097 scr 1 and scr 5
        cenario: SCR_1: CAT1 and CAT 2 ,Ameded and ACTION NEEDED labels  (Conditions (1) & (4))
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        # Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_SCR_1"

        When In hearings tab, I click action "View or edit" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"
        Then In edit hearing page error banner displayed with message "The request has not been updated"

        # hearing stage start
        When In view or edit hearing page, I click change link for field "What stage is this hearing at?"
        Then I am on hearings workflow page "What stage is this hearing at?"

        When In hearing page "What stage is this hearing at?", I input values
            | field                          | value    |
            | What stage is this hearing at? | Breach 1 |

        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"
        Then I am on hearings workflow page "Provide a reason for changing this hearing"

    Scenario: changes to CAT1 only, EUI-9097 scr 2
        cenario: SCR_1: CAT1 and CAT 2 ,Ameded and ACTION NEEDED labels  (Conditions (1) & (4))
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_CAT1_only"

        When In hearings tab, I click action "View or edit" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"
        Then I am on hearings workflow page "Provide a reason for changing this hearing"

    Scenario: changes to CAT2 only, EUI-9097 scr 3 and scr 4
        cenario: SCR_1: CAT1 and CAT 2 ,Ameded and ACTION NEEDED labels  (Conditions (1) & (4))
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_CAT2_only"

        When In hearings tab, I click action "View or edit" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"
        Then In edit hearing page error displayed with message "You have not added all the updates. Click the 'Change' link under any sections labelled 'Action needed' and then click the continue button at the end of the page to add the changes to the hearing summary. You will not be able to submit the request until this is done."

        # Accept Hearing requirements
        When In view or edit hearing page, I click change link for field "Reasonable adjustments"
        Then I am on hearings workflow page "Hearing requirements"

        Then In hearings requirements page, I see case flags displayed for parties
            | partyName           |
            | Party1 name |
            | Party2 name         |


        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed


        When In view or edit hearing page, I click change link for field "Will this be a paper hearing?"
        Then I am on hearings workflow page "Participant attendance"
        When In create hearing page "Participant attendance", I input values
            | field                         | value |
            | Will this be a paper hearing? | No    |

        Then In hearings Participant attendance page, I see parties
            | partyName   | label         |
            | Party1 name |        |
            | Party2 name |               |
            | Party4 name |  |


        # Then debug sleep minutes 30

        When In hearing page "Participant attendance", I input values and click continue
            | field                                                    | value                 |
            | Will this be a paper hearing?                            | No                    |
            | What will be the methods of attendance for this hearing? | In Person, Video      |
            | How will each participant attend the hearing?            | Party1 name,In Person |
            | How will each participant attend the hearing?            | Party4 name,Video     |
            | How will each participant attend the hearing?            | Party2 name,Video     |

            | How many people will attend the hearing in person? | 2 |
        # When I click continue in hearing workflow
        Then I validate Edit hearing page displayed

        When I click button with label "Submit updated request"
        Then I am on hearings workflow page "Provide a reason for changing this hearing"

