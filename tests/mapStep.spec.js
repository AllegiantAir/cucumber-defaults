var mapSteps = require('../lib/map-steps').MapSteps,
    wd = require('wd'),
    url = require('url'),
    chain = require('../lib/chain').Chain,
    assert = require('assert'),
    sinon = require('sinon'),
    should = require('should'),
    Q = require('q'),
    baseUrl = 'http://localhost:2999',
    namedSelectors = {
        'fieldset': ".//fieldset[(./@id = %locator% or .//legend[contains(normalize-space(string(.)), %locator%)])]",
        'field': ".//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')]",
        'link': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//*[./@role = 'link'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'button': ".//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[((((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[./@role = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'link_or_button': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[(((./@id = %locator% or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[(./@role = 'button' or ./@role = 'link')][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
        'content': "./descendant-or-self::*[contains(normalize-space(.), %locator%)]",
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

  beforeEach(function () {
    deferCallback = Q.defer();

    callbackMock = function() {
      deferCallback.resolve(Q.fcall(function(){
        return test('callback');
      }));
    };
    callbackMock.pending = function() {
      deferCallback.resolve(Q.fcall(function(){
        test('pending');
      }));
    };
    callbackMock.fail = function() {
      deferCallback.resolve(Q.fcall(function(){
        test('fail');
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

  // afterEach(function(done) {
  //   selfMock.browser.quit(function() {
  //     done();
  //   });
  // });

  describe('iGoToHomepage', function() {

    it.skip('should call callback()', function() {
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
    it.skip('should call callback()', function() {
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

    it.skip('should call callback()', function() {
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
        ['Test Field: Placeholder', 'test data', callbackMock, selfMock, mapSteps.fillIn]
      ]);

      return deferCallback.promise;
    });

    it.skip('should call callback.fail()', function() {
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

    it.skip('should call callback()', function() {
      var defer = Q.defer();

      test = function(callbackValue) {
        callbackValue.should.equal('callback');  
        selfMock.browser.url(function(err, url){
          url.should.equal('/#/view/2');
          defer.reslove();
        });

        return defer.promise;
      };

      chain([
        ['cb', selfMock, mapSteps.iGoToHomepage],
        ['Boeing','View', callbackMock, selfMock, mapSteps.searchAndClick]
      ]);

      return deferCallback.promise;
    });
  });

});