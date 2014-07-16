var world = require("./world.js");
var mapSteps = require("./map-steps.js").MapSteps;

exports.Steps = function() {
    
    this.World = world.World;

    this.Given(/^I (?:am on|go to) the homepage$/, function(callback) {
        mapSteps.iGoToHomepage(this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.Given(/^I (?:go to|am on) "([^"]*)"$/, function(url, callback) {
        mapSteps.iGoToUrl(url, callback, this);
    });

    this.Then(/^the "([^"]*)" field should have the value "([^"]*)"$/, function(field, value, callback) {
        mapSteps.fieldShouldHaveValue(field, value, true, this, callback);
    });

    this.Then(/^the "([^"]*)" field should not have the value "([^"]*)"$/, function(field, value, callback) {
        mapSteps.fieldShouldHaveValue(field, value, false, this, callback);
    });

    this.When(/^I reload the page$/, function (callback) {
        mapSteps.reloadPage(callback, this);
    });

    this.When(/^I move backward one page$/, function (callback) {
        mapSteps.goBackOnePage(callback, this);
    });

    this.When(/^I move forward one page$/, function (callback) {
        mapSteps.goForwardOnePage(callback, this);
    });

    this.When(/^I press "((?:[^"]|\\")*)"$/, function (button, callback) {
        mapSteps.iPress(button, callback, this);
    });

    this.When(/^I follow "((?:[^"]|\\")*)"$/, function (link, callback) {
        mapSteps.iFollow(link, callback, this);
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" with "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fillIn(field, data, this).then(
            function resolve(value) {
                callback();
            },
            function reject(err) {
                callback.fail(err);
            }
        );
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" for "((?:[^"]|\\")*)"$/, function(field, data, callback) {
        mapSteps.fillIn(data, field, callback, this);
    });

    this.When(/^I fill in "((?:[^"]|\\")*)" with: ((?:[^"]|\\")*)$/, function(field, data, callback) {
        mapSteps.fillIn(field,data, callback, this);
    });

    this.When(/^I fill in the following:$/, function (dataTable, callback) {
        mapSteps.iFillInTheFollowing(dataTable, callback, this);
    });

    this.When(/^I clear field "((?:[^"]|\\")*)"$/, function (field, callback) {
        mapSteps.clearField(field, this, callback);
    });

    this.When(/^I (?:click|focus|choose|select) "((?:[^"]|\\")*)"$/, function (field, callback) {
        mapSteps.iFocusOn(field, callback, this);
    });

    this.When(/^I select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (option, select, callback) {
        mapSteps.selectFrom(option, select, callback, this);
    });

    this.When(/^I additionally select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (callback) {
        mapSteps.selectFrom(option, select, callback, this);
    });

    this.When(/^I check "((?:[^"]|\\")*)"$/, function (checked, callback) {
        mapSteps.checkbox(checked, callback, true , this);
    });

    this.When(/^I uncheck "((?:[^"]|\\")*)"$/, function (checked, callback) {
        mapSteps.checkbox(checked, callback, false, this);
    });

    this.When(/^I attach the file "([^"]*)" to "((?:[^"]|\\")*)"$/, function (file, element, callback) {
        mapSteps.attachFile(file, element, callback, this);
    });

    this.Then(/^I should be on "([^"]*)"$/, function (uri, callback) {
        mapSteps.shouldBeOn(uri, callback, this);
    });

    this.Then(/^the [Uu][Rr][Ll] should match "([^"]*)"$/, function (value, callback) {
        mapSteps.theURLShouldMatch(value, callback, this);
    });

    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        mapSteps.responseContain(code, callback, false, this)
    });

    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        mapSteps.responseContain(code, callback, true, this)
    });

    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.isPresent(text, callback, this, 'true');
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.isPresent(text, callback, this, 'false');
    });

    this.Then(/^I should see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        mapSteps.isPresent(text, callback, this, 'true');
    });

    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        mapSteps.isPresent(text, callback, this, 'false');
    });
    
    this.Then(/^the response should contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.responseContain(text, callback, false, this);
    });

    this.Then(/^the response should not contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        mapSteps.responseContain(text, callback, true, this);
    });

    this.Then(/^I should see "((?:[^"]|\\")*)" in the "([^"]*)" element$/, function (text, element, callback) {
        mapSteps.elementContains(text, element, callback, false, this);
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)" in the "([^"]*)" element$/, function (text, element, callback) {
        mapSteps.elementContains(text, element, callback, true, this);
    });

    this.Then(/^the "([^"]*)" element should contain "((?:[^"]|\\")*)"$/, function (element, text, callback) {
        mapSteps.elementContains(text, element, callback, false, this);
    });

    this.Then(/^the "([^"]*)" element should not contain "((?:[^"]|\\")*)"$/, function (element, text, callback) {
        mapSteps.elementContains(text, element, callback, true, this);
    });

    this.Then(/^I should see an? "([^"]*)" element$/, function (element, callback) {
        mapSteps.elementExists(element, callback, false, this)
    });

    this.Then(/^I should not see an? "([^"]*)" element$/, function (element, callback) {
        mapSteps.elementExists(element, callback, true, this)
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should contain "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fieldContains(data, field, callback, false, this)
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should not contain "((?:[^"]|\\")*)"$/, function (field, data, callback) {
        mapSteps.fieldContains(data, field, callback, true, this)
    });

    this.Then(/^the "((?:[^"]|\\")*)" checkbox should be checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, callback, this, 'true');
    });

    this.Then(/^the checkbox "((?:[^"]|\\")*)" (?:is|should be) checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, callback, this, 'true');
    });

    this.Then(/^the "((?:[^"]|\\")*)" checkbox should not be checked$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, callback, this, null);
    });

    this.Then(/^the checkbox "((?:[^"]|\\")*)" should (?:be unchecked|not be checked)$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, callback, this, null);
    });
    
    this.Then(/^the checkbox "((?:[^"]|\\")*)" is (?:unchecked|not checked)$/, function (checkbox, callback) {
        mapSteps.isChecked(checkbox, callback, this, null);
    });

    this.Then(/^I should see (\d+) "([^"]*)" elements?$/, function (count, element, callback) {
        mapSteps.iShouldSeeNElements(count, element, callback, this);
    });

    this.Then(/^the "([^"]*)" field should have focus$/, function (field, callback) {
        mapSteps.hasFocus(field, callback, false, this);
    });

    this.Then(/^the "([^"]*)" field should not have focus$/, function (field, callback) {
        mapSteps.hasFocus(field, callback, true, this);
    });

    this.Then(/^the "([^"]*)" button should be (en|dis)abled$/, function (button, enDis, callback) {
        mapSteps.theButtonShouldBe(button, enDis, callback, this);
    });

    this.Then(/^the document title should be "((?:[^"]|\\")*)"?/, function(title, callback) {
        mapSteps.elementContains(title, 'title', callback, false, this);
    });

    this.Then(/^the document title should not be "((?:[^"]|\\")*)"?/, function(title, callback) {
        mapSteps.elementContains(title, 'title', callback, true, this);
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should exist?/, function(field, callback) {
        mapSteps.fieldExists(field, callback, false, this);
    });

    this.Then(/^the "((?:[^"]|\\")*)" field should not exist?/, function(field, callback) {
        mapSteps.fieldExists(field, callback, true, this);
    });

    this.Then(/^I search "([^"]*)" and I click "([^"]*)"?/,function(searchText,clickText,callback) {
        mapSteps.searchAndClick(searchText,clickText,callback,this);
    });
};
