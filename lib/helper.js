wd = require('wd');

//// Helper functions
Helper = function() {

    browser = wd.promiseChainRemote();

    var selfMock = {
        browser: browser.init({
            browserName: 'chrome'
        })
    };

    var browser = selfMock.browser;

	this.exists = function (parameter) {
        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
    };

    this.isElementEnabled = function(element){
        return browser.isEnabled(element) && browser.isDisplayed(element);
    };

    this.waitForCss = function(element, cssProperty, poll, timeout, callback){
        browser.waitForElementByCssSelector(element, cssProperty, poll, timeout, function(err, element){
            if(Helper.isElementEnabled(element)){
                callback();
            }else{
                callback.fail(err);
            }
        });
    };

    this.waitForElementEnabled = function(element, poll, timeout, callback){

        browser.waitForElementByXPath(element, function(err, element){
            if(Helper.isElementEnabled(element)){
                callback();
            }else{
                callback.fail(err);
            }
        });
    };

};

exports.Helper = new Helper();

//Helper = function() {
//
//    this.exists = function (parameter) {
//        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
//    };
//
//};
//
//exports.Helper = new Helper();