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
            
    Scenario: Test backward one page
        Given I go to the homepage
            And I go to "/#/view/4"
            And I move backward one page
            And I move forward one page

    Scenario: We want to go to homepage and want to check if a field contains or doesn't contain desired information
        Given I go to the homepage
            Then the "Contains field:" field should have the value "Lorem ipsum"
            Then the "Contains field:" field should not have the value "dolor sit amet"

    Scenario: We want to go to homepage and test press step
        Given I go to the homepage
            When I press "Click Me"

    Scenario: We want to go to homepage and test follow link step
        Given I go to the homepage
            When I follow "Click here for testing the link"

    Scenario: We want to go to homepage and test if a field is cleared
        Given I go to the homepage
            Then the "Contains field:" field should have the value "Lorem ipsum"
            When I clear field "Contains field:"
            Then the "Contains field:" field should not have the value "Lorem ipsum"

    Scenario: We want to go to homepage and test if a field contains a certain text
        Given I go to the homepage
            Then the "Contains field:" field should exist
            Then the "Contains field:" field should contain "Lorem ipsum"

    Scenario: We want to go to homepage and test if a field has focus
        Given I go to the homepage
            Then the "Input field:" field should exist
            When I click "Input field:"
            Then the "Input field:" field should have focus

    Scenario: We want to go to homepage and test if we can select from a drop down
        Given I go to the homepage
            Then the "Select Element Unit Test" field should exist
            When I select "Bootstrap" from "Select Element Unit Test"

    Scenario: We want to go to homepage and test if we can check a checkbox
        Given I go to the homepage
            Then the "Checkbox test:" field should exist
            When I check "Checkbox test:"
            Then the "Checkbox test:" checkbox should be checked

    Scenario: We want to go to homepage and test if we can un-check a checkbox
        Given I go to the homepage
            Then the "Checkbox test:" field should exist
            When I uncheck "Checkbox test:"
            Then the "Checkbox test:" checkbox should not be checked

    Scenario: We want to go to a certain address and test uri
        Given I go to the homepage
            And I go to "/#/view/4"
            Then I should be on "http://localhost:2999/#/view/4"
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

    Scenario: When I fill in using a table
        Given I go to the homepage
            And I fill in the following:
                | Test Field: | test1 |
                | Input field: | test2 |