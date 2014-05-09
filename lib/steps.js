
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

    this.When(/^I attach the file "([^"]*)" to "((?:[^"]|\\")*)"$/, function (file, field, callback) {
        //var xpathFile = this.namedSelectors.getXpath('field', field);
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
        var browser = this.browser;
        browser.url(function (err,url) {
            console.log(url);
        });
    });
    // Emanuel
    this.Then(/^the [Uu][Rr][Ll] should match ("(?:[^"]|\\")*")$/, function (url, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^I should see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        callback.pending();
    });
    // Emanuel
    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        callback.pending();
    });
    
    this.Then(/^the response should contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        var xpathResponse = this.namedSelectors.getXpath('content',text);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathResponse, function(err, el) {
            if(!exists(el))
                callback.fail(errorElementDoesNotExists);
            else
                callback();
        });
    });

    this.Then(/^the response should not contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        var xpathResponse = this.namedSelectors.getXpath('content', text);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathResponse, function(err, el) {
            if(exists(el))
                callback.fail(new Error("Response contains " + text));
            else
                callback();
        });
    });

    this.Then(
        /^I should see "((?:[^"]|\\")*)" in the "([^"]*)" element$/,
        function (text, element, callback) {
            var xpathElement = this.namedSelectors.getXpath('tagname_content', text, element);
            var browser = this.browser;

            browser.waitForElementByXPath(xpathElement, function(err, ele) {
                console.log(xpathElement);
                if(!exists(ele)) {
                    callback.fail(errorElementDoesNotExists);
                } else {
                    callback(); 
                }
            });
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
    // Emanuel
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" (?:is|should be) checked$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );
    // Emanuel
    this.Then(
        /^the "((?:[^"]|\\")*)" checkbox should not be checked$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );
    // Emanuel
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" should (?:be unchecked|not be checked)$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );
    // Emanuel
    this.Then(
        /^the checkbox "((?:[^"]|\\")*)" is (?:unchecked|not checked)$/,
        function (checkbox, callback) {
            callback.pending();
        }
    );
    // Emanuel
    this.Then(
        /^I should see (\d+) "([^"]*)" elements?$/,
        function (count, element, callback) {
            callback.pending();
        }
    );
};
