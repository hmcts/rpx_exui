
@ng @functional_enabled
Feature: Hearings: Hearings tab display controls

    Scenario: Hearigs: Request hearing button display with correct roles
        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I see Request a hearing button in hearings tab page

    Scenario: Request hearing button not displayed with missing roles
        Given I set MOCK with user details
            | roles | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,hearing-viewer |
            | roleCategory | LEGAL_OPERATIONS                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        # Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        # Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Hearings" is displayed is "true"
        When I click tab with label "Hearings" in case details page, to see element with css selector "exui-case-hearings"
        Then I do not see Request a hearing button in hearings tab page


    Scenario Outline: hearing tab not displayed jurisdiction <jurisdiction>, case type <caseType> and roles not feature toggled on
        Given I set MOCK with user details
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,case-allocator,<role> |
            | roleCategory | LEGAL_OPERATIONS                                                                      |

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"

        Given I set MOCK case "hearingCase" details with reference "Hearing_case"
        Given I set MOCK case details "Hearing_case" property "jurisdiction.id" as "<jurisdiction>"
        Given I set MOCK case details "Hearing_case" property "case_type.id" as "<caseType>"

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        # Then debug sleep minutes 20
        Then I see case details tab label "Hearings" is displayed is "false"
        Examples:
            |role| jurisdiction | caseType |
            | hearing-manager | dummy | dummy |
            | hearing-viewer| PRIVATELAW | dummy |
            | hearing-manager | dummy | PRLAPPS |
            | dummy | PRIVATELAW | PRLAPPS |

