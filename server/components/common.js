module.exports = (function() {

	var _performCallBack = function(err, doc, successCB, errorCB) {
		if(err) {
			errorCB(err);
		} else {
			successCB(doc);
		}
	};

	var _isObjectId = function(id) {
		var strId = String(id);
		return /^[0-9a-fA-F]{24}$/.test(strId);
		// http://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
		// https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
	};

	return {
		performCallBack: _performCallBack,
		isObjectId: _isObjectId
	}

})();
