/*

  - This file is for testing individual cases and debuging.

*/

var mapSteps = require('../lib/map-steps').MapSteps,
  wd = require('wd'),
  url = require('url'),
  assert = require('assert'),
  sinon = require('sinon'),
  should = require('should'),
  Q = require('q'),
  baseUrl = 'http://192.168.99.99:2999/',
  helper = require("../lib/helper").Helper;
namedSelectors = {
  'fieldset': ".//fieldset[(./@id = %locator% or .//legend[contains(normalize-space(string(.)), %locator%)])]",
  'field': ".//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')][(((./@id = %locator% or ./@name = %locator%) or ./@id = //label[contains(normalize-space(string(.)), %locator%)]/@for) or ./@placeholder = %locator%)] | .//label[contains(normalize-space(string(.)), %locator%)]//.//*[self::input | self::textarea | self::select][not(./@type = 'submit' or ./@type = 'image' or ./@type = 'hidden')]",
  'link': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//*[./@role = 'link'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
  'button': ".//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[((((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[./@role = 'button'][(((./@id = %locator% or ./@name = %locator%) or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
  'link_or_button': ".//a[./@href][(((./@id = %locator% or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%) or contains(./@rel, %locator%)) or .//img[contains(./@alt, %locator%)])] | .//input[./@type = 'submit' or ./@type = 'image' or ./@type = 'button'][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//button[(((./@id = %locator% or contains(./@value, %locator%)) or contains(normalize-space(string(.)), %locator%)) or contains(./@title, %locator%))] | .//input[./@type = 'image'][contains(./@alt, %locator%)] | .//*[(./@role = 'button' or ./@role = 'link')][((./@id = %locator% or contains(./@value, %locator%)) or contains(./@title, %locator%) or contains(normalize-space(string(.)), %locator%))]",
  'content_contains': "./descendant-or-self::*[contains(normalize-space(.), %locator%) and count(*)=0]",
  'content_equals': "./descendant-or-self::*[normalize-space(.)=%locator% and count(*)=0]",
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

  afterEach(function() {
    selfMock.browser.quit();
  });


  describe('fillIn', function() {
    it('should call resolved()', function(done) {

      test = function(val) {
        console.log('TEST CALL:', val);
        val.should.equal('resolved');
        done();
      };

      mapSteps.iGoToHomepage(selfMock)
        .then(
          function resolve() {
            return mapSteps.fillIn('Test Field:', 'test data', selfMock);
          },
          function reject(err) {
            test('rejected');
          }
        ).then(
          function resolve() {
            return test('resolved');
          },
          function reject(err) {
            return test('rejected');
          }
        );

    });

  });

});