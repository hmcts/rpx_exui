@ng  @wa2 @wa 
Feature: WA Release 2: My cases

    Background: Mock and browser setup
        Given I init MockApp

    Scenario Outline:  My cases, colums and column links for "<UserType>"
        Given I set MOCK with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | caseType | substantive | roleType | caseId           |
            | IA           | Asylum   | Y           | CASE     | 1234567812345670 |
            | SSCS         | Asylum   | Y           | CASE     | 1234567812345671 |

        Given I start MockApp
        Given I navigate to home page
        When I navigate to My work sub navigation tab "My cases"

        Then I validate work allocation cases table columns displayed
            | ColumnHeader  |
            | Case name     |
            | Service       |
            | Case category |
            | Case role     |
            | Start         |
            | End           |
            # | Hearing date  |

        Then I validate work allocation table columns are links
            | ColumnHeader |
            | Case name    |

        # Then I validate work allocation case table column "Case name" width less than or equal to 200
        When I click work allocation case column link "Case name" at row 1
        Then I see case details page


        Examples:
            | UserIdentifier  | UserType | Roles                                           |
            # | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |
            | IAC_Judge_WA_R2 | Judge    | caseworker-ia-iacjudge,caseworker-ia,caseworker,judge |

    Scenario Outline: My cases pagnation control display with only 1 page of items
        Given I set MOCK with user "<UserIdentifier>" and roles "<Roles>,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation |
            | IA           | Y           | ORGANISATION | 20001        |
            | SSCS         | Y           | ORGANISATION | 20001        |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | caseType | substantive | roleType | caseId           |
            | IA           | Asylum   | Y           | CASE     | 1234567812345670 |
            | SSCS         | Asylum   | Y           | CASE     | 1234567812345671 |


        Given I set MOCK request "/workallocation/my-work/cases/" intercept with reference "taskSearchRequest"
        Given I start MockApp

        Given I navigate to home page
        When I navigate to My work sub navigation tab "My cases"

        Then I validate work allocation cases count in page 2
        Then I validate work allocation cases table pagination controls, is displayed state is "false"

        Examples:
            | UserIdentifier     | UserType   | Roles                                              |
            | IAC_CaseOfficer_R2 | Caseworker | caseworker-ia-caseofficer,caseworker-ia-admofficer |
# | IAC_Judge_WA_R2    | Judge      | caseworker-ia-iacjudge,caseworker-ia,caseworker    |


