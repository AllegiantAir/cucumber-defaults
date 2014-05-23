MapSteps = function () {

    var errorElementDoesNotExists = new Error('Element does not exist!');
    var mapSteps = this;

    function exists(parameter) {
        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
    };

    this.fillIn = function(field, data, callback, self) {
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

    this.fieldContains = function(data, field, callback, negate, self) {
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

    this.checkbox = function(checked, callback, shouldBeChecked, self) {
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

    this.responseContain = function(text, callback, negate, self) {
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

    this.elementContains = function(text, element, callback, negate, self) {
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

    this.elementExists = function(element, callback, negate, self) {
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

    this.hasFocus = function(field, callback, negate, self) {
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

    this.isChecked = function(title, callback, self, value) {
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

    this.isPresent = function(text, callback, self, present) {
        var xpathIsPresent;
        xpathIsPresent = self.namedSelectors.getXPath("content", text);
        self.browser.waitForElementByXPath(xpathIsPresent, function(err, el) {
            if(exists(el)) {
                self.browser.waitForElementByXPath(xpathIsPresent, self.wd.asserters.isNotDisplayed, function(err, el) {
                    if(exists(el)) {
                        if(present == "true"){
                            callback.fail(new Error("Expected "+text+" to be present"))
                        } else {
                            callback();
                        }
                    } else {
                        if(present == "true") {
                            callback();
                        } else {
                            callback.fail(new Error("Expected "+text+" not to be present"))
                        }
                    }
                });
            } else {
                if(present == "true") {
                    callback.fail(new Error("Expected "+text+" to be present"))
                } else {
                    callback();
                }
            }
        });
    };

    this.selectFrom = function(option, select, callback, self) {
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

    this.theURLShouldMatch = function(value, callback, self) {
        this.browser.url(function(err, url) {
            var currentUrl = "'"+ url + "'";
            if(currentUrl.indexOf(value) != -1) {
                callback();
            } else {
                callback.fail(new Error("Expected "+ currentUrl +" to include " + value));
            }
        });
    };

    this.iShouldSeeNElements = function(count, element, callback, self) {
        self.browser.waitForElementsByCssSelector(element, function(err, els) {
            if(els.length == count) {
                callback();
            } else {
                callback.fail(new Error("Expected "+count+" "+element+" to exist. Instead of "+els.length+" " +element))
            }
        });
    };

    this.theButtonShouldBe = function(button, enDis, callback, self) {
        var XPath = self.namedSelectors.getXPath('button', button);
        var browser = self.browser;
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
    };

    this.shouldBeOn = function(uri, callback, self) {
        self.browser.url( function(err, url) {
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
    };

    this.attachFile = function(file, element, callback, self) {
        var XPathFileUpload = self.namedSelectors.getXPath('file', element)
        self.browser.waitForElementByXPath(XPathFileUpload, function(err, el) {
            if(exists(el)) {
                el.sendKeys(file, function() {
                    callback();
                });
            } else {
                callback.fail(errorElementDoesNotExists)
            }

        });
    };

    this.iPress = function(button, callback, self) {
        var XPath = self.namedSelectors.getXPath('button', button);
        var browser = self.browser;

        browser.waitForElementByXPath(XPath, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    };

    this.iFollow = function(link, callback, self) {
        var XPath = self.namedSelectors.getXPath('link', link);
        var browser = self.browser;

        browser.waitForElementByXPath(XPath, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(errorElementDoesNotExists);
            }
        });
    };

    this.iFillInTheFollowing = function(dataTable, callback, self) {
        // This is the code you suggested to sent me
        var callbacks = [callback];
        dataTable.raw().reverse().forEach(function (row) {
            var cb = callbacks.pop();
            callbacks.push(function() {
                mapSteps.fillIn(row[0],row[1],cb,self);
            });
        });

        callbacks.pop()();
    };

    this.iFocusOn = function(field, callback, self) {
        var xpathField = self.namedSelectors.getXPath('field', field);
        var browser = self.browser;

        browser.waitForElementByXPath(xpathField, function (err, el) {
            if(exists(el)) {
                el.click(callback);
            } else {
                callback.fail(el);
            }
        });
    };

    this.iGoToHomepage = function(callback, self) {
        /* @TODO: make clean up the world url finagler to support 'sub-baseUrls' */
        self.browser.get(self.baseUrl, callback);
    };

    this.iGoToUrl = function(url, callback, self) {
        self.browser.get(self.url(url), callback);
    };

    this.reloadPage = function(callback, self) {
        self.browser.url(function(err,url) {
            self.browser.get(self.url(url), callback);
        });
    };

    this.goBackOnePage = function(callback, self) {
        self.browser.back(function(err) {
            callback();
        });
    };

    this.goForwardOnePage = function(callback, self) {
        self.browser.forward(function(err) {
            callback();
        });
    };

};

exports.MapSteps = new MapSteps();