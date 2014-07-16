var world = require('./world'),
    mapSteps = require('../../lib/world').DefaultMapSteps;

var MapSteps = function() {
  this.chainSteps = function(field, data, self) {
    return mapSteps.iGoToHomepage(self).then(
      function resolve() {
        return mapSteps.fillIn(field, data, self);
      },
      function reject(err) {
        return err;
      }
    );
  };
};

module.exports = new MapSteps();