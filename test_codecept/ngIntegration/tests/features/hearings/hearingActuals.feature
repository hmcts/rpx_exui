
@ng @functional_enabled 
Feature: Hearings : Actuals update

    Scenario: Add or edit action
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_OFF"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"

        # Given I set mock case hearings
        #     | hmcStatus        | hearingType           | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
        #       | AWAITING_ACTUALS | TEST_AWAITING_HEARING | -5                     | -1                           | 2                                       | 4                                     |

        # Given I set mock get hearing with with status "AWAITING_ACTUALS" and values at jsonpath
        #     | jsonpath                                          | value                              |
        #     | $.caseDetails.hmctsInternalCaseName               | Mock case hmcts internal case name |
        #     | $.caseDetails.publicCaseName                      | Mock case public name              |
        #     | $.hearingDetails.hearingType                      | ABA5-ABC                           |
        #     | $.hearingDetails.hearingChannels                  | [ABA1-HRC,ABA2-HRC]                |
        #     | $.hearingDetails.hearingLocations[0].locationType | court                              |
        #     | $.hearingDetails.hearingLocations[0].locationId   | 20001                              |
        #     | $.hearingDetails.panelRequirements.roleType       | [ABA1-JDT,ABA2-JDT]                |


        # Given I set mock hearings service hearing values with ref "mockLSH"
        # Given I update mock hearings service hearing values with ref "mockLSH" for field "parties"
        #     | partyName   |
        #     | Party1 name |
        #     | Party2 name |
        # Given I update mock hearings service hearing values with ref "mockLSH" at jsonpaths
        #     | jsonpath                                               | value                              |
        #     | $.publicCaseName                                       | Mock Test case public case name    |
        #     | $.hmctsInternalCaseName                                | Mock case hmcts internal case name |
        #     | $.hearingChannels                                      | [ABA1-HRC,ABA2-HRC]                |
        #     | $.parties[0].individualDetails.preferredHearingChannel | ABA1-HRC                           |
        #     | $.parties[1].individualDetails.preferredHearingChannel | ABA1-HRC                           |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page


        When In hearings tab, I click action "Add or edit" for hearing "MOCK_AWAITING_ACTUALS" under table "Current and upcoming"
        Then I see hearing actuals page
        Then In hearing actual, I see hearings for date "06 December 2023"
        Then In hearing actual, I see hearings for date "07 December 2023"

        Then In hearing actual, I click hearing date "06 December 2023"
        Then In hearing actuals, hearing date "06 December 2023" displayed with values and actions
            | field                             | value           | actions        |
            | Was this hearing day required?    | Yes             | Change         |
            | Hearing timings                   |                 | Confirm,Update |
            | Start time                        | 10:00           |                |
            | Finish time                       | 16:00           |                |
            | Pause time                        |                 |                |
            | Resume time                       |                 |                |
            | Participants                      |              | Confirm,Update |
            | Names                             | Applicant1 data |                |
            | How participants will attend | Applicant1 data |                |

        When In hearing actual for date "06 December 2023", I click action link "Update" for field "Hearing timings"
        Then In hearing actuals, I see hearing start and finsih times page
        When In hearing actuals start finish times page, I select radio option "Yes" for Do you need to record times the hearing was paused?
        When In hearing actuals start and finish times page I input values
            | field       | value |
            | Start time  | 10:00 |
            | Finish time | 17:00 |
            | Pause time  | 13:00 |
            | Resume time | 14:00 |
        When In hearing actuals start finish times page, I click save and continue

        Then I see hearing actuals page
        Then In hearing actual, I click hearing date "06 December 2023"
        Then In hearing actuals, hearing date "06 December 2023" displayed with values and actions
            | field                             | value           | actions        |
            | Was this hearing day required?    | Yes             | Change         |
            | Hearing timings                   |                 | Confirm,Update |
            | Start time                        | 10:00           |                |
            | Finish time                       | 17:00           |                |
            | Pause time                        | 13:00           |                |
            | Resume time                       | 14:00           |                |
            | Participants                      |              | Confirm,Update |
            | Names                             | Applicant1 data |                |
            | How participants will attend | Applicant1 data |                |
        # Then debug sleep minutes 20

# Then I validate view or edit hearing page displayed


# Then I validate edit heating change links and navigation
#     | changeLinkFor                                           | navigationPage                                         | pageHeader                                               |
#     | Reasonable adjustments                                  | Hearing requirements                                   | Request a hearing for Mock Test case public case name    |
#     | Will additional security be required?                   | Do you require any additional facilities?              | Request a hearing for Mock Test case public case name    |
#     | What stage is this hearing at?                          | What stage is this hearing at?                         | Request a hearing for Mock Test case public case name    |
#     | Will this be a paper hearing?                           | Participant attendance                                 | Request a hearing for Mock Test case public case name    |
#     | What are the hearing venue details?                     | What are the hearing venue details?                    | Request a hearing for Mock Test case public case name    |
#     | Does this hearing need to be in Welsh?                  | Does this hearing need to be in Welsh?                 | Request a hearing for Mock Test case public case name |
#     | Do you want a specific judge?                           | Do you want a specific judge?                          | Request a hearing for Mock Test case public case name    |
#     | Length of hearing                                       | Length, date and priority level of hearing             | Request a hearing for Mock Test case public case name    |
#     | Does the hearing need to take place on a specific date? | Length, date and priority level of hearing             | Request a hearing for Mock Test case public case name    |
#     | What is the priority of this hearing?                   | Length, date and priority level of hearing             | Request a hearing for Mock Test case public case name    |
#     | Will this hearing need to be linked to other hearings?  | Will this hearing need to be linked to other hearings? | Request a hearing for Mock case hmcts internal case name |
#     | Enter any additional instructions for the hearing       | Enter any additional instructions for the hearing      | Request a hearing for Mock Test case public case name    |


