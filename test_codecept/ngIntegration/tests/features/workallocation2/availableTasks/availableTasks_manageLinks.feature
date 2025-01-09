@ng @functional_enabled
Feature: WA Release 2: My work - Available tasks - Manage links

    Background: Mock and browser setup
        Given I init MockApp


    Scenario Outline:  Available Tasks, colums and column links for "<UserType>"
        Given I set MOCK with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |

        Given I set MOCK tasks with permissions for view "Available tasks" and assigned state ""
            | Permissions | Count |
            | Manage      | 100   |
            | Read        | 40    |
        Given I set MOCK tasks with attributes for view "Available tasks"
            | index | permissions     | assignee            | case_name |
            | 0     | Manage,Read,Own,claim |                     | case 1    |
            | 1     | Manage,Own,claim      |                     | case 2    |
            | 2     | Read            |                     | case 3    |
            | 3     | Manage,Read,Own,claim | 1234-1234-1234-1234 | case 4    |
            | 4     | Manage,Own,claim      | 1234-1234-1234-1234 | case 5    |
            | 5     | Read            | 1234-1234-1234-1234 | case 6    |


        Given I start MockApp
        Given I navigate to home page

        When I click on primary navigation header tab "My work", I see selected tab page displayed
        When I navigate to My work sub navigation tab "Available tasks"
        Then I validate tasks count in page 25

        Then I validate manage link actions for tasks
            | index | actions                                  |
            | 1     | Assign to me,Assign to me and go to task |
            | 2     | Assign to me,Assign to me and go to task |
            | 4     | Assign to me,Assign to me and go to task |
            | 5     | Assign to me,Assign to me and go to task |

        Examples:
            | UserIdentifier  | UserType | Roles                                           |
            # | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |
            | IAC_Judge_WA_R2 | Judge    | caseworker-ia-iacjudge,caseworker-ia,caseworker,judge |


    Scenario Outline:  Task Manage links for "<UserType>"  action "<actionLink>"
        Given I set MOCK with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |

        Given I set MOCK person with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator"
            | locationId | locationName           |
            | 20001      | IA Court Aldgate Tower |
        Given I start MockApp
        Given I navigate to home page

        When I navigate to My work sub navigation tab "Available tasks"
        Then I validate tasks count in page 25

        Given I capture task details at row <taskAtRow> with reference "taskDetails"

        When I open Manage link for task at row <taskAtRow>
        Then I see action link "<actionLink>" is present for task with Manage link open
        When I click action link "<actionLink>" on task with Manage link open


        Then I validate notification banner messages displayed in "<landingPage>" page
            | message          |
            | <bannermessage1> |
            | <bannermessage2> |

        Examples:
            | UserIdentifier     | UserType   | Roles                                              | taskAtRow | actionLink                  | landingPage  | bannermessage1                                               | bannermessage2               |
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer | 4         | Assign to me                | My work      | You've assigned yourself a task. It's available in My tasks. | The list has been refreshed. |
            # | IAC_Judge_WA_R2    | Judge      | caseworker-ia-iacjudge,caseworker-ia,caseworker    | 1         | Assign to me and go to case | Case details | You've assigned yourself a task. It's available in My tasks. |                              |


