module.exports = (function() {

	var _performCallBack = function(err, doc, successCB, errorCB) {
		if(err) {
			errorCB(err);
		} else {
			successCB(doc);
		}
	}

	var _isObjectId = function(id) {
		var strId = String(id);
		return /^[0-9a-fA-F]{24}$/.test(strId); 
		// http://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid 
		// https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
	}

	var _isPath = function(path) {
		if (!path || typeof path !== 'string') {
			return false;
		}

		return _isEveryOneAnObjectId(path.split("#"));
	}

	var _isEveryOneAnObjectId = function(arrayOfStrings) {
		for (var i = 0; i < arrayOfStrings.length; i++) {
			if (! _isObjectId(arrayOfStrings[i])) {
				return false;
			}
		}
		return true;
	}

	return {
		performCallBack: _performCallBack,
		isObjectId: _isObjectId,
		isPath: _isPath
	}

})();