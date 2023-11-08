@ng   @functional_enabled
Feature: WA Release 2: All work - filters (filters to be ignored EUI-4831)

    Background: Mock and browser setup
        Given I init MockApp


    Scenario Outline: Tasks filters services displayed based for role assignment on service(s) <roleAssignment_services>

        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "<roleAssignment_services>" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |



        Given I set MOCK tasks with permissions for view "All work" and assigned state ""
            | Permissions | Count |
            | Manage      | 140   |
            | Read        | 10    |


        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate tasks count in page 25
        Then I validate filter item "Service" select or radio has option "<Services>" in all work page
        Examples:
            | roleAssignment_services | Services            |
            |                         | IA,CIVIL,PRIVATELAW |
            | IA                      | IA                  |
            | IA,                     | IA,CIVIL,PRIVATELAW |
            | IA,CIVIL                | IA,CIVIL            |



    Scenario: Tasks filters state, with user role "Caseworker"
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "IA" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate tasks count in page 25
        Given I reset reference "taskSearchRequest" value to null


        Then I see filter "Service" is displayed in all work page
        Then I see filter "Service" is enabled in all work page
        Then I validate filter item "Service" select or radio options present in all work page
            | option |
            | IA     |


        Then I see filter "Location" is displayed in all work page
        Then I validate filter item "Location radios" select or radio options present in all work page
            | option                |
            | All                   |
            | Search for a location |


        Then I see filter "Tasks" is displayed in all work page

        Then I see filter "Tasks by role type" is displayed in all work page

        Then I see filter "Person input" is displayed in all work page

        Then I see filter "Task type" is displayed in all work page
        Then I see filter "Task type" is enabled in all work page

        Then I see filter "Priority" is displayed in all work page
        Then I see filter "Priority" is enabled in all work page

    Scenario Outline: "Caseworker" Tasks filter, filetr role type <Person_Role_Type>
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "<Jurisdiction>" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate tasks count in page 25
        Given I reset reference "taskSearchRequest" value to null


        Then I see filter "Service" is displayed in all work page
        Then I see filter "Service" is enabled in all work page
        Then I validate filter item "Service" select or radio options present in all work page
            | option |
            | IA     |

        Then I see filter "Location" is displayed in all work page
        Then I validate filter item "Location radios" select or radio options present in all work page
            | option                |
            | All                   |
            | Search for a location |
        When I select filter item "Location radios" select or radio option "Search for a location" in all work page
        Then I see location search input is enabled in all work filters
        Then I enter location search "IA Court Center 1" in all work filter
        Then I see location search results in all work filter
            | location          |
            | IA Court Center 1 |
        Then I select location search result "IA Court Center 1" in all work filter
        Then I see location "IA Court Center 1" selected in all work filter

        When I select filter item "Tasks" select or radio option "<Task_Category>" in all work page
        When I select filter item "Tasks by role type" select or radio option "<Person_Role_Type>" in all work page

        When I enter find person search input "<Person_search>" in work flow

        Then I see find person search results in work flow
            | Person        |
            | <Person_name> |

        When I select find person result "<Person_name>" in work flow
        When I select filter item "Task type" select or radio option "<Task_type>" in all work page

        When I select filter item "Priority" select or radio option "<Priority>" in all work page

        When I click Apply filter button in all work page
        When I wait for reference "taskSearchRequest" value not null
        # Then I validate task search request with reference "taskSearchRequest" have search parameters
        #     | key          | value          |
        #     | location     | <locationId>   |
        #     | user         | <person_id>    |
        #     | jurisdiction | <Jurisdiction> |
        #     | taskType     | <Task_type>    |
        #     | priority     | <Priority>     |

        Given I reset reference "taskSearchRequest" value to null
        When I select filter item "Tasks" select or radio option "All" in all work page
        When I select filter item "Location radios" select or radio option "All" in all work page
        When I click Apply filter button in all work page
        When I wait for reference "taskSearchRequest" value not null
        # Then I validate task search request with reference "taskSearchRequest" does not have search patameter key "user"
        # Then I validate task search request with reference "taskSearchRequest" does not have search patameter key "location"
        Examples:
            | Jurisdiction | locationName | locationId | Task_Category        | Person_search | Person_name                                                              | person_id                            | Person_Role_Type | Task_type | Priority |
            # | IA           | Test loc 3   | 12347      | Assigned to a person | LEGAL         | LEGAL_OPERATIONS 1 IA_CIVIL (ia_civil_legal_operations_1@justice.gov.uk) | 08a3d216-c6ab-4e92-a7e3-ca3661e6be89 | Legal Ops        | Legal Ops | High     |
            | IA | Test loc 3 | 12347 | Assigned to a person | judge | auto test 0 judge 0 (auto_test_judge_0@justice.gov.uk) | 1231 | Judicial | Legal Ops | High |
            # | IA           | Test loc 3   | 12347      | Assigned to a person | ADMIN           | ADMIN 1 IA_CIVIL (ia_civil_admin_1@justice.gov.uk)                                            | 08a3d216-c6ab-4e92-a7e3-ca3661e6be83 | Admin            | Admin     | High     |

    Scenario: "Judicial" Tasks filters state
        Given I set MOCK with user "IAC_Judge_WA_R2" and roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,task-supervisor,case-allocator,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate tasks count in page 25
        Given I reset reference "taskSearchRequest" value to null


        Then I see filter "Service" is displayed in all work page
        Then I see filter "Service" is enabled in all work page
        Then I validate filter item "Service" select or radio options present in all work page
            | option |
            | IA     |

        Then I see filter "Location" is displayed in all work page
        Then I validate filter item "Location radios" select or radio options present in all work page
            | option                |
            | All                   |
            | Search for a location |

        Then I see filter "Tasks" is displayed in all work page

        Then I see filter "Tasks by role type" is displayed in all work page


        Then I see filter "Person input" is displayed in all work page

        Then I see filter "Task type" is displayed in all work page
        Then I see filter "Task type" is enabled in all work page

        Then I see filter "Priority" is not displayed in all work page


    Scenario Outline: "Judicial" Tasks filter selection, with person role type <Person_Role_Type>
        Given I set MOCK with user "IAC_Judge_WA_R2" and roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,task-supervisor,case-allocator,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        Then I validate tasks count in page 25
        Given I reset reference "taskSearchRequest" value to null


        Then I see filter "Service" is displayed in all work page
        Then I see filter "Service" is enabled in all work page
        Then I validate filter item "Service" select or radio options present in all work page
            | option |
            | IA     |

        Then I see filter "Location" is displayed in all work page
        Then I validate filter item "Location radios" select or radio options present in all work page
            | option                |
            | All                   |
            | Search for a location |
        When I select filter item "Location radios" select or radio option "Search for a location" in all work page
        Then I see location search input is enabled in all work filters
        Then I enter location search "IA Court Center 1" in all work filter
        Then I see location search results in all work filter
            | location          |
            | IA Court Center 1 |
        Then I select location search result "IA Court Center 1" in all work filter
        Then I see location "IA Court Center 1" selected in all work filter


        When I select filter item "Tasks" select or radio option "<Task_Category>" in all work page
        When I select filter item "Tasks by role type" select or radio option "<Person_Role_Type>" in all work page

        When I enter find person search input "<Person_search>" in work flow

        Then I see find person search results in work flow
            | Person        |
            | <Person_name> |

        When I select find person result "<Person_name>" in work flow
        When I select filter item "Task type" select or radio option "<Task_type>" in all work page


        When I click Apply filter button in all work page
        When I wait for reference "taskSearchRequest" value not null
        # Then I validate task search request with reference "taskSearchRequest" have search parameters
        #     | key          | value          |
        #     | location     | <locationId>   |
        #     | user         | <person_id>    |
        #     | jurisdiction | <Jurisdiction> |
        #     | taskType     | <Task_type>    |


        Given I reset reference "taskSearchRequest" value to null
        When I select filter item "Tasks" select or radio option "All" in all work page
        When I select filter item "Location radios" select or radio option "All" in all work page
        When I click Apply filter button in all work page
        When I wait for reference "taskSearchRequest" value not null
        # Then I validate task search request with reference "taskSearchRequest" does not have search patameter key "user"
        # Then I validate task search request with reference "taskSearchRequest" does not have search patameter key "location"

        Examples:
            | Jurisdiction | locationName | locationId | Task_Category        | Person_search | Person_name                              | person_id                            | Person_Role_Type | Task_type |
#            | IA | Test loc 3 | 12347 | Assigned to a person | LEGAL | LEGAL_OPERATIONS 1 IA_CIVIL (ia_civil_legal_operations_1@justice.gov.uk)| 08a3d216-c6ab-4e92-a7e3-ca3661e6be89 | Legal Ops | Legal Ops |
            | IA | Test loc 3 | 12347 | Assigned to a person | judge | auto test 0 judge 0 (auto_test_judge_0@justice.gov.uk) | 1231 | Judicial | Legal Ops |
#            | IA | Test loc 3 | 12347 | Assigned to a person | ADMIN | ADMIN 1 IA_CIVIL (ia_civil_admin_1@justice.gov.uk) | 08a3d216-c6ab-4e92-a7e3-ca3661e6be83 | Admin | Admin |

@ignore
    Scenario: "Caseworker" Cases filters state
        Given I set MOCK with user "IAC_CaseOfficer_R2" and roles "task-supervisor,case-allocator,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator,task-supervisor,case-allocator" with reference "userDetails"
        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "" allow empty service
            | roleName    | task-supervisor |
            | substantive | Y               |
        Given I start MockApp

        Given I navigate to home page
        When I click on primary navigation header tab "All work", I see selected tab page displayed
        When I navigate to All work sub navigation tab "Cases"
        Then I see all work cases not loaded and message displayed as "Please select filters and click Apply"

        Then I see filter "Person" is displayed in all work page
        When I enter find person search input "test" in work flow

        Then I see find person search results in work flow
            | Person                                   |
            | test_first test_last (test_user@testing.net) |

        When I select find person result "test_first test_last (test_user@testing.net)" in work flow
        When I click Apply filter button in all work page
        Then I validate work allocation cases count in page 25

        Given I am perforing actions to validate "9 default filters"
        Given I reset reference "caseSearchRequest" value to null

        Then I see filter "Service" is displayed in all work page
        Then I see filter "Service" is enabled in all work page
        Then I validate filter item "Service" select or radio options present in all work page
            | option |
            | IA     |

        Then I see filter "Location" is displayed in all work page
        Then I validate filter item "Location radios" select or radio options present in all work page
            | option                |
            | All                   |
            | Search for a location |



        Then I see filter "Select a role type" is displayed in all work page

        Then I see filter "Person" is displayed in all work page

        Then I see filter "Select a role type" is enabled in all work page

        Then I see filter "Person input" is displayed in all work page
