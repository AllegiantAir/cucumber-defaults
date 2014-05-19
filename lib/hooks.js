"use strict";

var wd = require('wd');
var CONFIG = require('config').cucumber;

exports.Hooks = function () {
    this.Around(function (runScenario) {
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
};
