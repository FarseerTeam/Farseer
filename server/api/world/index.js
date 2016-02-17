'use strict';

var express = require('express');
var controller = require('./world.controller');

var router = express.Router();

router
	.route('/')
	.get(controller.index)
	.post(controller.create)
	.put(controller.update);

var worldRouter = express.Router({ mergeParams: true });
worldRouter
	.use('/players', require('../player'))
	.use('/teams', require('../team'))
	.use('/maps', require('../map'));

router.use('/:worldId', worldRouter);

module.exports = router;