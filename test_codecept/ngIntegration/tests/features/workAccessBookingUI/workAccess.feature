@ng  @functional_enabled 
Feature: Work access page

    Background: Setup bookings data

        Given I init MockApp
        


    Scenario Outline: page access to user with roles "<Roles>" is displayed "<isDisplayed>"
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | CIVIL,IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |

        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |

        Given I start MockApp
        When I navigate to home page
        Then I validate work access page isDisplayed is "<isDisplayed>"

        Examples:
            | UserIdentifier   | Roles                                                          | isDisplayed |
            | BOOKING_UI-FT-ON | caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge | true        |

    Scenario: Work access options, with bookable attribute as string
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | CIVIL,IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |
        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |
        Given I start MockApp
        When I navigate to home page

        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "View existing bookings"
        Then I see work access continue button not displayed

        When I select work access radio button "Create new booking"
        Then I see work access continue button displayed

        When I select work access radio button "View task and cases"
        Then I see work access continue button displayed


    Scenario: Work access options
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |
            | true | true | N | CIVIL | fee-paid-judge | JUDICIAL | Fee-Paid |

        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |
        Given I start MockApp
        When I navigate to home page

        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "View existing bookings"
        Then I see work access continue button not displayed

        When I select work access radio button "Create new booking"
        Then I see work access continue button displayed

        When I select work access radio button "View task and cases"
        Then I see work access continue button displayed


    Scenario: Work access View existing bookings with details
        # Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
        #  |roleCategory|
        #     |JUDICIAL|

        Given I set MOCK with user details
            | roles | caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge |
            | roleCategory | JUDICIAL |
     
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | IA           | fee-paid-judge | JUDICIAL     | Fee-Paid     |
            | true     | true            | N           | CIVIL        | fee-paid-judge | JUDICIAL     | Fee-Paid     |


        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +2      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |
        Given I start MockApp
        When I navigate to home page

        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "View existing bookings"
        Then I see work access continue button not displayed

        Then I see work access existing bookings list container
        Then I see work access existing bookings displayed with details
            | location        | fromDate | toDate |
            | Test location 1 | +1       | +1     |
            | Test location 2 | +2       | +3     |
            | Test location 3 | +4       | +7     |


    Scenario: Work access View existing booking and continue
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | CIVIL,IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |
        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |
        Given I start MockApp
        When I navigate to home page

        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "View existing bookings"
        Then I see work access continue button not displayed

        Then I see work access existing bookings list container
        # When I click continue for any existing booking in work access page


    Scenario: Work access Create new booking and continue
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | CIVIL,IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |
        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |

        Given I start MockApp
        When I navigate to home page


        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "Create new booking"
        Then I see work access continue button displayed
        When I click work access continue button



    Scenario: Work access View tasks and casesg and continue
        Given I set MOCK with user "BOOKING_UI-FT-ON" and userInfo with roles "caseworker-ia-iacjudge,caseworker-ia,caseworker,fee-paid-judge" with reference "userDetails"
         |roleCategory|
            |JUDICIAL|
        Given I set MOCK user with reference "userDetails" roleAssignmentInfo
            | bookable | isCaseAllocator | substantive | jurisdiction | roleName       | roleCategory | contractType |
            | true     | true            | N           | CIVIL,IA     | fee-paid-judge | JUDICIAL     | Fee-Paid     |
        Given I set mock locations for bookings
            | epimms_id | site_name       |
            | 100001    | Test location 1 |
            | 100002    | Test location 2 |
            | 100003    | Test location 3 |



        Given I set mock for existing bookings
            | appointmentId | locationId | locationName    | beginTime | endTime |
            | 1001          | 100001     | Test location 1 | +1        | +3      |
            | 1002          | 100002     | Test location 2 | +2        | +4      |
            | 1003          | 100003     | Test location 3 | +4        | +8      |
        Given I start MockApp
        When I navigate to home page

        Then I see work access page displayed
        Then I validate primary navigation items count 0
        Then I see work access radio button "View existing bookings" displayed
        Then I see work access radio button "Create new booking" displayed
        Then I see work access radio button "View tasks and cases" displayed
        Then I see work access continue button not displayed

        When I select work access radio button "View tasks and cases"
        Then I see work access continue button displayed
        When I click work access continue button

