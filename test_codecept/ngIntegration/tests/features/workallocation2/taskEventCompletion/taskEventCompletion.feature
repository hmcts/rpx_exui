
@functional_enabled
Feature: WA Release 2: Case events and Task completion and states when task_required is true

    Background: Setup
        Given I init MockApp


    Scenario Outline: No task available
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<roles>,task-supervisor,case-allocator" with reference "userDetails"


        # Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case list values
            | case_id          | case_fields.[CASE_REFERENCE] | case_fields_formatted.[CASE_REFERENCE] |
            | 1234567812345678 | 1234567812345678             | 1234567812345678                       |
            | 1234567812345679 | 1234567812345679             | 1234567812345679                       |

        Given I set MOCK case "defaultCase" details with reference "WA_Case"
        Given I set MOCK case details "WA_Case" property "jurisdiction" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type" as "Asylum"
        Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"


        Given I set MOCK case tasks with userDetails from reference "userDetails"
            | id                                   | task_title | assignee    | assigneeName | created_date | due_date | permissions                | major_priority | minor_priority | warnings | description                                                                                                                                                                                                                                                               |
            | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1     | thissession | Test user    | -10          | -1       | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                                                                 |
            | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2     | thissession | Test user    | -10          | 0        | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/case/case-details/${[case_id]}/${[id]}/testaction2) \n Click link to proceed to [next step 3](/case/testroute?caseId=${[case_id]}/${[id]}/testaction2) |



        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | isCaseAllocator | jurisdiction | baseLocation |
            | true            | IA           | 12345        |

        Given I set MOCK task required for event as "true"


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page

        # Then debug sleep minutes 10

        Then I see case details tab label "Tasks" is displayed is "true"
        When I click tab with label "Tasks" in case details page

        Then I validate case details task tab page is displayed

        When I start case next step "Test event"
#        Then debug sleep minutes 10

        Then I see task event validation error page
            | Summary header  | There is a problem                                                            |
            | Summary message | No task available                                                             |
            | Details header  | No task available                                                             |
            | Details message | You should have an assigned task for this event, but something has gone wrong |
            | Link            | Return to tasks tab                                                           |
        Examples:
            | roles                                                                            |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor |


    Scenario Outline: Task not assigned

        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<roles>,task-supervisor,case-allocator" with reference "userDetails"


        Given I set MOCK case "defaultCase" details with reference "WA_Case"

        Given I set MOCK case details "WA_Case" property "jurisdiction" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type" as "Asylum"

        Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"
        Given I set MOCK case tasks with userDetails from reference "userDetails"
            | id                                   | task_title | assignee | assigneeName | created_date | due_date | permissions                | major_priority | minor_priority | warnings | description                                                                                                                                                                                                                                                               |
            | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1     |          | Test user    | -10          | -1       | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                                                                 |
            | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2     |          | Test user    | -10          | 0        | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/case/case-details/${[case_id]}/${[id]}/testaction2) \n Click link to proceed to [next step 3](/case/testroute?caseId=${[case_id]}/${[id]}/testaction2) |

        # Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case list values
            | case_id          | case_fields.[CASE_REFERENCE] | case_fields_formatted.[CASE_REFERENCE] |
            | 1234567812345678 | 1234567812345678             | 1234567812345678                       |
            | 1234567812345679 | 1234567812345679             | 1234567812345679                       |


        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | isCaseAllocator | jurisdiction | baseLocation |
            | true            | IA           | 12345        |


        Given I set MOCK task required for event as "true"
        Given I set MOCK tasks required for event
            | assignee | task_state |
            | null     | unassigned |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Tasks" is displayed is "true"
        When I click tab with label "Tasks" in case details page

        Then I validate case details task tab page is displayed

        When I start case next step "Test event"
        Then I see task event validation error page
            | Summary header  | There is a problem                         |
            | Summary message | Task assignment required                   |
            | Details header  | Task assignment required                   |
            | Details message | You must assign it to yourself to continue |
            | Link            | Return to tasks tab                        |
        Examples:
            | roles                                                                            |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor |


    Scenario Outline: Task multiple tasks found unassigned
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<roles>,task-supervisor,case-allocator" with reference "userDetails"

        Given I set MOCK case "defaultCase" details with reference "WA_Case"


        Given I set MOCK case tasks with userDetails from reference "userDetails"
            | id                                   | task_title | assignee | assigneeName | created_date | due_date | permissions                | major_priority | minor_priority | warnings | description                                                                                                                                                                                                                                                               |
            | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1     | 12345    | Test user    | -10          | -1       | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                                                                 |
            | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2     | 67890    | Test user    | -10          | 0        | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/case/case-details/${[case_id]}/${[id]}/testaction2) \n Click link to proceed to [next step 3](/case/testroute?caseId=${[case_id]}/${[id]}/testaction2) |

        # Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case list values
            | case_id          | case_fields.[CASE_REFERENCE] | case_fields_formatted.[CASE_REFERENCE] |
            | 1234567812345678 | 1234567812345678             | 1234567812345678                       |
            | 1234567812345679 | 1234567812345679             | 1234567812345679                       |
        Given I set MOCK case details "WA_Case" property "jurisdiction" as "IA"
        Given I set MOCK case details "WA_Case" property "case_type" as "Asylum"
        Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"


        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | isCaseAllocator | jurisdiction | baseLocation |
            | true            | IA           | 12345        |


        Given I set MOCK task required for event as "true"
        Given I set MOCK tasks required for event
            | assignee | task_state |
            | null     | unassigned |
            | null     | unassigned |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Tasks" is displayed is "true"
        When I click tab with label "Tasks" in case details page

        Then I validate case details task tab page is displayed

        When I start case next step "Test event"
        Then I see task event validation error page
            | Summary header  | There is a problem                         |
            | Summary message | Task assignment required                   |
            | Details header  | Task assignment required                   |
            | Details message | You must assign it to yourself to continue |
            | Link            | Return to tasks tab                        |
        Examples:
            | roles                                                                            |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor |



    # Scenario Outline: Task multiple tasks found assigned to this user
    #     Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "<roles>,task-supervisor,case-allocator" with reference "userDetails"


    #     Given I set MOCK case "defaultCase" details with reference "WA_Case"


    #     Given I set MOCK case tasks with userDetails from reference "userDetails"
    #         | id                                   | task_title | assignee    | assigneeName | created_date | due_date | permissions                | major_priority | minor_priority | warnings | description                                                                                                                                                                                                                                                               |
    #         | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1     | thissession | Test user    | -10          | -1       | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                                                                 |
    #         | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2     | thissession | Test user    | -10          | 0        | UnAssign,Assign,Own,Cancel | 2000           |                | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/case/case-details/${[case_id]}/${[id]}/testaction2) \n Click link to proceed to [next step 3](/case/testroute?caseId=${[case_id]}/${[id]}/testaction2) |

    #     # Given I set MOCK case details with reference "caseDetails"
    #     Given I set MOCK case list values
    #         | case_id          | case_fields.[CASE_REFERENCE] | case_fields_formatted.[CASE_REFERENCE] |
    #         | 1234567812345678 | 1234567812345678             | 1234567812345678                       |
    #         | 1234567812345679 | 1234567812345679             | 1234567812345679                       |
    #     Given I set MOCK case details "WA_Case" property "jurisdiction" as "IA"
    #     Given I set MOCK case details "WA_Case" property "case_type" as "Asylum"
    #     Given I set MOCK case details "WA_Case" trigger id "text" trigger name "Test event"

    #     Given I set MOCK user with reference "userDetails" roleAssignmentInfo
    #         | isCaseAllocator | jurisdiction | baseLocation |
    #         | true            | IA           | 12345        |


    #     Given I set MOCK task required for event as "true"
    #     Given I set MOCK tasks required for event
    #         | assignee                             | task_state |
    #         | 41a90c39-d756-4eba-8e85-5b5bf56b31f5 | assigned   |
    #         | 41a90c39-d756-4eba-8e85-5b5bf56b31f5 | assigned   |


    #     Given I start MockApp
    #     Given I navigate to home page
    #     When I click on primary navigation header tab "Case list", I see selected tab page displayed

    #     When I open first case in case list page
    #     Then I see case details page
    #     Then I see case details tab label "Tasks" is displayed is "true"
    #     When I click tab with label "Tasks" in case details page

    #     Then I validate case details task tab page is displayed

    #     When I start case next step "Test event"
    #     Then I see task event validation error page
    #         | Summary header  | There is a problem                                                                         |
    #         | Summary message | Multiple tasks exist                                                                       |
    #         | Details header  | Multiple tasks exist                                                                       |
    #         | Details message | You're starting work which could complete more than one of the active tasks for this case. |
    #     Examples:
    #         | roles                                                                            |
    #         | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor |

