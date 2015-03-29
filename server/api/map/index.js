'use strict';

var express = require('express');
var controller = require('./maps.controller');

var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index);

router.route('/:playerEmail/:teamName')
	.all(function(req, res, next){
		next();
	})
	.post(controller.update);

module.exports = router;