'use strict';

var express = require('express');
var controller = require('./maps.controller');

var router = express.Router();

router.route('/')
	.all(function(req, res, next) {
	  next();
	})
	.get(controller.index);

// 	.post(controller.create);



// router.route('/:team_id')
// 	.all(function(req, res, next) {
// 	  next();
// 	})
// 	.get(controller.read)
// 	.put(controller.update)
// 	.delete(controller.delete);	


module.exports = router;