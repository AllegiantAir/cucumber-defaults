
var world = require("./world.js");

exports.Steps = function() {

    var errorElementDoesNotExists = new Error('Element does not exist!');

    function exists(parameter) {
        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
    };

    function fillIn(field, data, callback, self) {

        if(!exists(self))
            self = this;

        var XPath = self.namedSelectors.getXPath('field', field);
        var browser = self.browser;

        browser.waitForElementByXPath(XPath, function (err, el) {
            if(exists(el)) {
                el.clear(function(err){});
                browser.type(el, data, callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    };

    function fieldContains(data, field, callback, negate, self) {
        var XPathField = self.namedSelectors.getXPath('field', field);
        var browser = self.browser;
        var error;

        browser.waitForElementByXPath(XPathField, function(err, el) {
            if(exists(el)) {
                el.getValue(function (err, text) {
                    if( boolLambda( text == data)) {
                        callback();
                    } else {
                        callback.fail(error);
                    }
                })    
            } else {
                callback.fail(errorElementDoesNotExists)
            }
            
        });

        function boolLambda(expression) {
            if(negate) {
                error = new Error('Field does contain: ' + data);
                return !expression
            } else {
                error = new Error('Field does not contain: ' + data);
                return expression
            }
        };
    };

    function checkbox(checked, callback, shouldBeChecked, self) {
        var XPathChecked = self.namedSelectors.getXPath('field', checked);
        var browser = self.browser;

        browser.waitForElementByXPath(XPathChecked, function(err, el) {
            if(exists(el)) {
                el.isSelected( function(err, selected) {
                    if(selected != shouldBeChecked)
                        el.click(callback);
                    else
                        callback();
                });
            } else {
                callback.fail( errorElementDoesNotExists );
            }
        });
    };

    function responseContain(text, callback, negate, self) {
        var XPathResponse = self.namedSelectors.getXPath('content',text);
        var browser = self.browser;
        var error;

        browser.waitForElementByXPath(XPathResponse, function(err, el) {
            if( boolLambda(exists(el)) )
                callback();
            else
                callback.fail(error);
        });

        function boolLambda(expression) {
            if(negate) {
                error = errorElementDoesNotExists;
                return !expression
            } else {
                error = new Error('Response contains:' + text);
                return expression
            }
        };
    };

    function elementContains(text, element, callback, negate, self) {
        var XPathElement = self.namedSelectors.getXPath('tagname_content', text, element);
        var browser = self.browser;
        var error;

        browser.waitForElementByXPath(XPathElement, function(err, ele) {
            if( boolLambda(exists(ele)) ) {
                callback();
            } else {
                callback.fail(error);
            }
        });

        function boolLambda(expression) {
            if(negate) {
                error = errorElementDoesNotExists;
                return !expression
            } else {
                error = new Error('Element contains:' + text);
                return expression
            }
        };
    };

    function elementExists(element, callback, negate, self) {
        var XPathElement = self.namedSelectors.getXPath('tagname', null, element);
        var browser = self.browser;
        var error;

        browser.waitForElementByXPath(XPathElement, function(err, ele) {
            if( boolLambda(exists(ele)) ) {
                callback();
            } else {
                callback.fail(error);
            }
        });

        function boolLambda(expression) {
            if(negate) {
                error = errorElementDoesNotExists;
                return !expression
            } else {
                error = new Error('Element should not exist.');
                return expression
            }
        };
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

    function hasFocus(field, callback, negate, self) {
        self.browser.active(
            function (err, activeElement) {
                if (err) {
                    callback.fail(err);
                } else {
                    self.browser.waitForElementByXPath(
                        self.namedSelectors.getXPath('field', field),
                        function (err, fieldElement) {
                            fieldElement.equals(
                                activeElement,
                                function (err, theSame) {
                                    if (err) {
                                        callback.fail(err);
                                    } else if (negateBool(theSame)) {
                                        callback();
                                    } else {
                                        callback.fail(error);
                                    }
                                }
                            );
                        }
                    );
                }
            }
        );

        function negateBool(condition) {
            if(negate) {
                error = 'field (' + field + ') has focus';
                return !condition
            } else {
                error = 'field (' + field + ') does not contain focus';
                return condition
            }
        }
    };

    function isChecked(title, callback, self, value) {
        if(!exists(self))
            self = this;
        var XPathCheckBox;
        XPathCheckBox = self.namedSelectors.getXPath('checkbox', title);
        self.browser.waitForElementByXPath(XPathCheckBox, function(err, el) {
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
        var XPathIsPresent;
        XPathIsPresent = self.namedSelectors.getXPath('content', text);
        self.browser.waitForElementByXPath(XPathIsPresent, function(err, el) {
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
        /* @TODO: make clean up the world url finagler to support 'sub-baseUrls' */
        this.browser.get(this.baseUrl, callback);
    });

    this.Given(/^I (?:go to|am on) "([^"]*)"$/, function(url, callback) {
        console.log(this.url(url));
        console.log(this.baseUrl + url)
        this.browser.get(this.url(url), callback);
    });

    this.When(/^I reload the page$/, function (callback) {
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
        var XPath = this.namedSelectors.getXPath('button', button);
        var browser = this.browser;

        browser.waitForElementByXPath(XPath, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    });

    this.When(/^I follow "((?:[^"]|\\")*)"$/, function (link, callback) {
        var XPath = this.namedSelectors.getXPath('link', link);
        var browser = this.browser;

        browser.waitForElementByXPath(XPath, function (err, el) {
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

    function selectFrom(option, select, callback, self) {
        var XPathSelect = self.namedSelectors.getXPath('field', select);
        var XPathOption = self.namedSelectors.getXPath('option', option);
        var browser = self.browser;

        browser.waitForElementByXPath(XPathSelect, function (err, el){
            if(exists(el)) {
                el.elementByXPath(XPathOption, function(err, el) {
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
    };

    this.When(/^I (?:click|focus|choose|select) "((?:[^"]|\\")*)"$/, function (field, callback) {
        var xpathField = this.namedSelectors.getXPath('field', field);
        var browser = this.browser;

        browser.waitForElementByXPath(xpathField, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(el);
            }
        });
    });

    this.When(/^I select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (option, select, callback) {
        selectFrom(option, select, callback, this);
    });

    this.When(/^I additionally select "((?:[^"]|\\")*)" from "((?:[^"]|\\")*)"$/, function (callback) {
        selectFrom(option, select, callback, this);
    });

    this.When(/^I check "((?:[^"]|\\")*)"$/, function (checked, callback) {
        checkbox(checked, callback, true , this);
    });

    this.When(/^I uncheck "((?:[^"]|\\")*)"$/, function (checked, callback) {
        checkbox(checked, callback, false, this);
    });

    this.When(/^I attach the file "([^"]*)" to "((?:[^"]|\\")*)"$/, function (file, element, callback) {
        var XPathFileUpload = this.namedSelectors.getXPath('file', element)
        this.browser.waitForElementByXPath(XPathFileUpload, function(err, el) {
            if(exists(el)) {
                el.sendKeys(file, function() {
                    callback();
                });
            } else {
                callback.fail(errorElementDoesNotExists)
            }

        });
    });

    this.Then(/^I should be on "([^"]*)"$/, function (uri, callback) {
        self = this;
        this.browser.url( function(err, url) {
            if (url == self.url(uri)) {
                callback();
            } else {
                callback.fail(
                    new Error("Expected to be at ("
                        + self.url(uri)
                        + ") instead of ("
                        + url
                        + ")"
                    )
                );
            }
        });
    });

    this.Then(/^the [Uu][Rr][Ll] should match "([^"]*)"$/, function (value, callback) {
        this.browser.url(function(err, url) {
            var currentUrl = "'"+ url + "'";
            if(currentUrl.indexOf(value) != -1) {
                callback();
            } else {
                callback.fail(new Error("Expected "+ currentUrl +" to include " + value));
            }
        });
    });

    this.Then(/^the response status code should be (\d+)$/, function (code, callback) {
        responseContain(code, callback, false, self)
    });

    this.Then(/^the response status code should not be (\d+)$/, function (code, callback) {
        responseContain(code, callback, true, self)
    });

    this.Then(/^I should see "((?:[^"]|\\")*)"$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'true');
    });

    this.Then(/^I should not see "((?:[^"]|\\")*)"$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'false');
    });

    this.Then(/^I should see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'true');
    });

    this.Then(/^I should not see text matching ("(?:[^"]|\\")*")$/, function (text, callback) {
        var self = this;
        isPresent(text, callback, self, 'false');
    });
    
    this.Then(/^the response should contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        responseContain(text, callback, false, this);
    });

    this.Then(/^the response should not contain "((?:[^"]|\\")*)"$/, function (text, callback) {
        responseContain(text, callback, true, this);
    });

    this.Then(
        /^I should see "((?:[^"]|\\")*)" in the "([^"]*)" element$/,
        function (text, element, callback) {
            elementContains(text, element, callback, false, this);
        }
    );

    this.Then(
        /^I should not see "((?:[^"]|\\")*)" in the "([^"]*)" element$/,
        function (text, element, callback) {
            elementContains(text, element, callback, true, this);
        }
    );

    this.Then(
        /^the "([^"]*)" element should contain "((?:[^"]|\\")*)"$/,
        function (element, text, callback) {
            elementContains(text, element, callback, false, this);
        }
    );

    this.Then(
        /^the "([^"]*)" element should not contain "((?:[^"]|\\")*)"$/,
        function (element, text, callback) {
            elementContains(text, element, callback, true, this);
        }
    );

    this.Then(/^I should see an? "([^"]*)" element$/, function (element, callback) {
        elementExists(element, callback, false, this)
    });

    this.Then(/^I should not see an? "([^"]*)" element$/, function (element, callback) {
        elementExists(element, callback, true, this)
    });

    this.Then(
        /^the "((?:[^"]|\\")*)" field should contain "((?:[^"]|\\")*)"$/,
        function (field, data, callback) {
            fieldContains(data, field, callback, false, this)
        }
    );

    this.Then(
        /^the "((?:[^"]|\\")*)" field should not contain "((?:[^"]|\\")*)"$/,
        function (field, data, callback) {
            fieldContains(data, field, callback, true, this)
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

    this.Then(
        /^I should see (\d+) "([^"]*)" elements?$/,
        function (count, element, callback) {
            this.browser.waitForElementsByCssSelector(element, function(err, els) {
                if(els.length == count) {
                    callback();
                } else {
                    callback.fail(new Error("Expected "+count+" "+element+" to exist. Instead of "+els.length+" " +element))
                }
            })
        }
    );

    this.Then(
        /^the "([^"]*)" field should have focus$/,
        function (field, callback) {
            hasFocus(field, callback, false, this);
        }
    );

    this.Then(
        /^the "([^"]*)" field should not have focus$/,
        function (field, callback) {
            hasFocus(field, callback, true, this);
        }
    );

    this.Then(
        /^the "([^"]*)" button should be (en|dis)abled$/,
        function (button, enDis, callback) {
            var XPath = this.namedSelectors.getXPath('button', button);
            var browser = this.browser;
            var isEnabled = ('en' == enDis);

            browser.waitForElementByXPath(XPath, function (err, el) {
                if (err) {
                    callback.fail(err);
                } else if(exists(el)) {
                    el.isEnabled(function (error, enabled) {
                        if (error) {
                            callback.fail(error);
                        } else if(enabled && isEnabled) {
                            callback();
                        } else {
                            callback.fail('button (' + button + ') should be ' + enDis + 'abled');
                        }
                    });
                } else {
                    callback.fail(errorElementDoesNotExists);
                }
            });
        }
    );
};
