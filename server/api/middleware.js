
exports.idInterceptor = function(modelReference, model) {
	return function(req, res, next, id) {

		modelReference.findById(id, function(err, doc) {

			if (err) {
				res.json({
					errorMessage:  model.toUpperCase() + " with id " + id + " does not exist.",
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

 