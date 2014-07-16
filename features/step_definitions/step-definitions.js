var World = require('../support/world').World,
    mapSteps = require('../support/map-steps');

module.exports = function() {
  this.World = World;

  this.When(/^I get homepage and fill in "([^"]*)" with "([^"]*)"$/, function(field, data, callback) {
    mapSteps.chainSteps(field, data, this).then(
      function resolve(value) {
        callback();
      },
      function reject(err) {
        callback.fail(err);
      }
    );
  });
};