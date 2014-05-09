
var world = require("./world.js");

exports.Steps = function() {

    var errorElementDoesNotExists = new Error('Element does not exist!');

    function exists(parameter) {
        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
    };

    function fillIn(field, data, callback, self) {

        if(!exists(self))
            self = this;

        var xpath = self.namedSelectors.getXpath('field', field);
        var browser = self.browser;

        browser.waitForElementByXPath(xpath, function (err, el) {
            if(exists(el)) {
                el.clear(function(err){});
                browser.type(el, data, callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    };

    function fillInSwitch(data, field, callback) {
        fillIn(field,data,callback,this);
    };

    function convertKeysToLower(hash) {
        keys = Object.keys(hash);
        for(var i = 0; i < keys.length ; i++) {
            hash[keys[i].toLowerCase()] = hash[keys[i]];
            delete hash[keys[i]];
        }
        return hash;
    };
    function isChecked(title, callback, self, value) {
        if(!exists(self))
            self = this;
        var xpathCheckBox;
        xpathCheckBox = self.namedSelectors.getXpath('checkbox', title);
        self.browser.waitForElementByXPath(xpathCheckBox, function(err, el) {
            el.getAttribute('checked', function(err, checked) {
                if(checked == value) {
                    callback();
                } else {
                    if(value == 'true') {
                        callback.fail(new Error("Expected " + title + " to be checked"));
                    } else {
                        callback.fail(new Error("Expected " + title + " to be unchecked"));
                    }
                }
            });
        });
    };
    function isPresent(text, callback, self, present) {
        if(!exists(self))
            self = this;
        var xpathIsPresent;
        xpathIsPresent = self.namedSelectors.getXpath('content', text);
        self.browser.waitForElementByXPath(xpathIsPresent, function(err, el) {
            var textIsPresent;
            textIsPresent = el || false;
            if(textIsPresent == false) {
                if(present == 'true') {
                    callback.fail(new Error("Expected page to contain " + text));
                } else {
                    callback()
                }
            } else {
                if(present == 'true') {
                    callback();
                } else {
                    callback.fail(new Error("Expected page not to contain " + text));
                }
            }
        });
    };
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
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(/^I follow "((?:[^"]|\\")*)"$/, function (link, callback) {
        var xpath = this.namedSelectors.getXpath('link', link);
        var browser = this.browser;

        browser.waitForElementByXPath(xpath, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(
        /^I fill in "((?:[^"]|\\")*)" with "((?:[^"]|\\")*)"$/,
        fillIn
    );

    this.When(
        /^I fill in "((?:[^"]|\\")*)" for "((?:[^"]|\\")*)"$/,
        fillInSwitch
    );

    this.When(
        /^I fill in "((?:[^"]|\\")*)" with: ((?:[^"]|\\")*)$/,
        fillIn
    );

    this.When(/^I fill in the following:$/, function (dataTable, callback) {

        // This is the code you suggested to sent me
        var self = this;
        var callbacks = [callback];
        dataTable.raw().reverse().forEach(function (row) {
            var cb = callbacks.pop();
            callbacks.push(function() {
                fillIn(row[0],row[1],cb,self);
            });
        });

        callbacks.pop()();
    });

    this.When(/^I select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (option, select, callback) {
        var xpathSelect = this.namedSelectors.getXpath('field', select);
        var xpathOption = this.namedSelectors.getXpath('option', option);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathSelect, function (err, el){
            if(exists(el)) {
                el.elementByXPath(xpathOption, function(err, el) {
                    if(exists(el)){
                        el.click(callback);
                    } else {
                        callback.fail(errorElementDoesNotExists);
                    }
                });
            }
            else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(/^I additionally select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (callback) {
        var xpathSelect = this.namedSelectors.getXpath('field', select);
        var xpathOption = this.namedSelectors.getXpath('option', option);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathSelect, function (err, el){
            if(exists(el)) {
                el.elementByXPath(xpathOption, function(err, el) {
                    if(exists(el)) {
                        el.click(callback);
                    } else {
                        callback.fail(errorElementDoesNotExists);
                    }
                });
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(/^I check "((?:[^"]|\\")*)"$/, function (checked, callback) {
        var xpathChecked = this.namedSelectors.getXpath('field', checked);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathChecked, function(err, el) {
            if(exists(el)) {
                el.isSelected(function(err, selected){
                    if(!selected)
                        el.click(callback);
                });
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(/^I uncheck "((?:[^"]|\\")*)"$/, function (callback) {
        var xpathChecked = this.namedSelectors.getXpath('field', checked);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathChecked, function(err, el) {
            if(exists(el)) {
                el.isSelected(function(err, selected){
                    if(selected)
                        el.click(callback);
                });
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
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
    this.Then(/^the [Uu][Rr][Ll] should match ("(?:[^"]|\\")*")$/, function (value, callback) {
        this.browser.url(function(err, url) {
            var currentUrl = JSON.stringify(url);
            if(currentUrl == value) {
                callback();
            } else {
                callback.fail(new Error("Expected "+ currentUrl +" to be " + value));
            }
        });
    });
    // Emanuel
    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        callback.pending();
    });
    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'true');
    });
    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'false');
    });
    // Emanuel
    this.Then(/^I should see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'true');
    });
    // Emanuel
    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'false');
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
            var self = this;
            isChecked(checkbox, callback, self, 'true');
        }
    );
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" (?:is|should be) checked$/,
        function (checkbox, callback) {
            var self = this;
            isChecked(checkbox, callback, self, 'true');
        }
    );
    this.Then(
        /^the "((?:[^"]|\\")*)" checkbox should not be checked$/,
        function (checkbox, callback) {
            var self = this;
            isChecked(checkbox, callback, self, 'false');
        });
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" should (?:be unchecked|not be checked)$/,
        function (checkbox, callback) {
            var self = this;
            isChecked(checkbox, callback, self, 'false');
        }
    );
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" is (?:unchecked|not checked)$/,
        function (checkbox, callback) {
            var self = this;
            isChecked(checkbox, callback, self, 'true');
        }
    );
    // Emanuel
    this.Then(
        /^I should see (\d+) "([^"]*)" elements?$/,
        function (count, element, callback) {
            console.log(element);
            this.browser.waitForElementsByCssSelector(element, function(err, els) {
                if(els.length == count) {
                    callback();
                } else {
                    callback.fail(new Error("Expected "+count+" "+element+" to exist. Instead of "+els.length+" " +element))
                }
            })
        });
};
