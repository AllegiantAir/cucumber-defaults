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

  this.waitForElementEnabled = function(element, timeOut, callback){
    var startTime = (new Date()).getTime();
    var interval = function() {
        // This needs to be processed in our event loop
        setTimeout(function() {
          helper.isElementEnabled(element, function(err, enabled) {
              if(enabled) {
                callback();
              } else if ( ((new Date()).getTime() - startTime) > timeOut) {
                callback(new Error('Element enable timed out'));
              } else {
                interval();
              }
            });
        },0);
      };
    interval();
  };

};

helper = new Helper();

exports.Helper = helper;