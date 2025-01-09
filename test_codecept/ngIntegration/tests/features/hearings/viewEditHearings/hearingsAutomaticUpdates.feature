
@ng @functional_enabled @ignore
Feature: Hearings CR84: Automatic updates

    Scenario: Hearing automatic updates
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |


        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |

        Given I set mock hearing data for state "LISTED"


        Given I set mock get hearing with with status "LISTED" and values at jsonpath
            | jsonpath                            | value                 |
            | $.caseDetails.hmctsInternalCaseName | 1234567812345678      |
            | $.caseDetails.publicCaseName        | Mock case public name |
            | $.hearingDetails.hearingType        | ABA5-ABC              |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        
        Given I set parties in mock hearing data for state "LISTED"
            | type | partyName       | partyId                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |

        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
            | type | partyName       | partyId                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |

        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

      

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                                                          | value                         |
            | $.caseManagementLocationCode                                      | 10001                         |
            | $.parties[0].partyRole                                            | APPL_UPDATED                  |
            | $.parties[0].individualDetails.relatedParties[0].relatedPartyID   | mockPartyId                   |
            | $.parties[0].individualDetails.relatedParties[0].relatedPartyName | related Party name updated    |
            | $.parties[0].individualDetails.vulnerableFlag                     | true                          |
            | $.parties[0].individualDetails.vulnerabilityDetails               | vulnerability details updated |
            | $.parties[0].individualDetails.hearingChannelEmail                | mock_updated@email.com        |
            | $.parties[0].individualDetails.hearingChannelPhone                | 07123456789                   |
            | $.parties[2].organisationDetails.name                     | Mock org updated              |
            | $.parties[2].organisationDetails.organisationType                 | MockOrg                       |
            | $.parties[2].organisationDetails.cftOrganisationID                | MOCK123                       |
            | $.caseSLAStartDate                                                | 01-01-2024                    |

      
        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"

        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed

        Then debug sleep minutes 30

        Then I validate fields displayed in view or edit hearing page
            | field                                 | value  | changeLinkDisplay | amendedFlagDisplay |
            | Status                                | LISTED | false             | false              |
            | Will additional security be required? | No     | true              | false              |

        When In view or edit hearing page, I click change link for field "Will this be a paper hearing?"
        Then I am on hearings workflow page "Participant attendance"
        When In create hearing page "Participant attendance", I input values
            | field                         | value |
            | Will this be a paper hearing? | No    |
        Then In hearings Participant attendance page, I see parties
            | partyName   |
            | Party1 name |
            | Party2 name |

        When In hearing page "Participant attendance", I input values
            | field                                                    | value                               |
            | Will this be a paper hearing?                            | No                                  |
            | What will be the methods of attendance for this hearing? | Hearing channel 1,Hearing channel 2 |
            | How will each participant attend the hearing?            | Party1 name,Hearing channel 1       |
            | How will each participant attend the hearing?            | Party2 name,Hearing channel 1       |
            | How many people will attend the hearing in person?       | 2                                   |
        When I click continue in hearing workflow
        Then I validate Edit hearing page displayed

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
            | jsonpath                                                               | value                         |
            | $.caseDetails.caseManagementLocationCode                               | 10001                         |
            | $.partyDetails[0].partyRole                                            | APPL_UPDATED                  |
            | $.partyDetails[0].individualDetails.relatedParties[0].relatedPartyID   | mockPartyId                   |
            | $.partyDetails[0].individualDetails.relatedParties[0].relatedPartyName | related Party name updated    |
            | $.partyDetails[0].individualDetails.vulnerableFlag                     | true                          |
            | $.partyDetails[0].individualDetails.vulnerabilityDetails               | vulnerability details updated |
            | $.partyDetails[0].individualDetails.hearingChannelEmail                | mock_updated@email.com        |
            | $.partyDetails[0].individualDetails.hearingChannelPhone                | 07123456789                   |
            | $.partyDetails[2].organisationDetails.name                     | Mock org updated              |
            | $.partyDetails[2].organisationDetails.organisationType                 | MockOrg                       |
            | $.partyDetails[2].organisationDetails.cftOrganisationID                | MOCK123                       |


