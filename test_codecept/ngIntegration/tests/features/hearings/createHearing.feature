@ng @functional_enabled

Feature: Create hearings workflow

    Scenario: Create hearing , input combo 1
        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        # Given I set mock case hearings
        #     | hmcStatus        | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
        #     | AWAITING_LISTING | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
        #     | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |




        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        Given I set mock case hearings from file "viewEditHearings/caseHearings"
        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup"

        # Given I set mock hearings service hearing values with ref "partiesUpdated"
        # Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
        #     | partyName   | partyID |
        #     | Party1 name | party_1 |
        #     | Party2 name | party_2 |

        # Given I update mock hearings service hearing values with ref "partiesUpdated" for field "caseFlags"
        #     | partyId | partyName   | flagParentId | flagId | flagDescription | flagStatus |
        #     | party_1 | Party1 name | PARENT_0     | RA0042 | Party1 comment  | ACTIVE     |
        #     | party_2 | Party2 name | PARENT_0     | RA0042 | Party2 comment  | ACTIVE     |
        #     | party_1 | Party1 name | PARENT_0     | RA0053 | Party1 comment  | ACTIVE     |
        #     | party_2 | Party2 name | PARENT_0     | RA0053 | Party2 comment  | ACTIVE     |

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
            | field                                                    | value                                   |
            | Will this be a paper hearing?                            | No                                      |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone               |
            | How will each participant attend the hearing?            | Party1 name FN Party1 name LN,In Person |
            | How will each participant attend the hearing?            | Party2 name FN Party2 name LN,Video     |
            # | How will each participant attend the hearing?            | Mary Richards,Hearing channel 1                            |
            # | How will each participant attend the hearing?            | Elise Lynn,Hearing channel 1                               |
            # | How will each participant attend the hearing?            | David Carman,Hearing channel 1                             |
            | How many people will attend the hearing in person?       | 2                                       |
        When I click continue in create hearing workflow

        # What are the hearing venue details?
        Then I am on create hearing page "What are the hearing venue details?"
        When In create hearing page "What are the hearing venue details?", I input values
            | field                         | value                 |
            | Search for a location by name | cen,IA Court Center 1 |
        When I click continue in create hearing workflow

        # Does this hearing need to be in Welsh?
        Then I am on create hearing page "Does this hearing need to be in Welsh?"
        When In hearing page "Does this hearing need to be in Welsh?", I input values
            | field                                  | value |
            | Does this hearing need to be in Welsh? | No   |
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

        Then In create hearing workflow, I validate check yoor answers displayed
            | section                                    | field                                                    | value                     |
            |  | Case name | 1234567812345678 |
            |  | Case number | 1690- |
            # |                                            | Type                                                     |                                     |
            # | Hearing requirements                       | Reasonable adjustments                                   |                           |
            | Additional facilities                      | Will additional security be required?                    | No                        |
            | Additional facilities                      | Select any additional facilities required                | Facility 1,Facility 2     |
            | Stage                                      | What stage is this hearing at?                           | Breach 1                  |
            | Participant attendance                     | Will this be a paper hearing?                            | No                        |
            | Participant attendance                     | What will be the methods of attendance for this hearing? | In Person,Video,Telephone |
            # | Participant attendance                     | How will each participant attend the hearing?            |       |
            | Participant attendance                     | How many people will attend the hearing in person?       | 2                         |
            # | Hearing venue                              | What are the hearing venue details?                      |       |
            | Judge details                              | Do you want a specific judge?                            | No                        |
            | Judge details                              | Select all judge types that apply                        | Judge type 1,Judge type 2 |
            # | Panel details                              | Do you require a panel for this hearing?                 | No                                  |
            | Length, date and priority level of hearing | Length of hearing                                        | 1 Day 2 Hours 5 Minutes   |
            | Length, date and priority level of hearing | Does the hearing need to take place on a specific date?  | No                        |
            | Length, date and priority level of hearing | What is the priority of this hearing?                    | Hearing priority 1        |
            | Linked hearings                            | Will this hearing need to be linked to other hearings?   | No                        |
            #| Additional instructions                    | Enter any additional instructions for the hearing        | test instructions         |


        When In create hearing work flow, I click submit request

        Then I am on create hearing page "Hearing request submitted"

        Given I captured "OnPostHearing" request body from mock
        # Then I validate hearings request body "OnPutHearing"

        # Then debug sleep minutes 30

        Then I validate request body json "OnPostHearing", jsonpaths
            | jsonpath                                                     | value  |
            | $.partyDetails[0].individualDetails.reasonableAdjustments[0] | RA001 |


    Scenario: Create hearing , input combo 1.1
        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        # Given I set mock case hearings
        #     | hmcStatus        | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
        #     | AWAITING_LISTING | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
        #     | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |

        Given I set mock case hearings from file "viewEditHearings/caseHearings"
        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup_no_case_flags"

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
            | field                                                    | value                                           |
            | Will this be a paper hearing?                            | No                                              |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone                       |
            | How will each participant attend the hearing? | Party1 name FN Party1 name LN,In Person |
            | How will each participant attend the hearing? | Party2 name FN Party2 name LN,Video     |
            | How many people will attend the hearing in person?       | 5                                               |
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

        Then In create hearing workflow, I validate check yoor answers displayed
            | section                                    | field                                                    | value                     |
            |  | Case name   | 1234567812345678 |
            |  | Case number | 1690-            |
            # |                                            | Type                                                     |                                     |
          | Hearing requirements                       | Reasonable adjustments                                   |                           |
          | Additional facilities                      | Will additional security be required?                    | No                        |
          | Additional facilities                      | Select any additional facilities required                | Facility 1,Facility 2     |
          | Stage                                      | What stage is this hearing at?                           | Breach 1                  |
          | Participant attendance                     | Will this be a paper hearing?                            | No                        |
          | Participant attendance                     | What will be the methods of attendance for this hearing? | In Person,Video,Telephone |
          # | Participant attendance                     | How will each participant attend the hearing?            |       |
          | Participant attendance                     | How many people will attend the hearing in person?       | 5                         |
            # | Hearing venue                              | What are the hearing venue details?                      |       |
          | Judge details                              | Do you want a specific judge?                            | No                        |
          | Judge details                              | Select all judge types that apply                        | Judge type 1,Judge type 2 |
          # | Panel details                              | Do you require a panel for this hearing?                 | No                        |
          | Length, date and priority level of hearing | Length of hearing                                        | 1 Day 2 Hours 5 Minutes   |
          | Length, date and priority level of hearing | Does the hearing need to take place on a specific date?  | No                        |
          | Length, date and priority level of hearing | What is the priority of this hearing?                    | Hearing priority 1        |
          | Linked hearings                            | Will this hearing need to be linked to other hearings?   | No                        |
          | Additional instructions                    | Enter any additional instructions for the hearing        | test instructions         |


      When In create hearing work flow, I click submit request
        Then I am on create hearing page "Hearing request submitted"


    @ignore
    Scenario: Create hearing , input combo 2

        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        # Given I set mock case hearings
        #     | hmcStatus        | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
        #     | AWAITING_LISTING | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
        #     | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |

        Given I set mock case hearings from file "viewEditHearings/caseHearings"
        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup"

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
            | field                                                    | value                                           |
            | Will this be a paper hearing?                            | No                                              |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone                       |
            | How will each participant attend the hearing?            | First Applicant FN First Applicant LN,In Person |
            | How will each participant attend the hearing?            | Solicitor First Name Solicitor Last Name,Video  |
            | How will each participant attend the hearing?            | Mary Richards,Telephone                         |
            | How will each participant attend the hearing?            | Elise Lynn,Video                                |
            | How will each participant attend the hearing?            | David Carman,Video                              |
            | How many people will attend the hearing in person?       | 5                                               |
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
            | field                         | value                                |
            | Do you want a specific judge? | Yes                                  |
            | Name of the judge             | jud,auto_test_judge_0@justice.gov.uk |
        When I click continue in create hearing workflow

        # Do you require a panel for this hearing?
        # Then I am on create hearing page "Do you require a panel for this hearing?"
        # When In create hearing page "Do you require a panel for this hearing?", I input values
        #     | field                                    | value                                   |
        #     | Do you require a panel for this hearing? | Yes                                     |
        #     | Or select any other panel roles required | Panel member type 1,Panel member type 2 |
        # When I click continue in create hearing workflow


        # What are the hearing venue details?
        Then I am on create hearing page "Length, date and priority level of hearing"
        When In create hearing page "Length, date and priority level of hearing", I input values
            | field                                                   | value              |
            | Length of hearing                                       | 1,2,5              |
            | Does the hearing need to take place on a specific date? | Yes                |
            | The first date of the hearing must be                   | 1,2,2024           |
            | What is the priority of this hearing?                   | Hearing priority 1 |
        When I click continue in create hearing workflow

        # Length, date and priority level of hearing
        Then I am on create hearing page "Will this hearing need to be linked to other hearings?"
        When In create hearing page "Will this hearing need to be linked to other hearings?", I input values
            | field                                                  | value |
            | Will this hearing need to be linked to other hearings? | Yes   |
        When I click continue in create hearing workflow


        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Enter any additional instructions for the hearing"
        When In create hearing page "Enter any additional instructions for the hearing", I input values
            | field                                             | value             |
            | Enter any additional instructions for the hearing | test instructions |
        When I click continue in create hearing workflow

        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Check your answers before sending your request"


        Then In create hearing workflow, I validate check yoor answers displayed
            | section                                    | field                                                    | value                                                      |
            |                                            | Case name                                                | 1690                                                       |
            |                                            | Case number                                              | 1690-                                                      |
            # |                                            | Type                                                     |                                     |
            # | Hearing requirements                       | Reasonable adjustments                                   |                                                            |
            | Additional facilities                      | Will additional security be required?                    | No                                                         |
            | Additional facilities                      | Select any additional facilities required                | Facility 1,Facility 2                                      |
            | Stage                                      | What stage is this hearing at?                           | Breach 1                                                   |
            | Participant attendance                     | Will this be a paper hearing?                            | No                                                         |
            | Participant attendance                     | What will be the methods of attendance for this hearing? | In Person,Video,Telephone                                  |
            # | Participant attendance                     | How will each participant attend the hearing?            |       |
            | Participant attendance                     | How many people will attend the hearing in person?       | 5                                                          |
            # | Hearing venue                              | What are the hearing venue details?                      |       |
            | Judge details                              | Do you want a specific judge?                            | Yes                                                        |
            | Judge details                              | Name of the judge                                        | auto test 0 judge 0                                        |
            # | Judge details                              | Select all judge types that apply                        |       |
            # | Panel details                              | Do you require a panel for this hearing?                 |   Yes    |
            # | Panel members | Do you require a panel for this hearing? | Yes |
            | Length, date and priority level of hearing | Length of hearing                                        | 1 Day 2 Hours 5 Minutes                                    |
            | Length, date and priority level of hearing | Does the hearing need to take place on a specific date?  | Yes,The first date of the hearing must be,01 February 2024 |

            | Length, date and priority level of hearing | What is the priority of this hearing?                  | Hearing priority 1 |
            | Linked hearings                            | Will this hearing need to be linked to other hearings? | Yes                |
            | Additional instructions                    | Enter any additional instructions for the hearing      | test instructions  |


        When In create hearing work flow, I click submit request
        Then I am on create hearing page "Hearing request submitted"


    Scenario: Create hearing , input combo 3 - Welsh hearing location

        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        # Given I set mock case hearings
        #     | hmcStatus        | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
        #     | AWAITING_LISTING | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |
        #     | COMPLETED        | TEST_TYPE   | -5                     | -1                           | 2                                       | 4                                     |

        Given I set mock case hearings from file "viewEditHearings/caseHearings"
        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup"

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
            | field                                                    | value                                           |
            | Will this be a paper hearing?                            | No                                              |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone                       |
            | How will each participant attend the hearing? | Party1 name FN Party1 name LN,In Person |
            | How will each participant attend the hearing? | Party2 name FN Party2 name LN,Video     |
            | How many people will attend the hearing in person?       | 5                                               |
        When I click continue in create hearing workflow

        # What are the hearing venue details?
        Then I am on create hearing page "What are the hearing venue details?"
        When In create hearing page "What are the hearing venue details?", I input values
            | field                         | value                     |
            | Search for a location by name | cen,IA Court Center 2     |
        When I click continue in create hearing workflow


        Then I am on create hearing page "Does this hearing need to be in Welsh?"
        When In create hearing page "Does this hearing need to be in Welsh?", I input values
            | field                                  | value |
            | Does this hearing need to be in Welsh? | Yes   |
        When I click continue in create hearing workflow

        # Do you want a specific judge?
        Then I am on create hearing page "Do you want a specific judge?"
        When In create hearing page "Do you want a specific judge?", I input values
            | field                         | value                                |
            | Do you want a specific judge? | Yes                                  |
            | Name of the judge             | jud,auto_test_judge_0@justice.gov.uk |
        When I click continue in create hearing workflow

        # Do you require a panel for this hearing?
        # Then I am on create hearing page "Do you require a panel for this hearing?"
        # When In create hearing page "Do you require a panel for this hearing?", I input values
        #     | field                                    | value                                   |
        #     | Do you require a panel for this hearing? | Yes                                     |
        #     | Include specific panel members | jud,auto_test_judge_1@justice.gov.uk |
        #     | Exclude specific panel members | jud,auto_test_judge_2@justice.gov.uk |

        # When I click continue in create hearing workflow

        # What are the hearing venue details?
        Then I am on create hearing page "Length, date and priority level of hearing"
        When In create hearing page "Length, date and priority level of hearing", I input values
            | field                                                   | value               |
            | Length of hearing                                       | 1,2,5               |
            | Does the hearing need to take place on a specific date? | Choose a date range |
            | Earliest start date                                     | 1,8,2025            |
            | Latest end date                                         | 1,9,2025            |

            | What is the priority of this hearing? | Hearing priority 1 |
        When I click continue in create hearing workflow

        # Length, date and priority level of hearing
        Then I am on create hearing page "Will this hearing need to be linked to other hearings?"
        When In create hearing page "Will this hearing need to be linked to other hearings?", I input values
            | field                                                  | value |
            | Will this hearing need to be linked to other hearings? | Yes   |
        When I click continue in create hearing workflow


        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Enter any additional instructions for the hearing"
        When In create hearing page "Enter any additional instructions for the hearing", I input values
            | field                                             | value             |
            | Enter any additional instructions for the hearing | test instructions |
        When I click continue in create hearing workflow

        # Enter any additional instructions for the hearing
        Then I am on create hearing page "Check your answers before sending your request"


        Then In create hearing workflow, I validate check yoor answers displayed
            | section                | field                                                    | value                     |
            |  | Case name | 1234567812345678 |
            |                        | Case number                                              | 1690-                     |
            # |                                            | Type                                                     |                                     |
            # | Hearing requirements   | Reasonable adjustments                                   |                           |
            | Additional facilities  | Will additional security be required?                    | No                        |
            | Additional facilities  | Select any additional facilities required                | Facility 1,Facility 2     |
            | Stage                  | What stage is this hearing at?                           | Breach 1                  |
            | Participant attendance | Will this be a paper hearing?                            | No                        |
            | Participant attendance | What will be the methods of attendance for this hearing? | In Person,Video,Telephone |
            # | Participant attendance                     | How will each participant attend the hearing?            |       |
            | Participant attendance | How many people will attend the hearing in person?       | 5                         |
            # | Hearing venue                              | What are the hearing venue details?                      |       |
            | Judge details          | Do you want a specific judge?                            | Yes                       |
            | Judge details          | Name of the judge                                        | auto test 0 judge 0       |
            # | Judge details                              | Select all judge types that apply                        |       |
            # | Panel details                              | Do you require a panel for this hearing?                 | Yes                                                        |
            # | Panel details | Include specific panel members | auto test 1 judge 1 |
            # | Panel details | Exclude specific panel members | auto test 2 judge 2 |

            | Length, date and priority level of hearing | Length of hearing                                       | 1 Day 2 Hours 5 Minutes                                                                     |
            | Length, date and priority level of hearing | Does the hearing need to take place on a specific date? | Choose a date range,Earliest start date: 01 August 2025, Latest end date: 01 September 2025 |

            | Length, date and priority level of hearing | What is the priority of this hearing?                  | Hearing priority 1 |
            | Linked hearings                            | Will this hearing need to be linked to other hearings? | Yes                |
           #| Additional instructions                    | Enter any additional instructions for the hearing      | test instructions  |


        When In create hearing work flow, I click submit request
        Then I am on create hearing page "Hearing request submitted"


