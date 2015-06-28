'use strict';

var express = require('express');
var router = express.Router();

var _authenticate = function(request, response, next) {
	console.log("I am so authenticating stuff right now!  You're good, please continue...");
	next();
}

router.get('/auth/google', function(request, response) {
	response.send('inside google auth uri');
});
router.get('/auth/google/callback', function(request, response) {
	response.send('Inside google callback uri');
});
router.use(_authenticate);

module.exports = router;