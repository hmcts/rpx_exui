@functional_enabled
Feature: Case file view

    Scenario: Display of case file view V1.1
        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_FILE_VIEW_V1.1_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "caseFileViewCase" details with reference "CaseFileView_case"
        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Case File View" is displayed is "true"
        # Then debug sleep minutes 5
        When I click tab with label "Case File View" in case details page, to see element with css selector "#case-file-view"
        Then In case file view tab, I see documents tree view
        Then In case file view tab, I see documents media view
        Then In case file view tab, I see documents tree view header with text "Documents (17)"


        Then In case file view tab, I see tree view displays folders
            | folderPath             |
            | Orders                 |
            | Orders.Approved orders |

        Then In case file view tab, I see tree view displays folder files count
            | folderPath             | count |
            | Orders                 | 6     |
            | Orders.Approved orders | 0     |

        Then In case file view tab, I see file upload stamp for files under folder "Orders"
            | file | uploadDate |
            | Blank_Order_Directions_C21.pdf | 20 Oct 2023 |

    Scenario: Display of case file view V1
        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_FILE_VIEW_V1.1_OFF"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "caseFileViewCase" details with reference "CaseFileView_case"
        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Case File View" is displayed is "true"
        # Then debug sleep minutes 5
        When I click tab with label "Case File View" in case details page, to see element with css selector "#case-file-view"
        Then In case file view tab, I see documents tree view
        Then In case file view tab, I see documents media view
        Then In case file view tab, I see documents tree view header with text "Documents (17)"

        # Then In case file view tab, I dont see file upload stamp for files under folder "Orders"
        #     | file                           |
        #     | Blank_Order_Directions_C21.pdf |

    Scenario: PDF Media file display
        Given I set MOCK with user details with user identifier "RESTRICTED_CASE_FILE_VIEW_V1.1_ON"
            | roles        | caseworker-privatelaw,caseworker-privatelaw-courtadmin,hearing-centre-admin,case-allocator, hearing-manager |
            | roleCategory | LEGAL_OPERATIONS                                                                                            |

        Given I set MOCK case "caseFileViewCase" details with reference "CaseFileView_case"
        Given I start MockApp
        Given I navigate to home page
        When I click on primary navigation header tab "Case list", I see selected tab page displayed

        When I open first case in case list page
        Then I see case details page
        Then I see case details tab label "Case File View" is displayed is "true"
        # Then debug sleep minutes 5
        When I click tab with label "Case File View" in case details page, to see element with css selector "#case-file-view"
        Then In case file view tab, I see documents tree view
        Then In case file view tab, I see documents media view
        Then In case file view tab, I see documents tree view header with text "Documents (17)"

        When In case file view tab, I select file "Blank_Order_Directions_C21" under folder "Orders.Orders Submitted with Application", I see file in media viewer
        # Then In case file view tab, I see file "Blank_Order_Directions_C21" in media viewer

        When In case file view tab, I select file "Draft_C100_application" under folder "Orders.Orders Submitted with Application", I see file in media viewer
        # Then In case file view tab, I see file "Draft_C100_application" in media viewer
