var mapSteps = require('../lib/map-steps').MapSteps,
  wd = require('wd'),
  url = require('url'),
  chain = require('npm-chain').Chain,
  assert = require('assert'),
  sinon = require('sinon'),
  should = require('should'),
  Q = require('q'),
  baseUrl = 'http://localhost:2999',
  helper = require("../lib/helper").Helper;
  namedSelectors = {
    'fieldset': ".//fieldset[(./@id = %locator% or .//legend[contains(normalize-space(string(.)), %locator%)])]",
    'field': ".//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')]",
    'link': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//*[./@role = 'link'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
    'button': ".//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[((((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[./@role = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
    'link_or_button': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[(((./@id = %locator% or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[(./@role = 'button' or ./@role = 'link')][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
    'content': "./descendant-or-self::*[contains(normalize-space(.), %locator%)]",
    'node_with_content': "./descendant-or-self::text()[contains(normalize-space(.), %locator%)]/..",
    'tagname_content': ".//%tagname%[contains(normalize-space(.), %locator%)]",
    'select': ".//select[(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//select",
    'checkbox': ".//input[./@type = 'checkbox'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'checkbox']",
    'radio': ".//input[./@type = 'radio'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'radio']",
    'file': ".//input[./@type = 'file'][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//input[./@type = 'file']",
    'optgroup': ".//optgroup[contains(./@label, %locator%)]",
    'option': ".//option[(./@value = %locator% or contains(normalize-space(string(.)), %locator%))]",
    'table': ".//table[(./@id = %locator% or contains(.//caption, %locator%))]",
    'tagname': ".//%tagname%",

    getXPath: function (type, locator, tagname) {
      if (tagname && locator) {
        var XPath = this[type].replace(/%locator%/g, "'" + locator + "'");
        return XPath.replace(/%tagname%/, tagname);
      }

      if (tagname) {
        return this[type].replace(/%tagname%/, tagname);
      }

      return this[type].replace(/%locator%/g, "'" + locator + "'");
    }
  };

describe('Map Steps', function() {
  var selfMock,
    deferCallback,
    callbackMock,
    test,
    browser = wd.promiseChainRemote();

  this.timeout(5000);

  beforeEach(function () {
    deferCallback = Q.defer();

    callbackMock = function() {
      deferCallback.resolve(Q.fcall(function(){
        return test('callback');
      }));
    };

    callbackMock.pending = function() {
      deferCallback.resolve(Q.fcall(function(){
        return test('pending');
      }));
    };

    callbackMock.fail = function() {
      deferCallback.resolve(Q.fcall(function(){
        return test('fail');
      }));
    };

    selfMock = {
      asserters: wd.asserters,
      url: function (uri) {
        return url.resolve(baseUrl, uri);
      },
      namedSelectors: namedSelectors,
      baseUrl: baseUrl,
      browser: browser.init({
        browserName: 'chrome'
      })
    };

    return selfMock.browser;
  });

  afterEach(function(done) {
      selfMock.browser.quit(function() {
          done();
      });
  });

  describe('helper functions', function() {

    describe('waitForElementEnabled', function() {

      it('should pass after 500 ms', function(done) {
        var XPathElementVisible = selfMock.namedSelectors.getXPath('field', 'Visible field:');
        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElementVisible, function(err, ele) {
            helper.waitForElementEnabled(ele, 1000, function(err) {
              if(err) {
                console.log(err);
                throw new Error('should have passed');
              }

              done();
            });
          });
        },selfMock);
      });

      it('should fail before 500 ms', function(done) {
        var XPathElementVisible = selfMock.namedSelectors.getXPath('field', 'Visible field:');
        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElementVisible, function(err, ele) {
            helper.waitForElementEnabled(ele, 250, function(err) {
              if(!err) {
                throw new Error('should have failed');
              } 

              done();
            });
          });
        },selfMock);
      });

    });

    describe('isElementEnabled', function(done) {

      it('Visible field: should be disabled before 500 ms', function(done) {

        var XPathElement = selfMock.namedSelectors.getXPath('field', 'Visible field:');

        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElement, function(err, ele) {
            setTimeout(function() {
              helper.isElementEnabled(ele, function(err, value) {
                value.should.be.false;
                done();
              });
            }, 250);
          });
        },selfMock);

      });

      it('Visible field: should be enabled after 500 ms', function(done) {

        var XPathElement = selfMock.namedSelectors.getXPath('field', 'Visible field:');

        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElement, function(err, ele) {
            setTimeout(function() {
              helper.isElementEnabled(ele, function(err, value) {
                value.should.be.true;
                done();
              });
            }, 750);
          });
        },selfMock);

      });

      it('Disabled field: should be disabled after 500 ms', function(done) {

        var XPathElement = selfMock.namedSelectors.getXPath('field', 'Disabled field:');

        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElement, function(err, ele) {
            setTimeout(function() {
              helper.isElementEnabled(ele, function(err, value) {
                value.should.be.false;
                done();
              });
            }, 750);
          });
        },selfMock);

      });

      it('Delayed field: should be enabled after 1000 seconds', function(done) {

        var XPathElement = selfMock.namedSelectors.getXPath('field', 'Delayed field:');

        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElement, function(err, ele) {
            setTimeout(function() {
              helper.isElementEnabled(ele, function(err, value) {
                value.should.be.true;
                done();
              });
            }, 1250);
          });
        },selfMock);

      });

      it('Delayed field: should be disabled before 1000 seconds', function(done) {

        var XPathElement = selfMock.namedSelectors.getXPath('field', 'Delayed field:');

        mapSteps.iGoToHomepage(function() {
          browser.waitForElementByXPath(XPathElement, function(err, ele) {
            setTimeout(function() {
              helper.isElementEnabled(ele, function(err, value) {
                value.should.be.false;
                done();
              });
            }, 750);
          });
        },selfMock);

      });

    });

  });

  describe('iGoToHomepage', function() {

    it('should call callback()', function() {
      // Test gets executed when either of the following gets called:
      // callback(); -----------> callbackValue = 'callback'
      // callback.pending(); ---> callbackValue = 'pending'
      // callback.fail(); ------> callbackValue = 'fail'
      //
      // callbackValue denotes which of the above was called
      test = function(callbackValue) {
        callbackValue.should.equal('callback');
      };

      // Map Steps is asynchronous so we need to return
      // a promise that will then test our assertions.
      mapSteps.iGoToHomepage(callbackMock, selfMock);

      return deferCallback.promise;
    });

  });

  describe('fillIn', function() {
    it('should call callback()', function() {
      // Test gets executed when either of the following gets called:
      // callback(); -----------> callbackValue = 'callback'
      // callback.pending(); ---> callbackValue = 'pending'
      // callback.fail(); ------> callbackValue = 'fail'
      //
      // callbackValue denotes which of the above was called
      test = function(callbackValue) {
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Test Field:', 'test data', callbackMock, selfMock, mapSteps.fillIn]
      ]);

      return deferCallback.promise;
    });

    it('should call callback.fail()', function() {
      // Test gets executed when either of the following gets called:
      // callback(); -----------> callbackValue = 'callback'
      // callback.pending(); ---> callbackValue = 'pending'
      // callback.fail(); ------> callbackValue = 'fail'
      //
      // callbackValue denotes which of the above was called
      test = function(callbackValue) {
        callbackValue.should.equal('fail');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Test Field Should Not Exists:', 'test data', callbackMock, selfMock, mapSteps.fillIn]
      ]);

      return deferCallback.promise;
    });
  });

  describe('fieldExists', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['<div class="panel-body">inputField</div>', callbackMock, true, selfMock, mapSteps.fieldExists]
      ]);

      return deferCallback.promise;
    });

    it('should call callback.fail()', function() {
      // Test gets executed when either of the following gets called:
      // callback(); -----------> callbackValue = 'callback'
      // callback.pending(); ---> callbackValue = 'pending'
      // callback.fail(); ------> callbackValue = 'fail'
      //
      // callbackValue denotes which of the above was called
      test = function(callbackValue) {
        callbackValue.should.equal('fail');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['inputField2', callbackMock, false, selfMock, mapSteps.fieldExists]
      ]);

      return deferCallback.promise;
    });
  });

  describe('fieldContains', function(){

    it('should call callback()', function(){

      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['This is a test for field contains', 'Text Area Test', callbackMock, false, selfMock, mapSteps.fieldContains]
      ]);

      return deferCallback.promise;
    });
  });

  describe('checkbox', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Checkbox test:', callbackMock, true, selfMock, mapSteps.checkbox]
      ]);

      return deferCallback.promise;
    });
  });

  describe('elementExists', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['<textarea></textarea>', callbackMock, true, selfMock, mapSteps.elementExists]
      ]);

      return deferCallback.promise;
    });
  });

  describe('elementContains', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['This is a test for field contains', '#textAreaTest', callbackMock, true, selfMock, mapSteps.elementContains]
      ]);

      return deferCallback.promise;
    })
  });

  describe('hasFocus', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Input field:', callbackMock, true, selfMock, mapSteps.hasFocus]
      ]);

      return deferCallback.promise;
    });

  });

  describe('isChecked', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Checkbox test:', callbackMock, selfMock, 'true', mapSteps.isChecked]
      ]);

      return deferCallback.promise;
    })
  });

  describe('isPresent', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['#textAreaTest This is a test for field contains', callbackMock, selfMock, true, mapSteps.isPresent]
      ]);

      return deferCallback.promise;
    });
  });

  describe('selectFrom', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['nodejs','Select Element Unit Test', callbackMock, selfMock, mapSteps.selectFrom]
      ]);

      return deferCallback.promise;
    });
  });

  describe('iShouldSeeNElements', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        [3, "ul#listForNElements li", callbackMock, selfMock, mapSteps.iShouldSeeNElements]
      ]);

      return deferCallback.promise;
    });
  });

  describe('theButtonShouldBe', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['buttonUnitTest','en', callbackMock, selfMock, mapSteps.theButtonShouldBe]
      ]);

      return deferCallback.promise;
    });

    it('should call callback().fail', function(){
      test = function(callbackValue){
        callbackValue.should.equal('fail');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['buttonUnitTest','dis', callbackMock, selfMock, mapSteps.theButtonShouldBe]
      ]);

      return deferCallback.promise;
    });
  });

  describe('iPress', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['buttonUnitTest', callbackMock, selfMock, mapSteps.iPress]
      ]);

      return deferCallback.promise;
    });
  });

  describe('iFollow', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['linkUnitTest', callbackMock, selfMock, mapSteps.iFollow]
      ]);

      return deferCallback.promise;
    });
  });

  describe('iFocusOn', function(){
    it('should call callback()', function(){
      test = function(callbackValue){
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['fieldExists', callbackMock, selfMock, mapSteps.iFocusOn]
      ]);

      return deferCallback.promise;
    });
  });

  describe('iGoToUrl', function() {
    it('should call callback()', function() {
      var defer = Q.defer();

      test = function(callbackValue) {
        callbackValue.should.equal('callback');
        selfMock.browser.url(function(err, url){
          url.should.equal(baseUrl + '/#/view/7');
          defer.resolve();
        });

        return defer.promise;
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['/#/view/7', callbackMock, selfMock, mapSteps.iGoToUrl]
      ]);

      return deferCallback.promise;
    });
  });

  describe('reloadPage', function() {
    it('should call callback()', function() {

      test = function(callbackValue) {
        callbackValue.should.equal('callback');
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        [callbackMock, selfMock, mapSteps.reloadPage]
      ]);

      return deferCallback.promise;
    });
  });

  describe('goBackOnePage', function() {
    it('should call callback()', function() {
      var defer = Q.defer();

      test = function(callbackValue) {
        callbackValue.should.equal('callback');
        selfMock.browser.url(function(err, url){
          url.should.equal(baseUrl + '/');
          defer.resolve();
        });

        return defer.promise;
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['/#/view/7', 'cb', selfMock, mapSteps.iGoToUrl],
        [callbackMock, selfMock, mapSteps.goBackOnePage]
      ]);

      return deferCallback.promise;
    });
  });

  describe('goForwardOnePage', function() {
    it('should call callback()', function() {
      var defer = Q.defer();

      test = function(callbackValue) {
        callbackValue.should.equal('callback');
        selfMock.browser.url(function(err, url){
          url.should.equal(baseUrl + '/#/view/7');
          defer.resolve();
        });

        return defer.promise;
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['/#/view/7', 'cb', selfMock, mapSteps.iGoToUrl],
        ['cb', selfMock, mapSteps.goBackOnePage],
        [callbackMock, selfMock, mapSteps.goForwardOnePage]
      ]);

      return deferCallback.promise;
    });
  });

  describe('searchAndClick', function() {
    it('should call callback()', function() {
      var defer = Q.defer();
      test = function(callbackValue) {
        callbackValue.should.equal('callback');
        selfMock.browser.url(function(err, url){
          url.should.equal(baseUrl + '/#/view/7');
          defer.resolve();
        });

        return defer.promise;
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Honeywell','View', callbackMock, selfMock, mapSteps.searchAndClick]
      ]);

      return deferCallback.promise;
    });
  });

});