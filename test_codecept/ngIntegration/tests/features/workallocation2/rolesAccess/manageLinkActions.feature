@ng 
Feature: WA Release 2:  Roles and access - case role  manage links and actions

    Background: User and mock data setup
        Given I init MockApp
        Given I set MOCK with user details
            | roles        | caseworker-ia-officer,caseworker-ia,caseworker ,task-supervisor,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                                                               |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory     | roleName       |
            | IA           | N           | ORGANISATION | 20001        | LEGAL_OPERATIONS | case-allocator |
            | SSCS         | N           | ORGANISATION | 30001        | LEGAL_OPERATIONS | case-allocator |

        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" property "case_id" as "12345678"

        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory     | isCaseAllocator | caseId   | caseType | roleName     | beginTime | endTime | actorId      | grantType |
            | IA           | Y           | CASE     | 20001        | LEGAL_OPERATIONS | true            | 12345678 | Asylum   | case-manager | -2        | +1      | 123456781233 | STANDARD  |
            | IA           | Y           | CASE     | 30001        | JUDICIAL         | true            | 12345678 | Asylum   | lead-judge   | -2        | +1      | 123456781235 | STANDARD  |


        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory | isCaseAllocator | caseId   | caseType | roleName   | created | actorId      | grantType | notes            |
            | IA           | Y           | CASE     | 30001        | JUDICIAL     | true            | 12345678 | Asylum   | lead-judge | -2      | 123456781235 | EXCLUDED  | Test exclusion 1 |


        Given I start MockApp
        Given I navigate to home page
        # When I click on primary navigation header tab "Case list", I see selected tab page displayed
        # When I open first case in case list page
        When I navigate to url "http://localhost:3000/cases/case-details/12345678"
        Then I see case details page
        Then I see case details tab label "Roles and access" is displayed is "true"
        When I click tab with label "Roles and access" in case details page
        Then I see Roles and access page is displayed




    Scenario: Reallocate role
        Then I validate for role category "Judicial" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "LegalOps" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "Exclusions" case roles table displayed status is "true" in case roles and access page

        Then I validate case roles "Manage" link displayed status is "true" for category "Judicial"
        Then I validate case roles "Manage" link displayed status is "true" for category "Legal Ops"

        When I click manage link for role category "Judiciary" at row 1 in Roles and access page
        Then I validate actions row for role category "Judiciary" at row 1 is "displayed" in Roles and access page

        Then I validate actions row for role category "Judiciary" has action links in Roles and access page
            | ActionLinks |
            | Reallocate  |
            | Remove      |

        When I click action row link "Reallocate" for role category "Judiciary" in Roles and access page
        Then I see Allocate role work flow page "Find the person" with caption "Reallocate a lead judge" is displayed

        # Then debug sleep minutes 20
        When I enter find person search input "jud" in work flow
        Then I see find person search results in work flow
            | Person                       |
            | auto test 0 judge 0 (auto_test_judge_0@justice.gov.uk) |
        When I select find person result "auto test 0 judge 0 (auto_test_judge_0@justice.gov.uk)" in work flow
        When I click continue in work flow page "Find the person"

        Then I see Allocate role work flow page "Duration of role" with caption "Reallocate a lead judge" is displayed
        When I select duration option "Indefinite" in work flow
        Then I validate date input field "Access starts" is displayed "No" in work flow page
        Then I validate date input field "Access ends" is displayed "No" in work flow page
        When I click continue in work flow page "Duration of role"

        Then I see Allocate role work flow page "Check your changes" with caption "Reallocate a lead judge" is displayed

        Then I see Check your answers page has total 3 questions
        Then I see Check your answers page has questions and answers with change link
            | Question                          | Answer                       |
            | Who the role will be allocated to | Allocate to another person   |
            | Person | auto_test_judge_0@justice.gov.uk |
            | Duration of role                  | Indefinite                   |

        When I click button with label "Confirm allocation" in work flow  Check your answers page
        Then I see case details page displayed with tab "Roles and access" selected
        Then I see case details page with message banner "You've reallocated a role"


    Scenario: Remove role
       

        Then I validate for role category "Judicial" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "LegalOps" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "Exclusions" case roles table displayed status is "true" in case roles and access page

        Then I validate case roles "Manage" link displayed status is "true" for category "Judicial"
        Then I validate case roles "Manage" link displayed status is "true" for category "Legal Ops"

        When I click manage link for role category "Judiciary" at row 1 in Roles and access page
        Then I validate actions row for role category "Judiciary" at row 1 is "displayed" in Roles and access page

        Then I validate actions row for role category "Judiciary" has action links in Roles and access page
            | ActionLinks       |
            | Reallocate        |
            | Remove Allocation |

        When I click action row link "Remove Allocation" for role category "Judiciary" in Roles and access page

        Then I see Remove allocation page with caption "Remove allocation" is displayed
        Then I see Remove allocation page with hint text "This will remove the role allocation. You may need to unassign or reassign associated tasks too" is displayed

        Then I see Check your answers page has total 2 questions
        Then I see Check your answers page has questions and answers without change link
            | Question     | Answer                      |
            | Type of role | Lead judge                  |
            | Person       | user1 j (judge_user1@gov.uk) |

        When I click button with label "Remove allocation" in work flow  Check your answers page
        Then I see case details page displayed with tab "Roles and access" selected
        Then I see case details page with message banner "You've removed a role allocation. You may need to unassign or reassign associated tasks too."
