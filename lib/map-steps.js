var helper = require("./helper.js").Helper,
    Q = require('q');

MapSteps = function () {
  var errorElementDoesNotExists = new Error('Element does not exist!');
  var mapSteps = this;

  this.fillIn = function(field, data, self) {
      var XPath = self.namedSelectors.getXPath('field', field);
      var browser = self.browser;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function (err, el) {
            if (err || (el == null) ) {
              reject(err);
            } else {
              helper.waitForElementEnabled(el, 5000, function(err) {
                if (err){
                  reject(err);
                } else {
                  el.clear(function(err) {
                    if (err) {
                      reject(err);
                    } else {
                      browser.type(el, data, function(err) {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
      });
  };

  this.waitForTextPresent = function(text, timeout, self) {
    var startTime = (new Date()).getTime();
    return Q.Promise(function(resolve, reject, notify) {
        function loopForPresentText() {
          mapSteps.isTextPresent(text, self).then(
            function() {
              resolve();
            },
            function(reason) {
              if( (new Date()).getTime() - startTime > timeout ) {
                reject(new Error('Text present timed out'));
              } else {
                loopForPresentText();
              }
            }
          );
        }

        loopForPresentText();
    });
  }

  this.isTextPresent = function(text, self){
    var XPath = self.namedSelectors.getXPath("content_contains", text);

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.waitForElementByXPath(XPath, self.asserters.isDisplayed, function(err, el) {
        if (helper.exists(el) && ! err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };

  this.keyHit = function(key, self) {
    return Q.Promise(function(resolve, reject, notify) {
      self.browser.keys(self.specialKeys[key], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  this.shouldFindBothInTheSameRow = function(textOne, textTwo, parentElement, self) {
    var XPath = self.namedSelectors.getXPath('node_with_content', textOne);
    var browser = self.browser;

    return Q.Promise(function(resolve, reject, notify) {

      browser.waitForElementByXPath(XPath, function(err, el) {
        if(err) {
          reject(err);
        } else {
          findParent(el);
        }
      });

      function findParent(el){
        var XPath = self.namedSelectors.getXPath('node_with_content', textTwo);
        el.elementByXPath(XPath, function(err, ele) {
          // If we didn't find the element that contains our text
          if(err || !ele) {
            // Get the parent element
            el.elementByXPath('..', function(err, eleParent) {
              // If there is no parent element then we are at root
              // and the text does not exists
              if(err || !eleParent) {
                reject(err);
              } else {
                // Find the text in our parent function
                findParent(eleParent);
              }
            });
          } else {
            // We found our element, ele that contains
            // our text!
            el.getTagName(function(err, name) {
              if(err || name != parentElement) {
                //reject(err);
                el.elementByXPath('..', function(err, eleParent) {
                  // If there is no parent element then we are at root
                  // and the text does not exists
                  if(err || !eleParent) {
                    reject(err);
                  } else {
                    // Find the text in our parent function
                    findParent(eleParent);
                  }
                });
              } else {
                resolve();
              }
            });
          }
        });
      } 

    });

  };

  this.clearField = function(field, self) {
      var XPath = self.namedSelectors.getXPath('field', field);
      var browser = self.browser;

      return Q.Promise(function(resolve, reject, notify) {

          browser.waitForElementByXPath(XPath, function(err, ele) {
              if (helper.exists(ele)) {
                  ele.clear(function(err){
                      resolve();
                  });
              } else {
                  reject(err);
              }
          });

      });
  };

  this.fieldExists = function(field, negate, self) {
      var error;
      var XPath = self.namedSelectors.getXPath('field', field);
      var browser = self.browser;

      return Q.Promise(function(resolve, reject, notify) {
         browser.waitForElementByXPath(XPath, function(err, ele) {
              if (negateBool(helper.exists(ele))) {
                  resolve();
              } else {
                  reject(error);
              }
          });
      });

      function negateBool(condition) {
        if (negate) {
          error = new Error("Field " + field + " is not supposed to exist.");
          return !condition;
        } else {
          error = new Error("Field " + field + " is supposed to exist.");
          return condition;
        }

      }
  };

  this.fieldShouldHaveValue = function(field, value, shouldHave, self) {
      var XPath = self.namedSelectors.getXPath('field', field);
      var browser = self.browser;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function(err, ele) {
              if (helper.exists(ele)) {
                  ele.getValue(function(err, elementValue) {
                      if (negate(elementValue == value)) {
                          resolve();
                      } else {
                          reject(err);
                      }
                  });
              } else {
                  reject(err);
              }
          });
      });

      function negate(condition) {
        if (shouldHave) {
          return condition;
        }
        return !condition;
      }
  };

  this.fieldContains = function(data, field, negate, self) {
      var XPath = self.namedSelectors.getXPath('field', field);
      var browser = self.browser;
      var error;

      return Q.Promise(function(resolve, reject, notify) {
         browser.waitForElementByXPath(XPath, function(err, el) {
            if (helper.exists(el)) {
              el.getValue(function (err, text) {
                if ( boolLambda( text == data)) {
                  resolve();
                } else {
                      reject(error);
                      }
                  })
              } else {
                  reject(errorElementDoesNotExists)
              }

          });
      });

      function boolLambda(expression) {
          if (negate) {
              error = new Error('Field does contain ' + data);
              return !expression
          } else {
              error = new Error('Field does not contain ' + data);
              return expression
          }
      };
  };

  this.checkbox = function(checked, shouldBeChecked, self) {
      var XPath = self.namedSelectors.getXPath('field', checked);
      var browser = self.browser;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function(err, el) {
              if (helper.exists(el)) {
                  el.isSelected( function(err, selected) {
                      if (selected != shouldBeChecked) {
                          // waitForElementEnabled clicks on things to make sure its
                          // enabled already
                          helper.waitForElementEnabled(el,5000, function(err) {
                              if (err) {
                                reject(err);
                              } else {
                                resolve();
                              }
                          });
                      } else {
                          resolve();
                      }
                  });
              } else {
                  reject( errorElementDoesNotExists );
              }
          });
      });
  };

  //not tested yet
  this.responseContain = function(text, negate, self) {
      var XPath = self.namedSelectors.getXPath('content_contains',text);
      var browser = self.browser;
      var error;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function(err, el) {
              if ( boolLambda(helper.exists(el)) ) {
                  resolve();
              } else {
                  reject(error);
              }
          });
      });

      function boolLambda(expression) {
          if (negate) {
              error = new Error('Response contains ' + text);
              return !expression
          } else {
              error = errorElementDoesNotExists;
              return expression
          }
      };
  };

  this.elementContains = function(text, element, negate, self) {
      var XPath = self.namedSelectors.getXPath('tagname_content', text, element);
      var browser = self.browser;
      var error;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function(err, ele) {
              if ( boolLambda(helper.exists(ele)) ) {
                  resolve();
              } else {
                  reject(error);
              }
          });
      });

      function boolLambda(expression) {
          if (negate) {
              error = errorElementDoesNotExists;
              return !expression;
          } else {
              error = new Error('Element contains:' + text);
              return expression;
          }
      };
  };

  this.elementExists = function(element, negate, self) {
      var XPath = self.namedSelectors.getXPath('tagname', null, element);
      var browser = self.browser;
      var error;

      return Q.Promise(function(resolve, reject, notify) {
          browser.waitForElementByXPath(XPath, function(err, ele) {
              if ( boolLambda(helper.exists(ele)) ) {
                  resolve();
              } else {
                  reject(error);
              }
          });
      });

      function boolLambda(expression) {
          if (negate) {
              error = errorElementDoesNotExists;
              return !expression
          } else {
              error = new Error('Element should not exist.');
              return expression;
          }
      };
  };

  this.hasFocus = function(field, negate, self) {

      return Q.Promise(function(resolve, reject, notify) {
          self.browser.active(
          function (err, activeElement) {
              if (err) {
                reject(err);
              } else {
                self.browser.waitForElementByXPath(
                self.namedSelectors.getXPath('field', field),
                function (err, fieldElement) {
                    if(err) {
                      reject(err);
                    } else {
                      fieldElement.equals(
                      activeElement,
                      function (err, theSame) {
                          if (err) {
                              reject(err);
                          } else if (negateBool(theSame)) {
                              resolve();
                          } else {
                              reject(error);
                          }
                      });
                    }
                });
              }
          });
      });

      function negateBool(condition) {
          if (negate) {
              error = 'field (' + field + ') has focus';
              return !condition
          } else {
              error = 'field (' + field + ') doesn\'t have focus';
              return condition
          }
      }
  };

  this.isChecked = function(title, self, value) {
      var XPath;
      XPath = self.namedSelectors.getXPath('checkbox', title);

      return Q.Promise(function(resolve, reject, notify) {
          self.browser.waitForElementByXPath(XPath, function(err, el) {
              if (helper.exists(el)){
                el.getAttribute('checked', function(err, checked) {
                    if (checked == value) {
                      resolve();
                    } else {
                      if (value == 'true') {
                          reject(new Error("Expected " + title + " to be checked"));
                      } else {
                          reject(new Error("Expected " + title + " to be unchecked"));
                      }
                    }
                });
              }
          });
      });
  };

  this.isPresent = function(text, self, present) {
    var XPath;
    XPath = self.namedSelectors.getXPath("content_contains", text);

    return Q.Promise(function(resolve, reject, notify) {
       self.browser.waitForElementByXPath(XPath, self.asserters.isDisplayed, function(err, el) {
        if (helper.exists(el)) {
          if (present == "true"){
            resolve();
          } else {
            reject(new Error("Expected "+text+" not to be present"));
          }
        } else {
          if (present == "false") {
            resolve();
          } else {
            reject(new Error("Expected "+text+" to be present"))
          }
        }
      });
    });
  };

  this.selectFrom = function(option, select, self) {
    var XPathSelect = self.namedSelectors.getXPath('field', select);
    var XPathOption = self.namedSelectors.getXPath('option', option);
    var browser = self.browser;

    return Q.Promise(function(resolve, reject, notify) {
        browser.waitForElementByXPath(XPathSelect, function (err, element){
        if (helper.exists(element)) {
          element.elementByXPath(XPathOption, function(err, el) {
            if (helper.exists(el)){
              // waitForElementEnabled clicks on things to make sure its
              // enabled already
              helper.waitForElementEnabled(el, 5000, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            } else {
              reject(errorElementDoesNotExists);
            }
          });
        } else {
          reject(errorElementDoesNotExists);
        }
      });
    });
  };

  //not tested
  this.theURLShouldMatch = function(value, self) {

    return Q.Promise(function(resolve, reject, notify) {
        self.browser.url(function(err, url) {
        var currentUrl = "'"+ url + "'";
        if (currentUrl.indexOf(value) != -1) {
          resolve();
        } else {
          reject(new Error("Expected "+ currentUrl +" to include " + value));
        }
      });
    });
  };

  this.iShouldSeeNElements = function(count, element, self) {

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.waitForElementsByCssSelector(element, function(err, els) {
        if (els.length == count) {
          resolve();
        } else {
          reject(new Error("Expected "+count+" "+element+" to exist. Instead of "+els.length+" " +element))
        }
      });
    });
  };

  this.theButtonShouldBe = function(button, enDis, self) {
    var XPath = self.namedSelectors.getXPath('button', button);
    var browser = self.browser;
    var isEnabled = ('en' == enDis);

    return Q.Promise(function(resolve, reject, notify) {
       browser.waitForElementByXPath(XPath, function (err, el) {
        if (err) {
          reject(err);
        } else if (helper.exists(el)) {
          helper.waitForElementEnabled(el, 5000,function(error) {
            if (error && !isEnabled) {
              resolve();
            } else if(!error && isEnabled) {
              resolve();
            } else {
              reject('button (' + button + ') should be ' + enDis + 'abled');
            }
          });
        } else {
          reject(errorElementDoesNotExists);
        }
      });
    });
  };

  //not tested
  this.shouldBeOn = function(uri, self) {

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.url( function(err, url) {
        if (url == self.url(uri)) {
          resolve();
        } else {
          reject(
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
  };

  //not tested
  this.attachFile = function(file, element, self) {
    var XPath = self.namedSelectors.getXPath('file', element);

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.waitForElementByXPath(XPath, function(err, el) {
        if(helper.exists(el)) {
          // waitForElementEnabled clicks on things to make sure its
          // enabled already
          helper.waitForElementEnabled(ele, 5000, function(err) {
            if (err) {
              reject(err);
            } else {
              el.sendKeys(file, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }

          });
        } else {
            reject(errorElementDoesNotExists);
        }
      });
    });
  };

  this.iPress = function(button, self) {
    var XPath = self.namedSelectors.getXPath('button', button);
    var browser = self.browser;

    return Q.Promise(function(resolve, reject, notify) {
      browser.waitForElementByXPath(XPath, function (err, el) {
        if (helper.exists(el)) {
          // waitForElementEnabled clicks on things to make sure its
          // enabled already
          helper.waitForElementEnabled(el, 5000, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          reject(errorElementDoesNotExists);
        }
      });
    });
  };

  this.iFollow = function(link, self) {
    var XPath = self.namedSelectors.getXPath('link', link);
    var browser = self.browser;

    return Q.Promise(function(resolve, reject, notify) {
      browser.waitForElementByXPath(XPath, function (err, el) {
        if (helper.exists(el)) {
          // waitForElementEnabled clicks on things to make sure its
          // enabled already
          helper.waitForElementEnabled(el, 5000, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          reject(errorElementDoesNotExists);
        }
      });
    });
  };

  //TODO not tested - not refactored
  this.iFillInTheFollowing = function(dataTable, self) {
    var arrayQ = [];
    // This is the code you suggested to sent me
    dataTable.raw().reverse().forEach(function (row) {
        arrayQ.push(mapSteps.fillIn(row[0],row[1],self));
    });

    return Q.all(arrayQ);
  };

  this.iFocusOn = function(field, self) {
    var XPath = self.namedSelectors.getXPath('field', field);
    var browser = self.browser;

    return Q.Promise(function(resolve, reject, notify) {
      browser.waitForElementByXPath(XPath, function (err, el) {
        if (helper.exists(el)) {
          // waitForElementEnabled clicks on things to make sure its
          // enabled already
          helper.waitForElementEnabled(el, 5000, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          reject(errorElementDoesNotExists);
        }
      });
    });
  };

  this.iGoToHomepage = function(self) {
    /* @TODO: make clean up the world url finagler to support 'sub-baseUrls' */
    return Q.Promise(function(resolve, reject, notify) {
        self.browser.get(self.baseUrl, function(err) {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
  };

  this.iGoToUrl = function(url, self) {
    return Q.Promise(
      function(resolve, reject) {
        self.browser.get(self.url(url), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    );
  };

  this.reloadPage = function(self) {
    return Q.Promise(
      function(resolve, reject) {
        self.browser.url(function(err, url) {
          if (err) {
            reject(err);
          } else {
            resolve( mapSteps.iGoToUrl(url, self) );
          }
        });
      }
    );
  };

  this.goBackOnePage = function(self) {

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.back(function(err) {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  this.goForwardOnePage = function(self) {

    return Q.Promise(function(resolve, reject, notify) {
      self.browser.forward(function(err) {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  this.searchAndClick = function(searchText, clickText, self) {
    var XPath = self.namedSelectors.getXPath('node_with_content', searchText);
    var browser = self.browser;
    var startTime = (new Date()).getTime();

    return Q.Promise(function(resolve, reject, notify) {
      
      // In case we need time to find element because of splash
      // or loading
      function loopForElement() {
        browser.waitForElementByXPath(XPath, function(err, el) {
          if(err || !el) {
            if((new Date()).getTime() - startTime < 5000) {
              loopForElement();
            } else {
              reject(err);
            }
          } else {
            clickableEle(el);
          }
        });
      };

      loopForElement();

      function clickableEle(el) {
        var XPath = self.namedSelectors.getXPath('node_with_content', clickText);
        el.elementByXPath(XPath, function(err, ele) {
          if(err || !ele) {
            el.elementByXPath('..', function(err, eleParent) {
              if(err || !eleParent) {
                reject(err);
              } else {
                clickableEle(eleParent);
              }
            });
          } else {
            // waitForElementEnabled clicks on things to make sure its
            // enabled already
            helper.waitForElementEnabled(ele, 5000, function(err) {
              if(err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        });
      }

    });
  };

};

exports.MapSteps = new MapSteps();