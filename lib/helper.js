wd = require('wd');

//// Helper functions
Helper = function() {

  browser = wd.promiseChainRemote();
  asserters = wd.asserters;

	this.exists = function (parameter) {
    return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
  };

  this.isElementEnabled = function(element){
    return browser.isEnabled(element) && browser.isDisplayed(element);
  };

  this.waitForElementEnabled = function(XpathExpression, pollFreq, timeOut, callback){
    var targetElement = browser.elementByXPath(XpathExpression);

    if( this.exists(targetElement) ) {
      browser.waitForElementByXPath(
        XpathExpression,
        asserters.jsCondition(this.isElementEnabled(targetElement)),
        pollFreq,
        timeOut,
        callback
      );
    }
  };

};

exports.Helper = new Helper();