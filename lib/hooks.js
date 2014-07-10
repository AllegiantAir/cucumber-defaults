"use strict";

var wd = require('wd');
var CONFIG = require('config').cucumber;

exports.Hooks = function() {
  this.Around(function (scenario, runScenario) {
    this.asserters = wd.asserters;
    this.browser = wd.remote(this.serverOptions);
    this.browser.init(this.browserOptions, function () {
      runScenario(function (callback) {
        if (CONFIG.hasOwnProperty("keepBrowserOpen")) {
          if (!CONFIG.keepBrowserOpen) {
            this.browser.quit(callback);
          } else {
            callback();
          }
        } else {
          this.browser.quit(callback);
        }
      });
    });
  });

  this.AfterStep(function(step, callback) {
    //*
    var sleeper = function(millis, daFunc) {
      setTimeout(
        function () {
          daFunc();
        },
        millis
      );
    };
    if ("addSleep" in CONFIG) {
      if(CONFIG.addSleep) {
        sleeper(1000, callback);
      } else {
        callback();
      }
    } else {
      callback();
    }
    //*/
  });
};