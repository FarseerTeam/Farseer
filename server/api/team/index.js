'use strict';

var express = require('express');
var controller = require('./teams.controller');

var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index)
	.post(controller.create);

router.param('team_id', controller.middleware.idInterceptor);


router.route('/:team_id')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);	

// app.param('teamId', articles.articleByID);
module.exports = router;