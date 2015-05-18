'use strict';

var express = require('express');
var controller = require('./teams.controller');
var middleware = require('../middleware');
var teams = require('../../components/teams');
var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index)
	.post(controller.create);

router.param('team_id', middleware.idInterceptor(teams.Team, 'team'));

router.route('/:team_id')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);	

module.exports = router;