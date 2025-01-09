
@ng @functional_enabled @ignore
Feature: Hearings CR84: Automatic pageless updates

    Scenario: Hearing automatic updates CAT1 only
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
            | $.hearingDetails.hearingWindow.firstDateTimeMustBe | 2024-12-14T00:00:00 |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"

        Given I set parties in mock hearing data for state "LISTED"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |

      
        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                     | value |
            | $.caseFlags.flags            | []    |
            | $.hmctsInternalCaseName | 1234567812345678 |
            | $.publicCaseName | Mock case public name |
            | $.hearingWindow.firstDateTimeMustBe | 2024-12-14T00:00:00 |
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |


        # loop 1
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                                                          | value                         |
            | $.caseManagementLocationCode                                      | 10001                         |
           
        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed
        # Then debug sleep minutes 30
        Then In edit hearing page warning message banner isDisplayed "true"
        Then In edit hearing page warning message banner contains "Some details required for the hearing have been changed - they may not be displayed below"
        


    # loop 2
        When I click on primary navigation header tab "Case list", I see selected tab page displayed
        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                     | value |
            | $.caseManagementLocationCode | 10001 |
            | $.parties[0].partyRole | MockRole |

        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed
        # Then debug sleep minutes 30
        Then In edit hearing page warning message banner isDisplayed "true"
        Then In edit hearing page warning message banner contains "Some details required for the hearing have been changed - they may not be displayed below"


        # loop 3
        When I click on primary navigation header tab "Case list", I see selected tab page displayed
        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                     | value    |
            | $.caseManagementLocationCode | 10001    |
            | $.parties[0].individualDetails.vulnerableFlag | true |

        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed
        # Then debug sleep minutes 30
        Then In edit hearing page warning message banner isDisplayed "true"
        Then In edit hearing page warning message banner contains "Some details required for the hearing have been changed - they may not be displayed below"



    Scenario: Hearing automatic updates CAT2 only
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |


        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |

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

        Given I set mock hearing data for state "LISTED"
        Given I set parties in mock hearing data for state "LISTED"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |

        Given I set mock get hearing with with status "LISTED" and values at jsonpath
            | jsonpath                                          | value                              |
            | $.caseDetails.hmctsInternalCaseName               | Mock case hmcts internal case name |
            | $.caseDetails.publicCaseName                      | Mock case public name              |
            | $.hearingDetails.hearingType                      | ABA5-ABC                           |
            | $.hearingDetails.hearingChannels                  | [ABA1-HRC,ABA2-HRC]                |
            | $.hearingDetails.hearingLocations[0].locationType | court                              |
            | $.hearingDetails.hearingLocations[0].locationId   | 20001                              |
            | $.hearingDetails.panelRequirements.roleType       | [ABA1-JDT,ABA2-JDT]                |

        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath          | value |
            | $.caseFlags.flags | []    |
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |


        # loop 1
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                         | value |
            | $.hearingLocations[0].locationId | 30001 |

        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed
        # Then debug sleep minutes 30
        Then In edit hearing page warning message banner isDisplayed "false"




    Scenario: Hearing automatic updates CAT1 and CAT2
        Given I set MOCK with user details with user identifier "HEARING_MANAGER_CR84_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |


        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set mock case hearings
            | hmcStatus | hearingType | hearingRequestDateTime | lastResponseReceivedDateTime | hearingDaySchedule.hearingStartDateTime | hearingDaySchedule.hearingEndDateTime |
            | LISTED    | TEST_TYPE   | -3                     | 0                            | -3                                      | 2                                     |

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

        Given I set mock hearing data for state "LISTED"
        Given I set parties in mock hearing data for state "LISTED"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |

        # Given I set mock get hearing with with status "LISTED" and values at jsonpath
        #     | jsonpath                                          | value                              |
        #     | $.caseDetails.hmctsInternalCaseName               | Mock case hmcts internal case name |
        #     | $.caseDetails.publicCaseName                      | Mock case public name              |
        #     | $.hearingDetails.hearingType                      | ABA5-ABC                           |
        #     | $.hearingDetails.hearingChannels                  | [ABA1-HRC,ABA2-HRC]                |
        #     | $.hearingDetails.hearingLocations[0].locationType | court                              |
        #     | $.hearingDetails.hearingLocations[0].locationId   | 20001                              |
        #     | $.hearingDetails.panelRequirements.roleType       | [ABA1-JDT,ABA2-JDT]                |

        Given I set mock hearings service hearing values with ref "partiesUpdated"
        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath          | value |
            | $.caseFlags.flags | []    |
        Given I update mock hearings service hearing values with ref "partiesUpdated" for field "parties"
            | type | partyName       | partyID                  |
            | IND  | Party1 name     | 1234-uytr-7654-asdf-0001 |
            | IND  | Party2 name     | 1234-uytr-7654-asdf-0002 |
            | ORG  | party3 org name | 1234-uytr-7654-asdf-0003 |


        # loop 1
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I am on hearings tab page
        Then I see hearings table for "Current and upcoming" in hearings tab page

        Given I update mock hearings service hearing values with ref "partiesUpdated" at jsonpaths
            | jsonpath                     | value |
            | $.caseManagementLocationCode | 10001 |
            | $.parties[0].individualDetails.firstName | "Updated FN" |

        When In hearings tab, I click action "View details" for hearing "TEST_TYPE" under table "Current and upcoming"
        Then I validate view hearing page displayed
        Then I validate view hearing page Edit hearing button displayed is "true"
        When In view hearing page, I click Edit hearing button
        Then I validate Edit hearing page displayed
        Then In edit hearing page warning message banner isDisplayed "false"

