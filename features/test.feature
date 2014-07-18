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
            And I reload the page
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