
@ng @functional_enabled
Feature: Hearings CR84 OFF: View or edit action


    Scenario: Hearing View or edit action
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_OFF"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "SSCS"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "Benefit"

        Given I set mock case hearings from file "viewEditHearings/caseHearings"

        Given I set mock hearing HMC response from file "viewEditHearings/mock_HMC_setup"
        Given I set mock hearing SHV response from file "viewEditHearings/mock_SHV_setup"

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        Given I set mock hearings service hearing values with ref "partiesUpdated"

        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        When In hearings tab, I click action "View or edit" for hearing "TEST_TYPE" under table "Current and upcoming"

        Then I validate view or edit hearing page displayed


        Then I validate fields displayed in view or edit hearing page
            | field                                 | value  | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
            | Status                                | LISTED | false             |                              |
            | Will additional security be required? | No     | true              |                              |


        When In view or edit hearing page, I click change link for field "Reasonable adjustments"
        Then I am on hearings workflow page "Hearing requirements"
        Then In hearings requirements page, I see case flags displayed for parties
            | partyName  |
            | Jane Smith |

        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed

        When In view or edit hearing page, I click change link for field "Select any additional facilities required"
        Then I am on hearings workflow page "Do you require any additional facilities?"
        Then In additional facilities page, I see case flags displayed for parties
            | partyName   |
            | Jane Smith 2 |

        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        When In view or edit hearing page, I click change link for field "Will this be a paper hearing?"
        Then I am on hearings workflow page "Participant attendance"
        When In create hearing page "Participant attendance", I input values
            | field                         | value |
            | Will this be a paper hearing? | No    |
        Then In hearings Participant attendance page, I see parties
            | partyName                     |
            | Party1 name FN Party1 name LN |
            | Party2 name FN Party2 name LN |


        When In hearing page "Participant attendance", I input values
            | field                                                    | value                                   |
            | Will this be a paper hearing?                            | No                                      |
            | What will be the methods of attendance for this hearing? | In Person,Video,Telephone               |
            | How will each participant attend the hearing?            | Party1 name FN Party1 name LN,In Person |
            | How will each participant attend the hearing?            | Party2 name FN Party2 name LN,Video     |
            | How many people will attend the hearing in person?       | 2                                       |
        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        # hearing stage start
        When In view or edit hearing page, I click change link for field "What stage is this hearing at?"
        Then I am on hearings workflow page "What stage is this hearing at?"

        When In hearing page "What stage is this hearing at?", I input values
            | field                          | value    |
            | What stage is this hearing at? | Breach 1 |


        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        Then I validate edit hearing section heading labels
            | Heading                 | Label |
            | Stage                   |       |
            | Hearing venue           |       |
            | Language requirements   |       |
            | Judge details           |       |
            | Linked hearings         |       |
            | Additional instructions |       |

        Then I validate fields displayed in view or edit hearing page
            | field                          | value    | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
            | What stage is this hearing at? | Breach 1 | true              | AMENDED                      |

        # hearing stage end


        # Hearing venue start
        When In view or edit hearing page, I click change link for field "What are the hearing venue details"
        Then I am on hearings workflow page "What are the hearing venue details?"

        When In hearing page "What are the hearing venue details?", I input values
            | field                         | value                 |
            | Search for a location by name | cen,IA Court Center 2 |

        When I click continue in hearing workflow

        Then I am on hearings workflow page "Does this hearing need to be in Welsh?"
        When In hearing page "Does this hearing need to be in Welsh?", I input values
            | field                                  | value |
            | Does this hearing need to be in Welsh? | No   |

        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        Then I validate edit hearing section heading labels
            | Heading                 | Label |
            | Stage                   |       |
            | Hearing venue           |       |
            | Language requirements   |       |
            | Judge details           |       |
            | Linked hearings         |       |
            | Additional instructions |       |
            
        # Hearing venue end

        # Language requirements start
        # When In view or edit hearing page, I click change link for field "Does this hearing need to be in Welsh?"
        # Then I am on hearings workflow page "Does this hearing need to be in Welsh?"

        # When In hearing page "Does this hearing need to be in Welsh?", I input values
        #     | field                                  | value |
        #     | Does this hearing need to be in Welsh? | Yes   |


        # When I click continue in hearing workflow
        # Then I validate view or edit hearing page displayed


        # Then I validate edit hearing section heading labels
        #     | Heading                 | Label |
        #     | Stage                   |       |
        #     | Hearing venue           |       |
        #     | Language requirements   |       |
        #     | Judge details           |       |
        #     | Linked hearings         |       |
        #     | Additional instructions |       |

        # Then I validate fields displayed in view or edit hearing page
        #     | field                                  | value | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
        #     | Does this hearing need to be in Welsh? | Yes   | true              |                              |

        # Language requirements end


        # Judge details start
        When In view or edit hearing page, I click change link for field "Do you want a specific judge?"
        Then I am on hearings workflow page "Do you want a specific judge?"

        When In hearing page "Do you want a specific judge?", I input values
            | field                             | value                     |
            | Do you want a specific judge?     | No                        |
            | Select all judge types that apply | Judge type 1,Judge type 2 |


        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        Then I validate edit hearing section heading labels
            | Heading                 | Label |
            | Stage                   |       |
            | Hearing venue           |       |
            | Language requirements   |       |
            | Judge details           |       |
            | Linked hearings         |       |
            | Additional instructions |       |

        Then I validate fields displayed in view or edit hearing page
            | field                             | value                      | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
            | Do you want a specific judge?     | No                         | true              |                              |
            | Select all judge types that apply | Judge type 1, Judge type 2 | true              | AMENDED                      |

        # Judge details end




        # Linked hearings start
        When In view or edit hearing page, I click change link for field "Will this hearing need to be linked to other hearings?"
        Then I am on hearings workflow page "Will this hearing need to be linked to other hearings?"

        When In hearing page "Will this hearing need to be linked to other hearings?", I input values
            | field                                                  | value |
            | Will this hearing need to be linked to other hearings? | Yes   |

        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        Then I validate edit hearing section heading labels
            | Heading                 | Label |
            | Stage                   |       |
            | Hearing venue           |       |
            | Language requirements   |       |
            | Judge details           |       |
            | Linked hearings         |       |
            | Additional instructions |       |

        Then I validate fields displayed in view or edit hearing page
            | field                                                  | value | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
            | Will this hearing need to be linked to other hearings? | Yes   | true              | AMENDED                      |

        # Linked hearings end




        # Additional instructions start
        When In view or edit hearing page, I click change link for field "Enter any additional instructions for the hearing"
        Then I am on hearings workflow page "Enter any additional instructions for the hearing"

        When In hearing page "Enter any additional instructions for the hearing", I input values
            | field                                             | value                     |
            | Enter any additional instructions for the hearing | Manual update labels test |

        When I click continue in hearing workflow
        Then I validate view or edit hearing page displayed


        Then I validate edit hearing section heading labels
            | Heading                 | Label |
            | Stage                   |       |
            | Hearing venue           |       |
            | Language requirements   |       |
            | Judge details           |       |
            | Linked hearings         |       |
            | Additional instructions |       |

        Then I validate fields displayed in view or edit hearing page
            | field                                             | value                     | changeLinkDisplay | amendedFlagDisplayed_preCR84 |
            | Enter any additional instructions for the hearing | Manual update labels test | true              | AMENDED                      |




        When I click button with label "Submit updated request"

        Then I am on hearings workflow page "Provide a reason for changing this hearing"
        When In hearing page "Provide a reason for changing this hearing", I input values
            | field                                      | value                |
            | Provide a reason for changing this hearing | Change reason code 1 |

        When I click button with label "Submit change request"
        Then I am on hearing page "Hearing request submitted"
        Given I captured "OnPutHearing" request body from mock
        # Then I validate hearings request body "OnPutHearing"

        Then I validate request body json "OnPutHearing", jsonpaths
            | jsonpath                     | value                     |
            | $.requestDetails.status      | LISTED                    |
            | $.hearingDetails.hearingType | ABA1-BRE                |


