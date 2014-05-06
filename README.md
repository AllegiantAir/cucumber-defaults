DevOps Cucumber Defaults
========================

TL;DR
-----

add this module to your project then run:

```javascript
./node_modules/.bin/cucumberSetupDefaults
```

now put a feature file in the features folder, then run:

```javascript
cucumber.js
```

Setup
-----

This gives a project a default set of steps for Behavior Driven Development

On a clean (untested) project the above will output the following:

```
features/ created
features/step_definitions/ created
features/support/ created
features/step_definitions/defaultSteps.js written with defaults
features/support/defaultHooks.js written with defaults
features/support/world.js written with defaults
```

try this on for size, use this as a package.json for a test project:

```
{
  "name": "cuke",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "devDependencies": {
    "devops-cucumber-defaults": "git+ssh://git@git.allegiantair.com:7999/devops/cucumber-defaults.git",
    "cucumber": "*",
    "wd": "*",
    "url": "*",
    "yaml": "*",
    "config": "*"
  }
}
```

now use this as a feature file (features/example.feature):

```
Feature: search functionality
  As a call center user

  Background:
    Given I am on the homepage

  Scenario: This does not exist
    When I fill in "Allegiant Air" for "q"
    Then I should see text matching "Allegiant Air"
```

make sure selenium is running

now run:

```
./node_modules/.bin/cucumber.js
```

