@fullfunctional @wa2 @demo @ignored
Feature: WA Release 2: : Work allocations My work, All work

    Scenario Outline: View tasks, E2E journey of Caseworker-ia-officer user
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "<useridentifier>"
        Then I validate I am on My work page

        Then I see primary navigation tabs "<mainHeaders>" in main header

        Then I validate My work sub navigations displayed
            | Tab             |
            | My tasks        |
            | Available tasks |
        Then I see Task list table
        When I navigate to My work sub navigation tab "Available tasks"
        Then I see Task list table

        Examples:
            | useridentifier     | roles                                              | mainHeaders                               | rightColumnHeaders  |
            | IAC_CaseOfficer_R2 | caseworker-ia-caseofficer,caseworker-ia-admofficer | My work, All work ,Case list, Create case | Find case           |
            # | IAC_Judge_WA_R2    | caseworker-ia-iacjudge,caseworker-ia,caseworker    | My work, All work                         | Case list,Find case |

    Scenario: My work tabs

        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "IAC_CaseOfficer_R2"
        Then I validate I am on My work page

        # Then I validate My work - Tasks page


        Then I validate task list table columns displayed for user "Caseworker"
            | ColumnHeader  | Caseworker | Judge |
            | Case name     | Yes        | Yes   |
            | Case category | Yes        | Yes   |
            | Location      | Yes        | Yes   |
            | Task          | Yes        | Yes   |
            | Task created  | No         | Yes   |
            | Due date      | Yes        | No    |
            | Priority      | Yes        | No    |

        When I navigate to My work sub navigation tab "Available tasks"
        Then I validate task list table columns displayed for user "Caseworker"
            | ColumnHeader  | Caseworker | Judge |
            | Case name     | Yes        | Yes   |
            | Case category | Yes        | Yes   |
            | Location      | Yes        | Yes   |
            | Task          | Yes        | Yes   |
            | Task created  | No         | Yes   |
            | Due date      | Yes        | No    |
            | Priority      | Yes        | No    |


        When I navigate to My work sub navigation tab "My cases"
        Then I validate work allocation cases table columns displayed
            | ColumnHeader  |
            | Case name     |
            | Service  |
            | Case category |
            | Case role     |
            | Start         |
            | End           |
            | Hearing date |



    Scenario: All work tabs

        When I navigate to Expert UI Url
        Given I am logged into Expert UI with test user identified as "IAC_CaseOfficer_R2"
        Then I validate I am on My work page

        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate task list table columns displayed for user "Caseworker"
            | ColumnHeader  | Caseworker | Judge |
            | Case name     | Yes        | Yes   |
            | Case category | Yes        | Yes   |
            | Location      | Yes        | Yes   |
            | Person        | Yes        | Yes   |
            | Task          | Yes        | Yes   |
            | Task created  | No         | Yes   |
            | Due date      | Yes        | No    |
            | Priority      | Yes        | No    |

        # When I navigate to All work sub navigation tab "Cases"

        # Then I validate work allocation cases table columns displayed
        #     | ColumnHeader  |
        #     | Case name     |
        #     | Case category |
        #     | Location      |
        #     | Role          |
        #     | Person        |
            # | Hearing date |