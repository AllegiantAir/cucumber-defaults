var world = require('./world'),
    ms = require('../../lib/world').DefaultMapSteps,
    helper = require('../../lib/world').Helper;

var MapSteps = function() {
  this.chainSteps = function(field, data, self) {
    return Helper.chain(ms.iGoToHomepage, self).
           chain(ms.fillIn, field, data, self);
  };
};

module.exports = new MapSteps();