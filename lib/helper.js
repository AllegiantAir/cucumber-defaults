// Helper functions

Helper = function() {
	
	this.exists = function (parameter) {
        return (null != parameter) && ('undefined' != (typeof(parameter)).toLowerCase());
    };

};

exports.Helper = new Helper();