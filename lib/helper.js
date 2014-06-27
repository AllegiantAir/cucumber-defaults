wd = require('wd');

var helper;

//// Helper functions
Helper = function() {

  var browser = wd.promiseChainRemote(),
      asserters = wd.asserters;

	this.exists = function (parameter) {
    return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
  };

  this.isElementEnabled = function(element, callback){
    element.isDisplayed(function(err, displayed) {
      if(!displayed) {
        callback(err, displayed);
      } else {
        // check if it has the attribute disabled with value disabled
        element.getAttribute('disabled', function(err, disabled) {
          if(disabled) {
            callback(err, !disabled);
          } else {
            // check if you can click it
            element.click(function(err) {
              if(err) {
                callback(err, false);
              } else {
                callback(err, true);
              }
            });
          }
        });
      }
    });
  };

  this.waitForElementEnabled = function(XPath, timeOut, pollFreq, callback) {
    var startTime = (new Date()).getTime();

    browser.elementByXPath(XPath, function(err, el) {
      var interval = setInterval(function(){
        helper.isElementEnabled(el, function(err, enabled) {
            if(enabled) {
              clearInterval(interval);
              callback();
            }

            if ( ((new Date()).getTime() - startTime) > timeOut ) {
              clearInterval(interval);
              callback(new Error('Element enable timed out'));
            }
          });
      }, pollFreq);
    });

  };

};

helper = new Helper();

exports.Helper = helper;