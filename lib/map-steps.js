var helper = require("./helper.js").Helper;

MapSteps = function () {
  var errorElementDoesNotExists = new Error('Element does not exist!');
  var mapSteps = this;

  this.fillIn = function(field, data, callback, self) {
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function (err, el) {
      if(err || (el == null) ) {
        callback.fail(err);
      } else {
        helper.waitForElementEnabled(el, 5000, function(err) {
          if(err){
            callback.fail(err);
          } else {
            browser.type(el, data, callback);
          }
        });
      }
    });
  };

  this.clearField = function(field, self, callback) {
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function(err, ele) {
      if(helper.exists(ele)) {
        ele.clear(function(err){
          callback();
        });
      } else {
        callback.fail(err);
      }
    });
  };

  this.fieldExists = function(field, callback, negate, self) {
    var error;
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function(err, ele) {
      if(negateBool(helper.exists(ele))) {
        callback();
      } else {
        callback.fail(error);
      }
    });

    function negateBool(condition) {
      if(negate) {
        error = new Error("Field " + field + " is supposed to exist.");
        return !condition;
      } else {
        error = new Error("Field " + field + " is not supposed to exist.");
        return condition;
      }

    }
  };

    this.fieldShouldHaveValue = function(field, value, shouldHave, self, callback) {
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function(err, ele) {
      if(helper.exists(ele)) {
        ele.getValue(function(err, elementValue) {
          if(negate(elementValue == value)) {
            callback();
          } else {
            callback.fail(err);
          }
        });
      } else {
        callback.fail(err);
      }
    });

    function negate(condition) {
      if(shouldHave) {
        return condition;
      }
      return !condition;
    }
  };

  this.fieldContains = function(data, field, callback, negate, self) {
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;
    var error;

    browser.waitForElementByXPath(XPath, function(err, el) {
      if(helper.exists(el)) {
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
        error = new Error('Field does contain ' + data);
        return !expression
      } else {
        error = new Error('Field does not contain ' + data);
        return expression
      }
    };
  };

  this.checkbox = function(checked, callback, shouldBeChecked, self) {
    var XPath = self.namedSelectors.getXPath('field', checked);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function(err, el) {
      if(helper.exists(el)) {
        el.isSelected( function(err, selected) {
          if(selected != shouldBeChecked)
            // waitForElementEnabled clicks on things to make sure its
            // enabled already
            helper.waitForElementEnabled(el,5000,callback);
          else
            callback();
        });
      } else {
        callback.fail( errorElementDoesNotExists );
      }
    });
  };

  //not tested yet
  this.responseContain = function(text, callback, negate, self) {
    var XPath = self.namedSelectors.getXPath('content_contains',text);
    var browser = self.browser;
    var error;

    browser.waitForElementByXPath(XPath, function(err, el) {
      if( boolLambda(helper.exists(el)) )
        callback();
      else
        callback.fail(error);
    });

    function boolLambda(expression) {
      if(negate) {
        error = new Error('Response contains ' + text);
        return !expression
      } else {
        error = errorElementDoesNotExists;
        return expression
      }
    };
  };

  this.elementContains = function(text, element, callback, negate, self) {
    var XPath = self.namedSelectors.getXPath('tagname_content', text, element);
    var browser = self.browser;
    var error;

    browser.waitForElementByXPath(XPath, function(err, ele) {
      if( boolLambda(helper.exists(ele)) ) {
        callback();
      } else {
        callback.fail(error);
      }
    });

    function boolLambda(expression) {
      if(negate) {
        error = errorElementDoesNotExists;
        return !expression;
      } else {
        error = new Error('Element contains:' + text);
        return expression;
      }
    };
  };

  this.elementExists = function(element, callback, negate, self) {
    var XPath = self.namedSelectors.getXPath('tagname', null, element);
    var browser = self.browser;
    var error;

    browser.waitForElementByXPath(XPath, function(err, ele) {
      if( boolLambda(helper.exists(ele)) ) {
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
    var XPath;
    XPath = self.namedSelectors.getXPath('checkbox', title);
    self.browser.waitForElementByXPath(XPath, function(err, el) {
      if(helper.exists(el)){
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
      }

    });
  };

  this.isPresent = function(text, callback, self, present) {
    var XPath;
    XPath = self.namedSelectors.getXPath("content_contains", text);
    self.browser.waitForElementByXPath(XPath, self.asserters.isDisplayed, function(err, el) {
      if(helper.exists(el)) {
        if(present == "true"){
          callback();
        } else {
          callback.fail(new Error("Expected "+text+" to be present"));
        }
      } else {
        if(present == "false") {
          callback();
        } else {
          callback.fail(new Error("Expected "+text+" not to be present"))
        }
      }
    });
  };

  this.selectFrom = function(option, select, callback, self) {
    var XPathSelect = self.namedSelectors.getXPath('field', select);
    var XPathOption = self.namedSelectors.getXPath('option', option);
    var browser = self.browser;

    browser.waitForElementByXPath(XPathSelect, function (err, element){
      if(helper.exists(element)) {
        element.elementByXPath(XPathOption, function(err, el) {
          if(helper.exists(el)){
            // waitForElementEnabled clicks on things to make sure its
            // enabled already
            helper.waitForElementEnabled(el, 5000, callback);
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

  //not tested
  this.theURLShouldMatch = function(value, callback, self) {
    self.browser.url(function(err, url) {
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
      } else if(helper.exists(el)) {
        helper.waitForElementEnabled(el, 5000,function(error) {
          if (error && !isEnabled) {
            callback();
          } else if(!error && isEnabled) {
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

  //not tested
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

  //not tested
  this.attachFile = function(file, element, callback, self) {
    var XPath = self.namedSelectors.getXPath('file', element)
    self.browser.waitForElementByXPath(XPath, function(err, el) {
      if(helper.exists(el)) {
        // waitForElementEnabled clicks on things to make sure its
        // enabled already
        helper.waitForElementEnabled(ele,5000,function(err) {
            el.sendKeys(file,callback);
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
      if(helper.exists(el)) {
        // waitForElementEnabled clicks on things to make sure its
        // enabled already
        helper.waitForElementEnabled(el,5000,callback);
      } else {
        callback.fail(errorElementDoesNotExists);
      }
    });
  };

  this.iFollow = function(link, callback, self) {
    var XPath = self.namedSelectors.getXPath('link', link);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function (err, el) {
      if(helper.exists(el)) {
        // waitForElementEnabled clicks on things to make sure its
        // enabled already
        helper.waitForElementEnabled(el,5000,callback);
      } else {
        callback.fail(errorElementDoesNotExists);
      }
    });
  };

  //not tested
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
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    browser.waitForElementByXPath(XPath, function (err, el) {
      if(helper.exists(el)) {
        // waitForElementEnabled clicks on things to make sure its
        // enabled already
        helper.waitForElementEnabled(el,5000,callback);
      } else {
        callback.fail(err);
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

  this.searchAndClick = function(searchText, clickText, callback, self) {
    var XPath = self.namedSelectors.getXPath('node_with_content', searchText);
    var browser = self.browser;
    browser.waitForElementByXPath(XPath, function(err, el) {
      if(err) {
        callback.fail(err);
      } else {
        clickableEle(el, clickText, callback);
      }
    });

    function clickableEle(el, text, callback){
      var XPath = self.namedSelectors.getXPath('node_with_content', text);
      el.elementByXPath(XPath, function(err, ele) {
        if(err) {
          el.elementByXPath('..', function(err, eleParent) {
            if(err != null && err != undefined) {
              callback.fail(err);
            } else if(false) {
              callback.fail(new Error('Element not found with in order'));
            } else {
              eleParent.getTagName(function(er,t) {
                clickableEle(eleParent, text, callback);
              });
            }
          });
        } else {
          // waitForElementEnabled clicks on things to make sure its
          // enabled already
          helper.waitForElementEnabled(ele,5000,callback);
        }
      });
    }
  };

};

exports.MapSteps = new MapSteps();