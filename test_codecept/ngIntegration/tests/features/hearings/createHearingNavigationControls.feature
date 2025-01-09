
@ng @functional_enabled
Feature: Create hearings workflow navigation controls

    Background: create hearing
        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I set mock case hearings
            | hmcStatus        | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | AWAITING_LISTING | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
            | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        When I click Request a hearing button
        Then I see create hearing workflow container

        # Hearing requirements
        Then I am on create hearing page "Hearing requirements"
        When I click continue in create hearing workflow

        # Do you require any additional facilities?
        Then I am on create hearing page "Do you require any additional facilities?"
        When In create hearing page "Do you require any additional facilities?", I input values
            | field                                     | value                 |
            | Will additional security be required?     | No                    |
            | Select any additional facilities required | Facility 1,Facility 2 |
        When I click continue in create hearing workflow

        # What stage is this hearing at?
        Then I am on create hearing page "What stage is this hearing at?"
        When In create hearing page "What stage is this hearing at?", I input values
            | field                          | value    |
            | What stage is this hearing at? | Breach 1 |
        When I click continue in create hearing workflow

        # Participant attendance
        Then I am on create hearing page "Participant attendance"
        When In create hearing page "Participant attendance", I input values
            | field                                                    | value                                                      |
            | Will this be a paper hearing?                            | No                                                         |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone                       |
            | How will each participant attend the hearing?            | First Applicant FN First Applicant LN,In Person    |
            | How will each participant attend the hearing?            | Solicitor First Name Solicitor Last Name,Video |
            | How will each participant attend the hearing?            | Mary Richards,In Person                            |
            | How will each participant attend the hearing?            | Elise Lynn,Video                              |
            | How will each participant attend the hearing?            | David Carman,Telephone                            |
            | How many people will attend the hearing in person?       | 5                                                          |
        When I click continue in create hearing workflow

        # What are the hearing venue details?
        Then I am on create hearing page "What are the hearing venue details?"
        When In create hearing page "What are the hearing venue details?", I input values
            | field                         | value                 |
            | Search for a location by name | cen,IA Court Center 1 |
        When I click continue in create hearing workflow


        # Do you want a specific judge?
        Then I am on create hearing page "Do you want a specific judge?"
        When In create hearing page "Do you want a specific judge?", I input values
            | field                             | value                     |
            | Do you want a specific judge?     | No                        |
            | Select all judge types that apply | Judge type 1,Judge type 2 |
        When I click continue in create hearing workflow

        # Do you require a panel for this hearing?
        # Then I am on create hearing page "Do you require a panel for this hearing?"
        # When In create hearing page "Do you require a panel for this hearing?", I input values
        #     | field                                    | value |
        #     | Do you require a panel for this hearing? | No    |
        # When I click continue in create hearing workflow


        # What are the hearing venue details?
        Then I am on create hearing page "Length, date and priority level of hearing"
        When In create hearing page "Length, date and priority level of hearing", I input values
            | field                                                   | value              |
            | Length of hearing                                       | 1,2,5              |
            | Does the hearing need to take place on a specific date? | No                 |
            | What is the priority of this hearing?                   | Hearing priority 1 |
        When I click continue in create hearing workflow

        # Length, date and priority level of hearing
        Then I am on create hearing page "Will this hearing need to be linked to other hearings?"
        When In create hearing page "Will this hearing need to be linked to other hearings?", I input values
            | field                                                  | value |
            | Will this hearing need to be linked to other hearings? | No    |
        When I click continue in create hearing workflow


        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Enter any additional instructions for the hearing"
        When In create hearing page "Enter any additional instructions for the hearing", I input values
            | field                                             | value             |
            | Enter any additional instructions for the hearing | test instructions |
        When I click continue in create hearing workflow

        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Check your answers before sending your request"


    Scenario: Navigation controls, back link
        When In create hearing work flow, I click back link
        Then I am on create hearing page "Enter any additional instructions for the hearing"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Will this hearing need to be linked to other hearings?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Length, date and priority level of hearing"

        # When In create hearing work flow, I click back link
        # Then I am on create hearing page "Do you require a panel for this hearing?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Do you want a specific judge?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "What are the hearing venue details?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Participant attendance"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "What stage is this hearing at?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Do you require any additional facilities?"

        When In create hearing work flow, I click back link
        Then I am on create hearing page "Hearing requirements"


    Scenario: Navigation controls, change link then continue, back links
        When In create hearing check your answers page, I click change link for field "Enter any additional instructions for the hearing"
        Then I am on create hearing page "Enter any additional instructions for the hearing"
        When I click continue in create hearing workflow
        Then I am on create hearing page "Check your answers before sending your request"

        When In create hearing check your answers page, I click change link for field "Will this hearing need to be linked to other hearings?"
        Then I am on create hearing page "Will this hearing need to be linked to other hearings?"
        When I click continue in create hearing workflow
        Then I am on create hearing page "Check your answers before sending your request"

        When In create hearing check your answers page, I click change link for field "Length of hearing"
        Then I am on create hearing page "Length, date and priority level of hearing"
        # When In create hearing work flow, I click back link
        # Then I am on create hearing page "Do you require a panel for this hearing?"