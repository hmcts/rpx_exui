@ng @known_bug @EUI-4837 
Feature: WA Release 2: Roles and access tab (EUI-4837)
    https://tools.hmcts.net/jira/browse/EUI-3782 ???
    known bug EUI-4837


    Background: Case details setup
        Given I init MockApp


    Scenario: Case with roles - 0 judicial, 0 LegalOps, 0 Exclusions
        Given I set MOCK with user details
            | roles        | caseworker-ia-officer,caseworker-ia,caseworker ,task-supervisor,case-allocator |
            | roleCategory | LEGAL_OPERATIONS                                                                |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory     | roleName |
            | IA           | N           | ORGANISATION | 20001        | LEGAL_OPERATIONS | case-allocator            |
            | SSCS | N | ORGANISATION | 30001 | LEGAL_OPERATIONS | case-allocator |

        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" property "case_id" as "12345678"


        Given I start MockApp
        Given I navigate to home page
        # When I click on primary navigation header tab "Case list", I see selected tab page displayed
        # When I open first case in case list page
        When I navigate to url "http://localhost:3000/cases/case-details/12345678"
        Then I see case details page
        Then I see case details tab label "Roles and access" is displayed is "true"
        When I click tab with label "Roles and access" in case details page
        Then I see Roles and access page is displayed

        # Then debug sleep minutes 20

        Then I validate add link for role category "Judicial" is displayed in Roles and access page
        Then I validate add link for role category "Legal Ops" is displayed in Roles and access page

        Then I validate for role category "Judicial" case roles table displayed status is "false" in case roles and access page
        Then I validate for role category "LegalOps" case roles table displayed status is "false" in case roles and access page
        Then I validate for role category "Exclusions" case roles table displayed status is "false" in case roles and access page


        Then I validate for role category "Judicial" case roles no data message displayed status is "true" in case roles and access page
        Then I validate for role category "Legal Ops" case roles no data message displayed status is "true" in case roles and access page
        Then I validate for role category "Exclusions" case roles no data message displayed status is "true" in case roles and access page


        Then I validate for role category "Judicial" in case roles and access message displayed as "There are no judicial roles for this case."
        Then I validate for role category "Legal Ops" in case roles and access message displayed as "There are no legal Ops roles for this case."
        Then I validate for role category "Exclusions" in case roles and access message displayed as "There are no exclusions for this case."


    Scenario: Case with roles - 1 judicial, 1 LegalOps, 1 Exclusion

        Given I set MOCK with user "IAC_Judge_WA_R2" and roles "caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory     | roleName       |
            | IA           | N           | ORGANISATION | 20001        | LEGAL_OPERATIONS | case-allocator |
            | SSCS         | N           | ORGANISATION | 30001        | LEGAL_OPERATIONS | case-allocator |

        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory     | isCaseAllocator | caseId   | caseType | roleName     | beginTime | endTime | actorId      |
            | IA           | Y           | CASE     | 20001        | LEGAL_OPERATIONS | true            | 12345678 | Asylum   | case-manager | -2        | +1      | 123456781233 |
            | IA           | Y           | CASE     | 30001        | JUDICIAL | true            | 12345678 | Asylum   | case-manager | -2        | +1      | 123456781231 |

        Given I start MockApp
        Given I navigate to home page
        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" property "case_id" as "12345678"
        When I navigate to url "http://localhost:3000/cases/case-details/12345678"

        Then I see case details page
        Then I see case details tab label "Roles and access" is displayed is "true"
        When I click tab with label "Roles and access" in case details page
        Then I see Roles and access page is displayed

        Then I validate add link for role category "Judicial" is displayed in Roles and access page
        Then I validate add link for role category "Legal Ops" is not displayed in Roles and access page
        Then I validate add link for role category "Exclusion" is displayed in Roles and access page


        Then I validate for role category "Judicial" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "LegalOps" case roles table displayed status is "true" in case roles and access page
        Then I validate for role category "Exclusions" case roles table displayed status is "true" in case roles and access page

        Then I validate for role category "Judicial" case roles no data message displayed status is "false" in case roles and access page
        Then I validate for role category "Legal Ops" case roles no data message displayed status is "false" in case roles and access page
        Then I validate for role category "Exclusions" case roles no data message displayed status is "false" in case roles and access page






    Scenario: Case with roles - Validate columns and data displayed

        Given I set MOCK with user "IAC_Judge_WA_R2" and roles "caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory     | roleName       |
            | IA           | N           | ORGANISATION | 20001        | LEGAL_OPERATIONS | case-allocator |
            | SSCS         | N           | ORGANISATION | 30001        | LEGAL_OPERATIONS | case-allocator |

        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory     | isCaseAllocator | caseId   | caseType | roleName     | beginTime | endTime | actorId      |grantType|
            | IA           | Y           | CASE     | 20001        | LEGAL_OPERATIONS | true            | 12345678 | Asylum   | case-manager | -2        | +1      | 123456781233 |STANDARD|
            | IA | Y | CASE | 30001 | JUDICIAL | true | 12345678 | Asylum | lead-judge | -2 | +1 | 123456781235 |STANDARD|
           

        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory | isCaseAllocator | caseId | caseType | roleName | created | actorId | grantType |notes|
            | IA | Y | CASE | 30001 | JUDICIAL | true | 12345678 | Asylum | lead-judge | -2 | 123456781235 | EXCLUDED | Test exclusion 1 |

        Given I start MockApp
        Given I navigate to home page
        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" property "case_id" as "12345678"
        When I navigate to url "http://localhost:3000/cases/case-details/12345678"



        Then I see case details page
        Then I see case details tab label "Roles and access" is displayed is "true"
        When I click tab with label "Roles and access" in case details page
        Then I see Roles and access page is displayed

        Then I validate add link for role category "Judicial" is displayed in Roles and access page
        Then I validate add link for role category "Legal Ops" is not displayed in Roles and access page
        Then I validate add link for role category "exclusions" is displayed in Roles and access page


        
        Then I validate case roles table has headers for role category "Judicial" in case roles and access page
            | headerName |
            | Name       |
            | Role       |
            | Start      |
            | End        |
        

        Then I validate case roles table for role category "Judicial" has data
            | Name        | Role          | Start | End |
            | auto test 0 judge 0 | Lead Judge | -2 | +1 |

        Then I validate case roles table has headers for role category "Legal Ops" in case roles and access page
            | headerName |
            | Name       |
            | Role       |
            | Start      |
            | End        |

        Then I validate case roles table for role category "Legal Ops" has data
            | Name        | Role         | Start | End |
            | case-allocator 2_123456781234 IA_CIVIL | Case Manager | -2 | +1 |

        Then I validate case roles table has headers for role category "Exclusions" in case roles and access page
            | headerName |
            | Name       |
            | User type  |
            | Notes      |
            | Added      |


# Then debug sleep minutes 20
        Then I validate case roles table for role category "Exclusions" has data
            | Name                       | User type | Notes            | Added |
            | auto testjudge 0 judicial | JUDICIAL | Test exclusion 1 | -2 |
           


        Then I validate case roles "Manage" link displayed status is "true" for category "Judicial"
        Then I validate case roles "Manage" link displayed status is "true" for category "Legal Ops"
        Then I validate case roles "Delete" link displayed status is "true" for category "Exclusions"



    # Then I validate case roles table has headers for role category "Exclusions" in case roles and access page
    #     | headerName |
    #     | Name       |
    #     | Role       |
    #     | Location   |
    #     | Start      |
    #     | End        |


    Scenario: Case with roles - Validate non case allocator user - columns and data displayed

        Given I set MOCK with user "IAC_Judge_WA_R2" and roles "caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor,case-allocator" with reference "userDetails"
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | jurisdiction | substantive | roleType     | baseLocation | roleCategory     | roleName       |
            | IA           | N           | ORGANISATION | 20001        | LEGAL_OPERATIONS | task-supervisior |
            | SSCS | N | ORGANISATION | 30001 | LEGAL_OPERATIONS | task-supervisior |

        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory     | isCaseAllocator | caseId   | caseType | roleName     | beginTime | endTime | actorId      | grantType |
            | IA           | Y           | CASE     | 20001        | LEGAL_OPERATIONS | true            | 12345678 | Asylum   | case-manager | -2        | +1      | 123456781233 | STANDARD  |
            | IA           | Y           | CASE     | 30001        | JUDICIAL         | true            | 12345678 | Asylum   | lead-judge   | -2        | +1      | 123456781235 | STANDARD  |


        Given I set MOCK roleAssignments
            | jurisdiction | substantive | roleType | baseLocation | roleCategory | isCaseAllocator | caseId   | caseType | roleName   | created | actorId      | grantType | notes            |
            | IA           | Y           | CASE     | 30001        | JUDICIAL     | true            | 12345678 | Asylum   | lead-judge | -2      | 123456781235 | EXCLUDED  | Test exclusion 1 |

        Given I start MockApp
        Given I navigate to home page
        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" property "case_id" as "12345678"
        When I navigate to url "http://localhost:3000/cases/case-details/12345678"

        Then I see case details tab label "Roles and access" is displayed is "true"
        When I click tab with label "Roles and access" in case details page
        Then I see Roles and access page is displayed
        Then I validate case roles table has headers for role category "Judicial" in case roles and access page
            | headerName |
            | Name       |
            | Role       |
            | Start      |
            | End        |


        Then I validate case roles table for role category "Judicial" has data
            | Name                | Role       | Start | End |
            | auto test 0 judge 0 | Lead Judge | -2    | +1  |

        Then I validate case roles table has headers for role category "Legal Ops" in case roles and access page
            | headerName |
            | Name       |
            | Role       |
            | Start      |
            | End        |

        Then I validate case roles table for role category "Legal Ops" has data
            | Name                                   | Role         | Start | End |
            | case-allocator 2_123456781234 IA_CIVIL | Case Manager | -2    | +1  |

        Then I validate case roles table has headers for role category "Exclusions" in case roles and access page
            | headerName |
            | Name       |
            | User type  |
            | Notes      |
            | Added      |


        # Then debug sleep minutes 20
        Then I validate case roles table for role category "Exclusions" has data
            | Name                      | User type | Notes            | Added |
            | auto testjudge 0 judicial | JUDICIAL  | Test exclusion 1 | -2    |

        # Then debug sleep minutes 20
        Then I validate case roles "Manage" link displayed status is "false" for category "Judicial"
        Then I validate case roles "Manage" link displayed status is "false" for category "Legal Ops"
        Then I validate case roles "Delete" link displayed status is "false" for category "Exclusions"

# Then I validate case roles table has headers for role category "Exclusions" in case roles and access page
#     | headerName |
#     | Name       |
#     | Role       |
#     | Location   |
#     | Start      |
#     | End        |

