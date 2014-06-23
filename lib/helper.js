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

  /*
  // No need for a waitForCss helper functions, use the function bellow:

  browser.waitForElementByCssSelector(
      '#something' // css expression'
      asserters.isDisplayed, // condition we are waiting for, defined asserters can be used
      2000, //timeout, default is 1000ms
      200, //pollFreq, default is 100ms
      function(err, element){
          // TODO
      }
  );

  //checkout defined asserters at: https://github.com/admc/wd/blob/master/lib/asserters.js
  //custom asserters can be written if necessary, see: https://github.com/admc/wd/blob/master/examples/promise/wait-for-custom.js
  */

  this.waitForElementEnabled = function(XpathExpression, pollFreq, timeOut, callback){
    var targetElement = browser.elementByXPath(XpathExpression);

    if( this.exists(targetElement) ) {
      browser.waitForElementByXPath(
        XpathExpression,
        asserters.jsCondition('this.isElementEnabled(targetElement)'),
        pollFreq,
        timeOut,
        callback
      );
    }
  };

};

exports.Helper = new Helper();