
@ng @tabs_testing @functional_enabled 
Feature: WA Release 2: Case details Tasks tab

    Requirements from
    https://tools.hmcts.net/confluence/pages/viewpage.action?pageId=1466503344#WorkAllocationRelease2and2.1-ManagelinklogicforTasksandCases



    Scenario Outline: Task tab content displayed
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<roles>,task-supervisor,case-allocator" with reference "userDetails"

        # Given I set MOCK person with user "IAC_CaseOfficer_R2" and roles "<Roles>,task-supervisor,case-allocator"


        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | isCaseAllocator | jurisdiction | baseLocation |
            | true            | IA           | 12345        |
        Given I set MOCK request "/workallocation/case/task/:caseid" response log to report

        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case list values
            | case_id                              | case_fields.[CASE_REFERENCE]         | case_fields_formatted.[CASE_REFERENCE] |
            | 18a3d216-case-4e92-a7e3-ca3661e6be80 | 18a3d216-case-4e92-a7e3-ca3661e6be80 | 18a3d216-case-4e92-a7e3-ca3661e6be80   |
            | 18a3d216-case-4e92-a7e3-ca3661e6be81 | 18a3d216-case-4e92-a7e3-ca3661e6be81 | 18a3d216-case-4e92-a7e3-ca3661e6be81   |

        # Given I set MOCK judicial users end point "/api/role-access/roles/getJudicialUsers" for WA release 2
        #     | sidamId                              | full_name        |
        #     | 08a3d216-c6ab-4e92-a7e3-ca3661e6be86 | Test 5  judge    |
        #     | 08a3d216-c6ab-4e92-a7e3-ca3661e6be85 | Test 6  judge    |
        #     | 18a3d216-c6ab-4e92-a7e3-ca3661e6be83 | user 1  jud      |
        #     | 18a3d216-c6ab-4e92-a7e3-ca3661e6be82 | user 2  jud      |
        #     | 18a3d216-c6ab-4e92-a7e3-ca3661e6be83 | user 3       jud |
        #     | 18a3d216-c6ab-4e92-a7e3-ca3661e6be82 | user 4       jud |

        Given I set MOCK case tasks with userDetails from reference "userDetails"
            | id                                   | task_title                                | assignee                             | assigneeName | created_date | due_date | permissions                | major_priority | minor_priority| warnings | description                                                                                                                                                                                                                                                               |
            | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1                                    | thissession                          | Test user    | -10          | -1       | UnAssign,Assign,Own,Cancel | 2000           |               | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                                                                 |
            | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2                                    | thissession                          | Test user    | -10          | 0        | UnAssign,Assign,Own,Cancel | 2000           |               | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/case/case-details/${[case_id]}/${[id]}/testaction2) \n Click link to proceed to [next step 3](/case/testroute?caseId=${[case_id]}/${[id]}/testaction2) |
            |                                      | Task 3                                    | test_id                     | test_first test_last  | -10          | 1        | Complete                   | 4999           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | Task 4                                    |                                      |              | -10          | 10       |                            | 5000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | Task 5                                    |                                      |              | -10          | 10       |                            | 6000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 6 Permissions OME assined to me           | thissession                          | Test user    | -10          | 10       | UnAssign,Assign,Own,Cancel | 2000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 7 Permissions OME assigned to someother   | test_id                              |              | -10          | 10       | Complete                   | 2000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 8 Permissions OME unassigned              |                                      |              | -10          | 10       | Execute,UnAssignClaim      | 4999           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 9 Permissions ME assined to me            | thissession                          | Test user    | -10          | 10       | CompleteOwn                | 4999           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 10 Permissions ME assigned to someother   | test_id                     | test_first test_last  | -10          | 10       | Complete,UnAssign,Assign   | 4999           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 11 Permissions ME unassigned              |                                      |              | -10          | 10       | Claim,Own                  | 2000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 12 Permissions M assigned to someother    | test_id                     | test_first test_last  | -10          | 10       | UnAssign,Assign            | 6000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 13 Permissions M unassigned               |                                      |              | -10          | -10      |                            | 5000           |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 14 Permissions none assigned to someother | test_id                     | test_first test_last  | -10          | 10       |                            | major_priority |               | true     |                                                                                                                                                                                                                                                                           |
            |                                      | 15 Permissions none unassigned            |                                      |              | -10          | 10       |                            | major_priority |               | true     |                                                                                                                                                                                                                                                                           |



        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Tasks" is displayed is "true"
        When I click tab with label "Tasks" in case details page

        Then I validate case details task tab page is displayed
        Then I validate task tab alert banner header is "Task alert"
        Then I validate task tab active tasks container displayed
        Then I validate task tab active tasks displayed count 15


                Then I validate task tab active task at position 1 with task name "Task 1" has attributes
                    | name         | isDisplayed              | contentType     | text                                                   | href                                     |
                    | Task created | <TaskcreatedIsDisplayed> |                 | -10                                                    |                                          |
                    | Priority     | <PriorityIsDisplayed>    |                 | urgent                                                   |                                          |
                    | Due date     | <DuedateIsDisplayed>     |                 | -1                                                     |                                          |
                    | Assigned to  | true                     |                 |                                                        |                                          |
                    | Manage       | true                     | link            | Reassign                                               |                                          |
                    | Manage       | true                     | link            | Unassign                                               |                                          |
                    | Next steps   | true                     |                 | Click link to proceed to next step test link next step |                                          |
                    | Next steps   | true                     | link            | test link next step                                    |                                          |
                    | Next steps   | true                     | linkURLContains | test link next step                                    | tid=08a3d216-task-4e92-a7e3-ca3661e6be87       |
                    | Next steps   | true                     | linkURLContains | test link next step                                    | tid=08a3d216-task-4e92-a7e3-ca3661e6be87 |


                Then I validate task tab active task at position 2 with task name "Task 2" has attributes
                    | name         | isDisplayed              | contentType     | text                              | href                                                                                |
                    | Task created | <TaskcreatedIsDisplayed> |                 | -10                               |                                                                                     |
            | Priority | <PriorityIsDisplayed> |  | urgent |  |
                    | Due date     | <DuedateIsDisplayed>     |                 | 0                                 |                                                                                     |
                    | Assigned to  | true                     |                 |                                   |                                                                                     |
                    | Manage       | true                     | link            | Reassign task                     |                                                                                     |
                    | Manage       | true                     | link            | Reassign                          |                                                                                     |
                    | Manage       | true                     | link            | Unassign                          |                                                                                     |
                    | Next steps   | true                     |                 | Click link to proceed next step 1 |                                                                                     |
                    | Next steps   | true                     | link            | next step 2                       |                                                                                     |
                    | Next steps   | true                     | linkURLContains | next step 1                       | tid=18a3d216-task-4e92-a7e3-ca3661e6be87                                                 |
                    | Next steps   | true                     | linkURLContains | next step 2                       | 18a3d216-task-4e92-a7e3-ca3661e6be87/testaction2 |


                Then I validate task tab active task at position 3 with task name "Task 3" has attributes
                    | name         | isDisplayed              | contentType | text         |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10          |
                    | Priority     | <PriorityIsDisplayed>    |             | high         |
                    | Due date     | <DuedateIsDisplayed>     |             | 1            |
                    | Assigned to  | true                     |             | test_first test_last |
                    | Manage       | true                     | link        | Mark as done |
                    | Next steps   | false                    |             |              |

                Then I validate task tab active task at position 4 with task name "Task 4" has attributes
                    | name         | isDisplayed              | contentType | text |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10  |
                    | Priority     | <PriorityIsDisplayed>    |             | high  |
                    | Due date     | <DuedateIsDisplayed>     |             | 10   |
                    | Assigned to  | true                     |             |      |
                    | Manage       | false                    |             |      |
                    | Next steps   | false                    |             |      |
                Then I validate task tab active task at position 5 with task name "Task 5" has attributes
                    | name         | isDisplayed              | contentType | text |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10  |
                    | Priority     | <PriorityIsDisplayed>    |             | low  |
                    | Due date     | <DuedateIsDisplayed>     |             | 10   |
                    | Assigned to  | true                     |             |      |
                    | Manage       | false                    |             |      |
                    | Next steps   | false                    |             |      |

                Then I validate task tab active task at position 6 with task name "6 Permissions OME assined to me" has attributes
                    | name         | isDisplayed              | contentType | text          |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10           |
            | Priority | <PriorityIsDisplayed> |  | urgent |
                    | Due date     | <DuedateIsDisplayed>     |             | 10            |
                    | Assigned to  | true                     |             |               |
                    | Manage       | true                     | link        | Reassign      |
                    | Manage       | true                     | link        | Unassign      |
                    | Next steps   | true                     |             |               |


                Then I validate task tab active task at position 7 with task name "7 Permissions OME assigned to someother" has attributes
                    | name         | isDisplayed              | contentType | text          |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10           |
            | Priority | <PriorityIsDisplayed> |  | urgent |
                    | Due date     | <DuedateIsDisplayed>     |             | 10            |
                    | Assigned to  | true                     |             | test_first test_last   |
                    | Manage       | true                     | link        | Mark as done  |
                    | Next steps   | false                    |             |               |

                Then I validate task tab active task at position 8 with task name "8 Permissions OME unassigned" has attributes
                    | name         | isDisplayed              | contentType | text         |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10          |
                    | Priority     | <PriorityIsDisplayed>    |             | high          |
                    | Due date     | <DuedateIsDisplayed>     |             | 10           |
                    | Assigned to  | true                     |             | Unassigned   |
                    | Manage       | true                     | link        | Assign to me |
                     | Next steps   | false                    |             |              |
                Then I validate task tab active task at position 9 with task name "9 Permissions ME assined to me" has attributes
                    | name         | isDisplayed              | contentType | text          |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10           |
                    | Priority     | <PriorityIsDisplayed>    |             | high          |
                    | Due date     | <DuedateIsDisplayed>     |             | 10            |
                    | Assigned to  | true                     |             |               |
                    | Manage       | true                     | link        | Mark as done  |
                    | Next steps   | true                     |             |               |

                Then I validate task tab active task at position 10 with task name "10 Permissions ME assigned to someother" has attributes
                    | name         | isDisplayed              | contentType | text          |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10           |
                    | Priority     | <PriorityIsDisplayed>    |             | high           |
                    | Due date     | <DuedateIsDisplayed>     |             | 10            |
                    | Assigned to  | true                     |             | test_first test_last   |
                    | Manage       | true                     | link        | Reassign task |
                    | Manage       | true                     | link        | Unassign task |
                    | Manage       | true                     | link        | Mark as done  |
                    | Next steps   | false                    |             |               |

                Then I validate task tab active task at position 11 with task name "11 Permissions ME unassigned" has attributes
                    | name         | isDisplayed              | contentType | text         |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10          |
                    | Priority     | <PriorityIsDisplayed>    |             | urgent       |
                    | Due date     | <DuedateIsDisplayed>     |             | 10           |
                    | Assigned to  | true                     |             | Unassigned   |
                    | Manage       | true                     | link        | Assign to me |
                    | Next steps   | false                    |             |              |

                Then I validate task tab active task at position 12 with task name "12 Permissions M assigned to someother" has attributes
                    | name         | isDisplayed              | contentType | text         |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10          |
                    | Priority     | <PriorityIsDisplayed>    |             | low         |
                    | Due date     | <DuedateIsDisplayed>     |             | 10           |
                    | Assigned to  | true                     |             | test_first test_last |
                    | Manage       | true                     | link        | Reassign     |
                    | Manage       | true                     | link        | Unassign     |
                    | Next steps   | false                    |             |              |

                Then I validate task tab active task at position 13 with task name "13 Permissions M unassigned" has attributes
                    | name         | isDisplayed              | contentType | text       |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10        |
                    | Priority     | <PriorityIsDisplayed>    |             | high       |
                    | Due date     | <DuedateIsDisplayed>     |             | -10        |
                    | Assigned to  | true                     |             | Unassigned |
                    | Manage       | false                     |             |            |
                    | Next steps   | false                    |             |            |

                Then I validate task tab active task at position 14 with task name "14 Permissions none assigned to someother" has attributes
                    | name         | isDisplayed              | contentType | text         |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10          |
            | Priority | <PriorityIsDisplayed> |  | urgent |
                    | Due date     | <DuedateIsDisplayed>     |             | 10           |
                    | Assigned to  | true                     |             | test_first test_last |
                    | Manage       | false                    |             |              |
                    | Next steps   | false                    |             |              |

                Then I validate task tab active task at position 15 with task name "15 Permissions none unassigned" has attributes
                    | name         | isDisplayed              | contentType | text       |
                    | Task created | <TaskcreatedIsDisplayed> |             | -10        |
            | Priority | <PriorityIsDisplayed> |  | urgent |
                    | Due date     | <DuedateIsDisplayed>     |             | 10         |
                    | Assigned to  | true                     |             | Unassigned |
                    | Manage       | false                    |             |            |
                    | Next steps   | false                    |             |            |
        Examples:
            | roles                                                                            | PriorityIsDisplayed | DuedateIsDisplayed | TaskcreatedIsDisplayed |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor | true                | true               | false                  |
#            | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor   | false               | false              | true                   |

