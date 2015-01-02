'use strict';

var express = require('express');
var controller = require('./players.controller');
var middleware = require('../middleware');
var players = require('../../components/players');
var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index)
	.post(controller.create);

router.param('player_id', middleware.idInterceptor(players.model, 'player'));
router.route('/:player_id')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);	

// app.param('playerId', articles.articleByID);
module.exports = router;