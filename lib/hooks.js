var wd = require('wd');
var CONFIG = require('config').cucumber;

exports.Hooks = function() {
    this.Around(function (scenario, runScenario) {
        this.browser = wd.remote(this.serverOptions);
        this.browser.init(this.browserOptions, function () {
            runScenario(function (callback) {
                if ("keepBrowserOpen" in CONFIG) {
                    if(!CONFIG.keepBrowserOpen) {
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
