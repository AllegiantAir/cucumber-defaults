var wd = require('wd');

exports.Hooks = function() {
    this.Around(function (scenario, runScenario) {
        this.browser = wd.remote(this.serverOptions);
        this.browser.init(this.browserOptions, function () {
            runScenario(function (callback) {
                this.browser.quit(callback);
            });
        });
    });
};
