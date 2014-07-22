Feature:

    This is a feature file that can act as an example feature
    along as a way to test new and upcoming exciting steps.

    Scenario: We want to go to homepage and fill in some stuff
        Given I go to the homepage
            And I fill in "Test Field" with "Hello"

    Scenario: We want to test our chain function
        When I get homepage and fill in "Test Field" with "Hello 2"

    Scenario: We want to go to homepage and test navigation related steps
        Given I go to the homepage
            And I go to "/#/view/4"

    Scenario: I want to reload the page
        Given I go to the homepage
            And I reload the page

    Scenario: Test backward one page
        Given I go to the homepage
            And I go to "/#/view/4"
            And I move backward one page
            Then the url should match "http://localhost:2999/#/view/4"

    Scenario: We want to see if a certain text is present
        Given I go to the homepage
            Then the "Text Area Test" field should exist
            Then I should see "This is a test for field contains"
            Then I should see text matching "This is a test for field contains"

    Scenario: We want to see if a certain number of elements exist in a list
        Given I go to the homepage
            Then I should see 3 "li" elements

    Scenario: We want to see if a button is enabled or disabled
        Given I go to the homepage
            Then the "Click Me" button should be enabled
            Then the "Cant Click Me" button should be disabled

    Scenario: We want to go to homepage and check the document title
        Given I go to the homepage
            Then the document title should be "Mock App"
            And the document title should not be "Something else"

    Scenario: When I fill in using a table
        Given I go to the homepage
            And I fill in the following:
                | Test Field: | test1 |
                | Input field: | test2 |

    Scenario: We want to go to homepage and search for an item in the table and click one of the options
        Given I go to the homepage
            Then I search "Boeing" and I click "Edit"
