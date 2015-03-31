'use strict';

var express = require('express');
var controller = require('./maps.controller');

var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index);

module.exports = router;