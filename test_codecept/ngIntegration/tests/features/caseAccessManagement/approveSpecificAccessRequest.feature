
@ng 
Feature: Case access management: Approve specific access request

    Background:setup
        Given I init MockApp

        Given I set MOCK with user details
            | roles        | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor |
            | roleCategory | LEGAL_OPERATIONS                                                                 |

        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | id                                   | actorId                              | jurisdiction | caseType | caseId           | baseLocation | roleType | roleName                  | specificAccessReason |
            | 55968c04-dc8c-42b5-8e35-6687830a0d06 | 3db21928-cbbc-4364-bd91-137c7031fe17 | IA           | Asylum   | 1669646436529598 | 12345        | CASE     | specific-access-requested | Test access          |


        # Given I set role assignment query response
        #     | id                                   | actorId                              | jurisdiction | baseLocation | roleType | specificAccessReason |
        #     | 55968c04-dc8c-42b5-8e35-6687830a0d06 | 3db21928-cbbc-4364-bd91-137c7031fe17 | IA           | 12345        | CASE     | Test access          |


        Given I start MockApp


        Given I set MOCK case details with reference "caseDetails"
        Given I set MOCK case details "caseDetails" property "Jurisdiction" as "IA"
        Given I set MOCK case details "caseDetails" trigger id "text" trigger name "Test event"
        Given I set MOCK task details
            | id           | 3db21928-cbbc-task-bd91-137c7031fe17 |
            | assignee     | 3db21928-cbbc-4364-bd91-137c7031fe17 |
            | task_state   | assigned                             |
            | jurisdiction | IA                                   |
            | case_id      | 1234567812345678                     |
            | case_name    | SAR test case                        |

        Given I set MOCK case roles
            | created    | notes       |
            | 2022-10-10 | Test access |
            | 2022-10-10 | Test access |

        Given I set MOCK case list values
            | case_id          | case_fields.[CASE_REFERENCE] | case_fields_formatted.[CASE_REFERENCE] |
            | 1234567812345678 | 1234567812345678             | 1234567812345678                       |
            | 1234567812345679 | 1234567812345679             | 1234567812345679                       |

        Given I set MOCK case tasks with userDetails from reference "userDetails"
            | id                                   | task_title | assignee    | assigneeName | created_date | due_date | permissions                          | warnings | description                                                                                                                                                                                                                          |
            | 08a3d216-task-4e92-a7e3-ca3661e6be87 | Task 1     | thissession | Test user    | -10          | -1       | Own,Read,Refer,Manage,Execute,Cancel | true     | Click link to proceed to next step [test link next step](/case/case-details/${[case_id]})                                                                                                                                            |
            | 18a3d216-task-4e92-a7e3-ca3661e6be87 | Task 2     | thissession | Test 2 user  | -10          | 0        | Own,Manage,Execute                   | true     | Click link to proceed [next step 1](/case/case-details/${[case_id]}) or \n Click link to proceed to [next step 2](/role-access/ce225260-e7e7-11ec-b0a1-a221429cd2eb/assignment/55968c04-dc8c-42b5-8e35-6687830a0d06/specific-access) |

        Given I set Mock user with ref "userDetails", ORGANISATION roles for services "IA"
            | bookable     | false |
            | substantive  | Y     |
            | baseLocation | 20001 |

        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Tasks" is displayed is "true"
        When I click tab with label "Tasks" in case details page

        Then I validate case details task tab page is displayed
        Then I validate task tab active tasks container displayed


        When I click next step "next step 2" for task with name "Task 2"


    Scenario Outline: Approve specific access request - Approve request
        Then I am on SAR workflow page "Review specific access request"
        Then In SAR workflow page "Review specific access request", I validate fields displayed
            | field                                     |
            | Review specific access request            |
            | What do you want to do with this request? |
            | Approve request                           |
            | Reject request                            |
            | Request more information                  |


        Then In SAR workflow Review specific access page, I validate access request details
            | Case name              | José González       |
            | Case reference         | 1669-6464-3652-9598 |
            # | Date submitted         | 10 October 2022     |
            | Reason for case access | Test access         |

        When In SAR workflow flag workflow, I click continue


        Then In SAR workflow, I see error message banner with message "Select an option"


        Then In SAR workflow page "Review specific access request", I input values
            | field                                     | value           |
            | What do you want to do with this request? | Approve request |
        When In SAR workflow flag workflow, I click continue
        Then I am on SAR workflow page "How long do you want to give access to this case for?"

        Then In SAR workflow page "How long do you want to give access to this case for?", I input values
            | field                                                 | value  |
            | How long do you want to give access to this case for? | 7 days |

        When In SAR workflow flag workflow, I click submit
        Then In SAR workflow, I see access approved page

        Examples:

            | roles                                                                            | PriorityIsDisplayed | DuedateIsDisplayed | TaskcreatedIsDisplayed |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor | true                | true               | false                  |
# | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor   | false               | false              | true                   |
    
   
    Scenario Outline:  specific access request - Approve workflow Validations
        Then I am on SAR workflow page "Review specific access request"
        Then In SAR workflow page "Review specific access request", I validate fields displayed
            | field                                     |
            | Review specific access request            |
            | What do you want to do with this request? |
            | Approve request                           |
            | Reject request                            |
            | Request more information                  |


        Then In SAR workflow Review specific access page, I validate access request details
            | Case name              | José González       |
            | Case reference         | 1669-6464-3652-9598 |
            # | Date submitted         | 10 October 2022     |
            | Reason for case access | Test access         |

        When In SAR workflow flag workflow, I click continue


        Then In SAR workflow, I see error message banner with message "Select an option"


        Then In SAR workflow page "Review specific access request", I input values
            | field                                     | value           |
            | What do you want to do with this request? | Approve request |
        When In SAR workflow flag workflow, I click continue
        Then I am on SAR workflow page "How long do you want to give access to this case for?"

        Then In SAR workflow page "How long do you want to give access to this case for?", I input values
            | field                                                 | value  |
            | How long do you want to give access to this case for? | 7 days |

        Then In SAR workflow page "How long do you want to give access to this case for?", I validate fields displayed
        |field|
            | How long do you want to give access to this case for? |

            # Then I wait for seconds for 1800
        Then In SAR workflow page "How long do you want to give access to this case for?", I validate fields not displayed
            | field                                                 |
            | Access Starts |
            | Access Ends |

        Then In SAR workflow page "How long do you want to give access to this case for?", I input values
            | field                                                 | value  |
            | How long do you want to give access to this case for? | Indefinite |

        Then In SAR workflow page "How long do you want to give access to this case for?", I validate fields displayed
            | field                                                 |
            | How long do you want to give access to this case for? |

        # Then I wait for seconds for 1800
        Then In SAR workflow page "How long do you want to give access to this case for?", I validate fields not displayed
            | field         |
            | Access Starts |
            | Access Ends   |


        Then In SAR workflow page "How long do you want to give access to this case for?", I input values
            | field                                                 | value      |
            | How long do you want to give access to this case for? | Another period |

        Then In SAR workflow page "How long do you want to give access to this case for?", I validate fields displayed
            | field                                                 |
            | How long do you want to give access to this case for? |
            | Access Starts |
            | Access Ends   |

        # Then I wait for seconds for 1800
      
        Examples:

            | roles                                                                            | PriorityIsDisplayed | DuedateIsDisplayed | TaskcreatedIsDisplayed |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor | true                | true               | false                  |
# | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor   | false               | false              | true                   |


    Scenario Outline: Approve specific access request - Request more info
        Then I am on SAR workflow page "Review specific access request"
        Then In SAR workflow page "Review specific access request", I validate fields displayed
            | field                                     |
            | Review specific access request            |
            | What do you want to do with this request? |
            | Approve request                           |
            | Reject request                            |
            | Request more information                  |


        Then In SAR workflow Review specific access page, I validate access request details
            | Case name              | José González       |
            | Case reference         | 1669-6464-3652-9598 |
            # | Date submitted         | 10 October 2022     |
            | Reason for case access | Test access         |

        When In SAR workflow flag workflow, I click continue


        Then In SAR workflow, I see error message banner with message "Select an option"


        Then In SAR workflow page "Review specific access request", I input values
            | field                                     | value           |
            | What do you want to do with this request? | Request more information |
        When In SAR workflow flag workflow, I click continue
        Then I am on SAR workflow page "Request more information"

       

        Examples:

            | roles                                                                            | PriorityIsDisplayed | DuedateIsDisplayed | TaskcreatedIsDisplayed |
            | caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor | true                | true               | false                  |
# | caseworker-ia,caseworker-ia-iacjudge,caseworker-ia,caseworker ,task-supervisor   | false               | false              | true                   |
