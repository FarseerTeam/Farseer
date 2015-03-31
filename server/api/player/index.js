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

router.param('player_id', middleware.idInterceptor(players.Player, 'player'));
router.param('playerUniqueIdentifier', middleware.playerUniqueIdentifierInterceptor('player'));
router.param('teamName', middleware.teamNameInterceptor('team'));

router.route('/:player_id')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);	

router.route('/:playerUniqueIdentifier/:teamName')
	.all(function(req, res, next){
		next();
	})
	.put(controller.updatePlayersTeam);

module.exports = router;