@ng  @wa2 
Feature: WA Release 2: All work > Cases

    Background: Mock and browser setup
        Given I init MockApp

    Scenario Outline:  All cases, colums and column links for "<UserType>"
        
        Given I set MOCK with user details
            | roles | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory> |
        
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "IA" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | caseType | substantive | roleType | caseId           |roleCategory|
            | IA | Asylum | Y | CASE | 1234567812345670 | <roleCategory> |
            | SSCS | Asylum | Y | CASE | 1234567812345671 | <roleCategory> |


        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        When I navigate to All work sub navigation tab "Cases"
        Then I see all work cases not loaded and message displayed as "Please select filters and click Apply"

        Then I see filter "Person" is displayed in all work page
        When I enter find person search input "judge" in work flow

        Then I see find person search results in work flow
            | Person                       |
            | auto test 1 judge 1 (auto_test_judge_1@justice.gov.uk) |

        When I select find person result "auto test 1 judge 1 (auto_test_judge_1@justice.gov.uk)" in work flow

        When I click Apply filter button in all work page
        Then I validate work allocation cases table columns displayed
            | ColumnHeader  |
            | Case name     |
            | Case category |
            | Role          |
            | Location      |
            | Person        |
            | Hearing date |

        Then I validate work allocation table columns are links
            | ColumnHeader |
            | Case name    |

        When I click work allocation case column link "Case name" at row 1
        Then I see case details page
        Examples:
            | UserIdentifier  | UserType | Roles                                           |roleCategory|
            # | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |
            | IAC_Judge_WA_R2 | Judge    | caseworker-ia-iacjudge,caseworker-ia,caseworker |JUDICIAL|

    Scenario Outline: All cases pagnation control display with only 1 page of items
        Given I set MOCK with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator" with reference "userDetails"
        
        Given I set MOCK with user details
            | roles        | <Roles>,task-supervisor,case-allocator |
            | roleCategory | <roleCategory>                         |

        
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "IA" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |

        Given I set MOCK workallocation cases with permissions for view "AllWorkCases"
            | Roles           | Count |
            | case-allocator | 10    |
            | case-allocator | 10 |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | caseType | substantive | roleType | caseId           |
            | IA           | Asylum   | Y           | CASE     | 1234567812345670 |
            | SSCS         | Asylum   | Y           | CASE     | 1234567812345671 |


        Given I set MOCK request "/workallocation/my-work/cases/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        When I navigate to All work sub navigation tab "Cases"
        Then I see all work cases not loaded and message displayed as "Please select filters and click Apply"

        Then I see filter "Person" is displayed in all work page
        When I enter find person search input "judge" in work flow

        Then I see find person search results in work flow
            | Person                                                 |
            | auto test 1 judge 1 (auto_test_judge_1@justice.gov.uk) |

        When I select find person result "auto test 1 judge 1 (auto_test_judge_1@justice.gov.uk)" in work flow

        When I click Apply filter button in all work page

        Then I validate work allocation cases count in page 25
        Then I validate work allocation cases table pagination controls, is displayed state is "true"


        # Then I validate work allocation case table column "Case na me" width less than or equal to 200
        Examples:
            | UserIdentifier     | UserType   | Roles                                              |roleCategory|
            # | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |LEGAL_OPERATIONS|
| IAC_Judge_WA_R2    | Judge      | caseworker-ia-iacjudge,caseworker-ia,caseworker    |JUDICIAL|


