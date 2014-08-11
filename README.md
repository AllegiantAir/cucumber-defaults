DevOps Cucumber Defaults
========================

Gherkin Default Steps (Primitive Steps)

When a string is in parenthesis such as in the step:

I (can | cannot) login

Then the step can be written as:

I can login

or

I cannot login

Also all double quotes need to be included. Strings within braces represent the type of data you are filling in. This is shown bellow in the example step:

I (can | cannot) login in as "{username}"

can be written as

I can login in as "Taylor"

or

I cannot login in as "Ben"

Some key words

{element} any html tag or element such as <a></a> or <input></input>, etc...

{link} any html link like <a href="some_url"></a>

Bellow are Gherkin steps that you can use to write your test cases. If you cannot find a step to write your test case, please consult with your QAE engineer to build a custom Gherkin step.

###Added Gherkin

You can now run example test data in cucumber 1.0.15. To add csv files add it anywhere in your project space. In your feature file you will have:

Scenario Outline:
...

Example File:

   pathTo/myExample.csv

You must have your example file in a scenario outline. Running regular cucumber.js will fail. You must run:

node ./node_modules/.bin/g4-cucumber

Defined Gherkin Steps


** Important

When you see a step beginning with 'When' you can substitute 'When' with 'And'

**

Steps Offered
==


###NPM Step Modules (npm-steps-g4 v. 0.0.4)

Given I drag "{label/text/placeholder etc... of droppable}" and drop it (?:in|to) "{label/text/placeholder etc... of droppable}"

When I paginate next

When I paginate previous

When I paginate to page "{page_number}"

Then paginate should have "{pages}" pages

Then paginate previous should be (en|dis)abled

Then paginate next should be (en|dis)abled

###Cucumber (1.0.13)

Then I search "{text}" and I click component with attribute "{attributeValue}"

Then I click "{element}" element containing "{text}"

Then I click component containing "{text}"

Then I type "{text}" into element "{element}" with (?:name|id) "{name/id}"

When I type "{text}" into component with (?:name|id) "{name/id}"

When I click element "{element}" with (?:name|id) "{name/id}"

When I click component with (?:name|id) "{name/id}"

When I click "{xpath}" xpath component

When I type "{text}" into component with xpath "{xpath}"

When I wait "{milliseconds}" ms

Then I click "{element}"

Then I should see "{textOne}" and "{textTwo}" in the same "{element}" element

Then I should see "{textOne}" and "{textTwo}" in the same table row

Then I should see "{textOne}" and "{textTwo}" in the same li

Given I hit key "{key}"                       Could be key described in: https://github.com/admc/wd/blob/master/lib/special-keys.js

Then the "{field}" should contain "{value}"

Then the "{field}" should not contain "{value}"

When I clear field "{field}" 

As of 6/21/2014 - Gherkin Default Steps (Primitive steps)

Then I search "{text of some dom node}" and I click "{text of next closest dom node}"

As of 5/28/2014 - Gherkin Default Steps (Primitive steps)
Then the document title should be "{what the html title needs to be}"

Then the document title should not be "{what the html title should not be}"

Then the "{field}" field should exist

Then the "{field}" field should not exist

Given I am (on the | go to) the homepage

Given I (am on | go to) "{url}"

When I reload the page

When I move backward one page

When I move forward one page

When I press "{button}"

When I follow "{link}"

When I fill in "{field}" with "{value}"

When I fill in "{value}" for "{field}"

When I fill in "{field}" with: "{value}"

    When I fill in the following:
    
        | {field 1} | {value 1} |
    
        | {field 2} | {value 2} |
    
        .
    
        .

When I (click | focus | choose | select) "field"

When I select "{value}" from "{selectbox}"

When I additionally select "{value}" from "{selectbox}"

When I check "{checkbox label}"

When I uncheck "{checkbox label}"

When I attach the file "{file_path}" to "{file_input}"

Then the (Url|URL|url) should match "{url}"

Then the response status code should be "{response_status_code}"

Then the response status code should not be "{response_status_code}"

Then I should see "{some text}"

Then I should not see "{some text}"

Then I should see text matching "{some text}"

Then I should not see text matching "{some text}"

Then the response should contain "{some text}"

Then the response should not contain "{some text}"

Then I should see "{some text}" in the "{element}" element

Then I should not see "{some text}" in the "{element}" element

Then the "{element}" element should contain "{some text}"

Then the "{element}" should not contain "{some text}"

Then I should see (a|an) "{element}" element

Then I should not see (a|an) "{element}" element

Then the "{field}" field should contain "{some text}"

Then the "{field}" field should not contain "{some text}"

Then the "{checkbox_label}" checkbox should be checked

Then the checkbox "{checkbox_label}" should not be checked

Then the checkbox "{checkbox_label}" (is|should be) checked

Then the "{checkbox_label}" checkbox should not be checked

Then the checkbox "{checkbox_label}" should (be unchecked|not be checked)

Then the checkbox "{checkbox_label}" is (unchecked|not checked)

Then I should see {number} "{element}" elements

Then the "{field}" field should have focus

Then the "{field}" field should not have focus

Then the "{button}" button should be (en|dis)abled


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

