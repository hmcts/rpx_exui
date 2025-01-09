@ng @known_bug @EUI-4804 @functional_enabled 
Feature: WA Release 2: My work of My Tasks of pagination sorting (EUI-4804)


    Scenario Outline: My Tasks pagnation and sorting for user type "<UserType>" with roles "<Roles>"

        Given I set MOCK with user details
            | roles        | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory>                         |
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |
        Given I set MOCK person with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |

        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 100   |
            | Read        | 40    |
        # Given I set MOCK request "/workallocation/task/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page

        Then I validate tasks count in page 25
        Then I validate task table pagination controls, is displayed state is "true"
        Then I validate task list page results text displayed as "Showing 1 to 25 of 140 results"
        Given I reset reference "taskSearchRequest" value to null
        When I click task list pagination link "Next" and wait for req reference "taskSearchRequest" not null
        # Then I validate task search request with reference "taskSearchRequest" has pagination parameters
        #     | PageNumber | PageSize |
        #     | 2          | 25       |
        Then I validate task list page results text displayed as "Showing 26 to 50 of 140 results"
        Given I reset reference "taskSearchRequest" value to null
        When I click task list pagination link "Previous" and wait for req reference "taskSearchRequest" not null
        # Then I validate task search request with reference "taskSearchRequest" has pagination parameters
        #     | PageNumber | PageSize |
        #     | 1          | 25       |
        Then I validate task list page results text displayed as "Showing 1 to 25 of 140 results"
        Given I reset reference "taskSearchRequest" value to null
        When I click task list pagination link "3" and wait for req reference "taskSearchRequest" not null
        # Then I validate task search request with reference "taskSearchRequest" has pagination parameters
        #     | PageNumber | PageSize |
        #     | 3          | 25       |
        Then I validate task list page results text displayed as "Showing 51 to 75 of 140 results"

        When I click work allocation table "tasks" column header "Case name"


        Then I see work allocation table "tasks" column "Case name" is sorted in "asc"
        Then I see work allocation table "tasks" reset sort button state isDisplayed is "true"
        When I click work allocation table "tasks" reset sort button
        Then I see work allocation table "tasks" reset sort button state isDisplayed is "false"
        Then I see work allocation table "tasks" column "Case name" is sorted in "none"
        # Then I see work allocation table "tasks" default column sorted by "asc" for user type "<UserType>"
        #     | Caseworker | Priority |
        #     | Judge      | Task created |

        Examples:
            | UserIdentifier     | UserType   | Roles                                              |roleCategory|
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |LEGAL_OPERATIONS|
            | IAC_Judge_WA_R2    | Judge      | caseworker-ia-iacjudge,caseworker-ia,caseworker,judge    |JUDICIAL|

    Scenario Outline: My Tasks pagnation control display with only 1 page of items

        Given I set MOCK with user details
            | roles        | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory>                         |
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |
        Given I set MOCK person with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |
        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 10    |
            | Read        | 10    |
        Given I set MOCK request "/workallocation/task/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page
        Then I validate tasks count in page 20
        Then I validate task table pagination controls, is displayed state is "false"

        Examples:
            | UserIdentifier     | UserType   | Roles                                              |roleCategory|
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |LEGAL_OPERATIONS|
            | IAC_Judge_WA_R2    | Judge      | caseworker-ia-iacjudge,caseworker-ia,caseworker,judge    |JUDICIAL|



    Scenario Outline: My Tasks pagnation control display 0 items

        Given I set MOCK with user details
            | roles        | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory>                         |
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |
        Given I set MOCK person with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |
        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 0     |
            | Read        | 0     |
        Given I set MOCK request "/workallocation/task/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page
        Then I validate tasks count in page 0
        Then I validate task table pagination controls, is displayed state is "false"
        Then I validate WA tasks table footer displayed status is "true"
        Then I validate WA tasks table footer message is "You have no assigned tasks"

        Examples:
            | UserIdentifier  | UserType | Roles                                           |roleCategory|
            # | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |LEGAL_OPERATIONS|
            | IAC_Judge_WA_R2 | Judge    | caseworker-ia-iacjudge,caseworker-ia,caseworker,judge |JUDICIAL|
