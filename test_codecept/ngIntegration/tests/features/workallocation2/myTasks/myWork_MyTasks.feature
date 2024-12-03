@ng @functional_enabled
Feature: WA Release 2: My work - My Tasks

    Background: Mock and browser setup
        Given I init MockApp

    Scenario Outline:  My Tasks, colums and column links for "<UserType>"


        Given I set MOCK with user details
            | roles | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory> |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory |
            | IA | Y | ORGANISATION | 20001 | <roleCategory> |
            | SSCS | Y | ORGANISATION | 30001 | <roleCategory> |

        Given I set MOCK case "defaultCase" details with reference "WA_Case"
        Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"


        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 10    |
            | Read        | 10    |
        Given I set MOCK tasks with attributes for view "My tasks"
            | index | permissions                | assignee            | case_name | location_name   | task_title       | due_date | hearing_date | created_date | case_category        |
            | 0     | Manage,Read,Execute,Cancel | 1234-1234-1234-1231 | case 1    | test location 1 | test auto task 1 | -1       | 20           | -10          | auto test category 1 |
            | 1     | Manage                     | 1234-1234-1234-1231 | case 2    | test location 2 | test auto task 2 | 0        | 21           | -10          | auto test category 2 |
            | 2     | Read                       | 1234-1234-1234-1231 | case 3    | test location 3 | test auto task 3 | 1        | 22           | -10          | auto test category 3 |
            | 3     | Manage,Read                | 1234-1234-1234-1231 | case 4    | test location 4 | test auto task 4 | -10      | 24           | -20          | auto test category 4 |
            | 4     | Manage                     | 1234-1234-1234-1231 | case 5    | test location 5 | test auto task 5 | -20      | 26           | -30          | auto test category 5 |
            | 5     | Read                       | 1234-1234-1234-1231 | case 6    | test location 6 | test auto task 6 | -30      | 30           | -40          | auto test category 6 |


        Given I start MockApp
        Given I navigate to home page
        Then I validate task list table columns displayed for user "<UserType>"
            | ColumnHeader  | Caseworker | Judge |
            | Case name     | Yes        | Yes   |
            | Case category | Yes        | Yes   |
            | Location      | Yes        | Yes   |
            | Task          | Yes        | Yes   |
            | Task created  | No         | Yes   |
            | Due date      | Yes        | No    |
            | Priority      | Yes        | Yes    |

        Then If current user "<UserType>" is "Judge", I validate task table values displayed
            | row | Case name | Case category        | Location        | Task             | Task created |
            | 1   | case 1    | auto test category 1 | test location 1 | test auto task 1 | -10          |
            | 2   | case 2    | auto test category 2 | test location 2 | test auto task 2 | -10          |

        Then If current user "<UserType>" is "Caseworker", I validate task table values displayed
            | row | Case name | Case category        | Location        | Task             | Due date |
            | 1   | case 1    | auto test category 1 | test location 1 | test auto task 1 | -1       |
            | 2   | case 2    | auto test category 2 | test location 2 | test auto task 2 | 0        |
            | 3   | case 3    | auto test category 3 | test location 3 | test auto task 3 | 1        |

        # Then I validate work allocation task table column "Task" width less than or equal to 280
        # Then I validate work allocation task table column "Case name" width less than or equal to 200

        Then I see manage link displayed for task at position 1
        Then I see manage link displayed for task at position 2
        Then I see manage link displayed for task at position 4
        Then I see manage link displayed for task at position 5

        # Then I see manage link not displayed for task at position 3
        # Then I see manage link not displayed for task at position 6


        Then I validate task list columns are links
            | ColumnHeader |
            | Case name    |
            | Task         |

        When I click task column link "Case name" at row 1
        Then I see case details page

        When I click on primary navigation header tab "My work", I see selected tab page displayed
        When I click task column link "Task" at row 1, I see case details page
        Then I see case details page

        Then I validate case details task tab page is displayed
        Examples:
            | UserIdentifier     | UserType   | Roles                                                            | roleCategory     |
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer | LEGAL_OPERATIONS |
            | IAC_Judge_WA_R2    | Judge      | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker,judge    | JUDICIAL         |



    Scenario Outline: My Tasks sort column persist in session with Caseworker user "<SubNavigationTab>"

        Given I set MOCK with user details
            | roles        | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                         |

        Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer ,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 30001        |

        Given I set MOCK case "defaultCase" details with reference "WA_Case"
        Given I set MOCK case details "WA_Case" property "jurisdiction.id" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type.id" as "Asylum"

        Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"

        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 100   |
            | Read        | 40    |
        Given I set MOCK request "/workallocation/task/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page
        When I navigate to My work sub navigation tab "<SubNavigationTab>"
        Then I validate tasks count in page 25
        Then I validate task table pagination controls, is displayed state is "true"
        Then I validate task list page results text displayed as "Showing 1 to 25 of 140 results"

        When I click task list table header column "Case name", I validate task list table sorted with column "Case name" in order "asc"

        When I click on primary navigation header tab "Case list", I see selected tab page displayed
        Then I see case list page displayed
        When I click on primary navigation header tab "My work", I see selected tab page displayed
        When I navigate to My work sub navigation tab "<SubNavigationTab>"
        Then I validate tasks count in page 25
        Then I validate task list page results text displayed as "Showing 1 to 25 of 140 results"
        Then I validate task list table sorted with column "Case name" in order "asc"
        Examples:
            | SubNavigationTab |
            | My tasks         |


    Scenario Outline:  My Tasks, colums width "<UserType>"

        Given I set MOCK with user details
            | roles | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory> |

        Given I set MOCK person with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |  roleCategory  |
            | IA           | Y           | ORGANISATION | 20001        | <roleCategory> |
            | SSCS         | Y           | ORGANISATION | 30001        | <roleCategory> |
        Given I set MOCK tasks with permissions for view "My Tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 10    |
            | Read        | 10    |
        Given I set MOCK case workers for release "1"
            | email              | firstName | lastName | idamId              | location.id | location.locationName |
            | test_cw_1@test.com | cw1       | test     | 1234-1234-1234-1231 | 10001       | Location 1            |
            | test_cw_2@test.com | cw2       | test     | 1234-1234-1234-1232 | 10002       | Location 2            |
            | test_cw_3@test.com | cw3       | test     | 1234-1234-1234-1233 | 10003       | Location 3            |
            | test_cw_4@test.com | cw4       | test     | 1234-1234-1234-1234 | 10004       | Location 4            |
            | test_cw_5@test.com | cw5       | test     | 1234-1234-1234-1235 | 10005       | Location 5            |
        Given I set MOCK tasks with attributes for view "My tasks"
            | index | permissions                | assignee            | case_name                                                                                  | location_name   | task_title                                                                                                                                                       | due_date | created_date | case_category        |
            | 0     | Manage,Read,Execute,Cancel | 1234-1234-1234-1231 | case 1                                                                                     | test location 1 | test auto task 1                                                                                                                                                 | -1       | -10          | auto test category 1 |
            | 1     | Manage                     | 1234-1234-1234-1231 | case 2                                                                                     | test location 2 | test auto task 2                                                                                                                                                 | 0        | -10          | auto test category 2 |
            | 2     | Read                       | 1234-1234-1234-1231 | case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6 | test location 3 | test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6 | -30      | -40          | auto test category 3 |


        Given I start MockApp
        Given I navigate to home page
        Then I validate task list table columns displayed for user "<UserType>"
            | ColumnHeader  | Caseworker | Judge |
            | Case name     | Yes        | Yes   |
            | Case category | Yes        | Yes   |
            | Location      | Yes        | Yes   |
            | Task          | Yes        | Yes   |
            | Task created  | No         | Yes   |
            | Due date      | Yes        | No    |
            | Priority      | Yes        | Yes   |

        # Then I validate work allocation task table column "Task" width less than or equal to 280
        # Then I validate work allocation task table column "Case name" width less than or equal to 200



        Then If current user "<UserType>" is "Judge", I validate task table values displayed
            | row | Case name                                                                                  | Case category        | Location        | Task                                                                                                                                                             | Task created |
            | 1   | case 1                                                                                     | auto test category 1 | test location 1 | test auto task 1                                                                                                                                                 | -10          |
            | 2   | case 2                                                                                     | auto test category 2 | test location 2 | test auto task 2                                                                                                                                                 | -10          |
            | 3   | case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6 | auto test category 3 | test location 3 | test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6 | -40          |
        Then If current user "<UserType>" is "Caseworker", I validate task table values displayed
            | row | Case name                                                                                  | Case category        | Location        | Task                                                                                                                                                             | Due date |
            | 1   | case 1                                                                                     | auto test category 1 | test location 1 | test auto task 1                                                                                                                                                 | -1       |
            | 2   | case 2                                                                                     | auto test category 2 | test location 2 | test auto task 2                                                                                                                                                 | 0        |
            | 3   | case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6case 6 | auto test category 3 | test location 3 | test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6test auto task 6 | -30      |

        Examples:
            | UserIdentifier     | UserType   | Roles                                                            |roleCategory|
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer |LEGAL_OPERATIONS|
            | IAC_Judge_WA_R2    | Judge      | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker,judge    |JUDICIAL|

