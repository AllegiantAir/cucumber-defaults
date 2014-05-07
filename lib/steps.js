
var world = require("./world.js");

exports.Steps = function() {
    this.World = world.World;

    this.Given(/^I (?:am on|go to) the homepage$/, function(callback) {
        this.browser.get(this.url('/'), callback);
    });

    this.Given(/^I (?:go to|am on) "([^"]*)"$/, function(url, callback) {
        this.browser.get(this.url(url), callback);
    });

    this.When(/^I reload the page$/, function (callback) {
        var urlXpath = '/session/:sessionId/url';
        var self = this;
        this.browser.url(function(err,url) {
            self.browser.get(self.url(url), callback);
        })
    });

    this.When(/^I move backward one page$/, function (callback) {
        this.browser.back(function(err) {
            // Do nothing for now
            callback();
        });
    });

    this.When(/^I move forward one page$/, function (callback) {
        this.browser.forward(function(err) {
            // Do nothing for now
            callback();
        });
    });

    this.When(/^I press "((?:[^"]|\\")*)"$/, function (button, callback) {
        var xpath = this.namedSelectors.getXpath('button', button);
        var browser = this.browser;

        browser.waitForElementByXPath(xpath, function (err, el) {
            el.click(callback);
        });
    });

    this.When(/^I follow "((?:[^"]|\\")*)"$/, function (link, callback) {
        var xpath = this.namedSelectors.getXpath('link', link);
        var browser = this.browser;

        browser.waitForElementByXPath(xpath, function (err, el) {
            el.click(callback);
        });
    });

    this.When(
        /^I fill in "((?:[^"]|\\")*)" with "((?:[^"]|\\")*)"$/,
        function (label, value, callback) {
            var xpath = this.namedSelectors.getXpath('field', label);
            var browser = this.browser;

            browser.waitForElementByXPath(xpath, function (err, el) {
                el.clear(function(err){});
                browser.type(el, value, callback);
            });
        }
    );

    this.When(
        /^I fill in "((?:[^"]|\\")*)" for "((?:[^"]|\\")*)"$/,
        function (value, label, callback) {
            var xpath = this.namedSelectors.getXpath('field', label);
            var browser = this.browser;

            browser.waitForElementByXPath(xpath, function (err, el) {
                el.clear(function(err){});
                browser.type(el, value, callback);
            });
        }
    );

    this.When(/^I fill in "((?:[^"]|\\")*)" with:$/, function (callback) {
        var xpath = this.namedSelectors.getXpath('field', label);
        var browser = this.browser;
        var self = this;

        browser.waitForElementByXPath(xpath, function (err,el){
            callback(self, el);
        });
    });

    this.When(/^I fill in the following:$/, function (callback) {
        callback.pending();
    });

    this.When(/^I select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (option, select, callback) {
        var xpathSelect = this.namedSelectors.getXpath('select', select);
        var xpathOption = this.namedSelectors.getXpath('option', option);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathSelect, function (err, el){
            if(el != null && el != undefined) {
                el.elementsByXPath(xpathOption, function(err, el) {
                    if(el != null && el != undefined)
                        el.click(callback);
                });
            }
        });
    });

    this.When(/^I additionally select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (callback) {
        callback.pending();
    });

    this.When(/^I check "((?:[^"]|\\")*)"$/, function (callback) {
        callback.pending();
    });

    this.When(/^I uncheck "((?:[^"]|\\")*)"$/, function (callback) {
        callback.pending();
    });

    this.When(/^I attach the file "([^"]*)" to "((?:[^"]|\\")*)"$/, function (callback) {
        callback.pending();
    });

    this.Then(/^I should be on "([^"]*)"$/, function (uri, callback) {
        if (this.browser.url() == this.url(uri)) {
            callback();
        } else {
            callback.fail(
                new Error("Expected to be at ("
                        + this.url(uri)
                        + ") instead of ("
                        + this.browser.url()
                        + ")"
                )
            );
        }
    });

    this.Then(/^I should be on the homepage$/, function (callback) {
        callback.pending();
    });

    this.Then(/^the [Uu][Rr][Ll] should match ("(?:[^"]|\\")*")$/, function (url, callback) {
        callback.pending();
    });

    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        callback.pending();
    });

    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        callback.pending();
    });

    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });

    this.Then(/^I should see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        callback.pending();
    });

    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        callback.pending();
    });

    this.Then(/^the response should contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });

    this.Then(/^the response should not contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });

    this.Then(
        /^I should see "((?:[^"]|\\")*)" in the "([^"]*)" element$/,
        function (text, element, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^I should not see "((?:[^"]|\\")*)" in the "([^"]*)" element$/,
        function (text, element, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the "([^"]*)" element should contain "((?:[^"]|\\")*)"$/,
        function (element, text, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the "([^"]*)" element should not contain "((?:[^"]|\\")*)"$/,
        function (element, text, callback) {
            callback.pending();
        }
    );

    this.Then(/^I should see an? "([^"]*)" element$/, function (element, callback) {
        callback.pending();
    });

    this.Then(/^I should not see an? "([^"]*)" element$/, function (element, callback) {
        callback.pending();
    });

    this.Then(
        /^the "((?:[^"]|\\")*)" field should contain "((?:[^"]|\\")*)"$/,
        function (field, text, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the "((?:[^"]|\\")*)" field should not contain "((?:[^"]|\\")*)"$/,
        function (field, text, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the "((?:[^"]|\\")*)" checkbox should be checked$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" (?:is|should be) checked$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the "((?:[^"]|\\")*)" checkbox should not be checked$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" should (?:be unchecked|not be checked)$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" is (?:unchecked|not checked)$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );

    this.Then(
        /^I should see (\d+) "([^"]*)" elements?$/,
        function (count, element, callback) {
            callback.pending();
        }
    );
};
