@fullfunctional @disabled
Feature: Case flags V2.1 Add/Update Language interpreter

    Background: Setup case
        When I navigate to Expert UI Url
        Given I am logged into Expert UI with case flags
        When I setup a case for case flags version "V2.1"
            | party                       | fieldName  | value      |
            | Flags for legal rep Party 1 | Role On Case  | Party 1    |
            | Flags for legal rep Party 1 | Party Name | Applicant  |
            | Flags for legal rep Party 2 | Role On Case  | Party 2    |
            | Flags for legal rep Party 2 | Party Name | Respondent |

      Then I see case details page

    Scenario: Create case flag
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field"

        When I start case next step "Create case flag", to see page with css seclector "ccd-case-edit-page"
        Then I am on create case flags page "Where should this flag be added?"
        Then In create case flag page "Where should this flag be added?", I validate fields displayed
            | field                            |
            | Where should this flag be added? |

        When In create case flag page "Where should this flag be added?", I input values
            | field                            | value     |
            | Where should this flag be added? | Applicant |

        When In create case flag workflow, I click Next
        Then I am on create case flags, select flag type page "Select flag type"
        Then In create case flag page "Select flag type", I validate fields displayed
            | field            |
            | Select flag type |

        When In create case flag page "Select flag type", I input values
            | field            | value                |
            | Select flag type | Language Interpreter |

        When In create case flag workflow, I click Next


        Then I am on create case flags page "Language Interpreter"
        Then In create case flag page "Language Interpreter", I validate fields displayed
            | field                |
            | Language Interpreter |

        When In create case flag page "Language Interpreter", I input values
            | field                | value       |
            | Enter the language manually | true|
            | Enter the language | Klingon |

        When In create case flag workflow, I click Next

        Then I am on create case flags page "Add comments for this flag"
        Then In create case flag page "Add comments for this flag", I validate fields displayed
            | field                      |
            | Add comments for this flag |

        When In create case flag page "Add comments for this flag", I input values
            | field                      | value             |
            | Add comments for this flag | Test auto comment |

        When In create case flag workflow, I click Next

        Then I am on create case flags page "Confirm the status of the flag"
        Then In create case flag page "Confirm the status of the flag", I validate fields displayed
            | field                          |
            | Confirm the status of the flag |
            | Describe reason for status     |

        When In create case flag page "Confirm the status of the flag", I input values
            | field                          | value       |
            | Confirm the status of the flag | Active      |
            | Describe reason for status     | test reason |

        When In create case flag workflow, I click Next


        Then In create case flag workflow, I am on Review details page
        Then In create case flag workflow, I validate Review details displayed
            | field       | value                          | isChangeLinkDisplayed |
            | Add flag to | Applicant                      | true                  |
            | Flag type   | Language Interpreter - Klingon | true                  |
            | Comments    | Test auto comment              | true                  |
            | Status      | Active                         | true                 |

        When In create case flag workflow, I click submit

        Then I see case details page and I see case flags banner with message "There is 1 active flag on this case"

        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field #read-case-flag-title"
        Then I validate case flags table for "Applicant" has 1 flags
        Then I validate case flags table for "Respondent" has 0 flags
        Then I validate case flags tab table data for "Applicant"
            | Party level flags              | Comments          | Creation date | Last modified | Flag status |
            | Language Interpreter | Test auto comment | today         |          | ACTIVE    |


        When I start case next step "Manage case flags", to see page with css seclector "ccd-manage-case-flags"
        Then I am on manage case flags page "Manage case flags"
        Then In create case flag page "Manage case flags", I validate fields displayed
            | field             |
            | Manage case flags |

        When In manage case flag page "Manage case flags", I input values
            | field            | value                                     |
            | Manage case flag | Applicant - Language Interpreter, Klingon |

        When In manage case flag workflow, I click Next

        Then I am on manage case update flag page "Update flag \"Language Interpreter, Klingon\""

        Then In manage case flag page "Update flag \"Language Interpreter, Klingon\"", I validate fields displayed
            | field       |
            | Update flag "Language Interpreter, Klingon" comments |
            | Update flag "Language Interpreter, Klingon" status |
            | I need to add a translation |

        When In manage case flag page "Update flag \"Language Interpreter, Klingon\"", I input values
            | field                                                | value             |
            | Update flag "Language Interpreter, Klingon" comments | Test auto comment |
            | Update flag "Language Interpreter, Klingon" status | Inactive |
            | Describe reason for status change |Test auto reason|



        When In manage case flag workflow, I click Next

        Then In manage case flag workflow, I am on Review details page
        Then In manage case flag workflow, I validate Review details displayed
            | field           | value                          | isChangeLinkDisplayed |
            | Update flag for | Applicant                      | true                  |
            | Flag type       | Language Interpreter - Klingon | true                  |
            | Comments        | Test auto comment              | true                  |
            | Status          | Inactive                       | true                 |

        When In manage case flag workflow, I click submit

        Then I see case details page and I dont see case flags banner


        # Flags tab validation
        When I click tab with label "Case flags" in case details page, to see element with css selector "ccd-read-case-flag-field"
        Then I validate case flags table for "Applicant" has 1 flags
        Then I validate case flags table for "Respondent" has 0 flags
        Then I validate case flags tab table data for "Applicant"
            | Party level flags        | Comments          | Creation date | Last modified | Flag status |
            | Language Interpreter | Test auto comment | today | today | INACTIVE |
