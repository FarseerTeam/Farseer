exports.idInterceptor = function(modelName, modelReference, model) {
	return function(req, res, next, id) {

		modelReference.findById(id, function(err, doc) {

			if (err) {
				res.json({
					errorMessage: modelName + " with id " + id + " does not exist.",
					err: err
				});
				req.end();
			} else {
				req[model] = doc;
				next();
			}

		});
	};
};