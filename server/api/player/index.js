'use strict';

var express = require('express');
var controller = require('./players.controller');
var middleware = require('../middleware');
var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index)
	.post(controller.create);

router.param('player_id', middleware.playerUniqueIdentifierInterceptor('player'));

router.route('/:player_id')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);	

module.exports = router;