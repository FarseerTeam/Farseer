/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /players              ->  index
 * POST    /players              ->  create
 * GET     /players/:id          ->  show
 * PUT     /players/:id          ->  update
 * DELETE  /players/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var players = require("../../components/players")
	// Get list of players

exports.middlewareId = function(req, res, next, id) {

	players.model.findById(id, function(err, player) {
		if (err) {
			req.player = { error : "Player with id "  + id + " does not exist."};
		} else {
			req.player = player;
		}
		// if (!player) return next(new Error('Failed to load player ' + id));

		next();
	});
};

exports.index = function(req, res) {
	players.model.find({}, function(err, doc) {
		res.json(doc);
	});
};
exports.create = function(req, res) {
	var player = new players.model(req.body);
	player.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(player);
		}
	});
};
exports.update = function(req, res){
	var player = req.player;

	player = _.extend(player, req.body);

	player.save(function(err) {
			res.json(player);
	});
};
exports.delete = function(req, res){
	players.model.remove({ _id: req.player.id }, function(err){
		res.status(200).end();
	});
	
};

exports.read = function(req, res) {
  		res.json(req.player);
};