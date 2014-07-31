var world = require("./world.js");
var mapSteps = require("./map-steps.js").MapSteps;

exports.Steps = function() {

    this.World = world.World;

    this.Given(/^I (?:am on|go to) the homepage$/, function(callback) {
        mapSteps.iGoToHomepage(this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Given(/^I hit key "([^"]*)"$/, function(key, callback) {
        mapSteps.keyHit(key, this).then(
            function resolve() {
                callback();
            },
            function reject(reason) {
                callback.fail(err);
            }
        );
    });

    this.Given(/^I hit key "([^"]*)"$/, function(key, callback) {
        mapSteps.keyHit(key, this, callback);
    });

    this.Given(/^I (?:go to|am on) "([^"]*)"$/, function(url, callback) {
        mapSteps.iGoToUrl(url, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same "([^"]*)" element$/, function(textOne, textTwo, element, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, element, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same table row$/, function(textOne, textTwo, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, 'tr', this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same li$/, function(textOne, textTwo, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, 'li', this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same "([^"]*)" element$/, function(textOne, textTwo, element, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, element, this, callback);
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same table row$/, function(textOne, textTwo, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, 'tr', this, callback);
    });

    this.Then(/^I should see "([^"]*)" and "([^"]*)" in the same li$/, function(textOne, textTwo, callback) {
        mapSteps.shouldFindBothInTheSameRow(textOne, textTwo, 'li', this, callback);
    });

    this.Then(/^the "([^"]*)" field should have the value "([^"]*)"$/, function(field, value, callback) {
        mapSteps.fieldShouldHaveValue(field, value, true, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" field should not have the value "([^"]*)"$/, function(field, value, callback) {
        mapSteps.fieldShouldHaveValue(field, value, false, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I reload the page$/, function (callback) {
        mapSteps.reloadPage(this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I move backward one page$/, function (callback) {
        mapSteps.goBackOnePage(this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I move forward one page$/, function (callback) {
        mapSteps.goForwardOnePage(this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I press "((?:[^"]|\\")*)"$/, function (button, callback) {
        mapSteps.iPress(button, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I follow "((?:[^"]|\\")*)"$/, function (link, callback) {
        mapSteps.iFollow(link, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" with "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fillIn(field, data, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" for "((?:[^"]|\\")*)"$/, function(field, data, callback) {
        mapSteps.fillIn(data, field, this).then(
            function resolve() {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" with: ((?:[^"]|\\")*)$/, function(field, data, callback) {
        mapSteps.fillIn(field, data, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I fill in the following:$/, function (dataTable, callback) {
        mapSteps.iFillInTheFollowing(dataTable, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );;
    });

    this.When(/^I clear field "((?:[^"]|\\")*)"$/, function (field, callback) {
        mapSteps.clearField(field, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I (?:click|focus|choose|select) "((?:[^"]|\\")*)"$/, function (field, callback) {
        mapSteps.iFocusOn(field, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (option, select, callback) {
        mapSteps.selectFrom(option, select, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I additionally select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (callback) {
        mapSteps.selectFrom(option, select, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I check "((?:[^"]|\\")*)"$/, function (checked, callback) {
        mapSteps.checkbox(checked, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I uncheck "((?:[^"]|\\")*)"$/, function (checked, callback) {
        mapSteps.checkbox(checked, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I attach the file "([^"]*)" to "((?:[^"]|\\")*)"$/, function (file, element, callback) {
        mapSteps.attachFile(file, element, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should be on "([^"]*)"$/, function (uri, callback) {
        mapSteps.shouldBeOn(uri, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the [Uu][Rr][Ll] should match "([^"]*)"$/, function (value, callback) {
        mapSteps.theURLShouldMatch(value, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        mapSteps.responseContain(code, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        mapSteps.responseContain(code, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.isPresent(text, this, 'true').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );;
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.isPresent(text, this, 'false').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see text matching "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.isPresent(text, this, 'true').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        mapSteps.isPresent(text, this, 'false').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the response should contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.responseContain(text, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the response should not contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.responseContain(text, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see "((?:[^"]|\\")*)" in the "([^"]*)" element$/, function (text, element, callback) {
        mapSteps.elementContains(text, element, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)" in the "([^"]*)" element$/, function (text, element, callback) {
        mapSteps.elementContains(text, element, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" element should contain "((?:[^"]|\\")*)"$/, function (element, text, callback) {
        mapSteps.elementContains(text, element, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" element should not contain "((?:[^"]|\\")*)"$/, function (element, text, callback) {
        mapSteps.elementContains(text, element, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see an? "([^"]*)" element$/, function (element, callback) {
        mapSteps.elementExists(element, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should not see an? "([^"]*)" element$/, function (element, callback) {
        mapSteps.elementExists(element, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should contain "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fieldContains(data, field, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should not contain "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fieldContains(data, field, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" checkbox should be checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, this, 'true').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the checkbox "((?:[^"]|\\")*)" (?:is|should be) checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, this, 'true').then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" checkbox should not be checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, this, null).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the checkbox "((?:[^"]|\\")*)" should (?:be unchecked|not be checked)$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, this, null).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the checkbox "((?:[^"]|\\")*)" is (?:unchecked|not checked)$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, this, null).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I should see (\d+) "([^"]*)" elements?$/, function (count, element, callback) {
        mapSteps.iShouldSeeNElements(count, element, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" field should have focus$/, function (field, callback) {
        mapSteps.hasFocus(field, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" field should not have focus$/, function (field, callback) {
        mapSteps.hasFocus(field, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "([^"]*)" button should be (en|dis)abled$/, function (button, enDis, callback) {
        mapSteps.theButtonShouldBe(button, enDis, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the document title should be "((?:[^"]|\\")*)"?/, function(title, callback) {
        mapSteps.elementContains(title, 'title', false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the document title should not be "((?:[^"]|\\")*)"?/, function(title, callback) {
        mapSteps.elementContains(title, 'title', true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should exist?/, function(field, callback) {
        mapSteps.fieldExists(field, false, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should not exist?/, function(field, callback) {
        mapSteps.fieldExists(field, true, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Then(/^I search "([^"]*)" and I click "([^"]*)"?/,function(searchText,clickText,callback) {
        mapSteps.searchAndClick(searchText, clickText, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });
};
