'use strict';

var express = require('express');
var controller = require('./world.controller');

var router = express.Router();

router.route('/')
	.get(controller.index)
	.post(controller.create);

module.exports = router;