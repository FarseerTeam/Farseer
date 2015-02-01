/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /teams              ->  index
 * POST    /teams              ->  create
 * GET     /teams/:id          ->  show
 * PUT     /teams/:id          ->  update
 * DELETE  /teams/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var teams = require("../../components/teams")
	// Get list of teams

exports.index = function(req, res) {
	teams.Team.find({}, function(err, doc) {
		res.json(doc);
	});
};
exports.create = function(req, res) {
	function save(team) {
		team.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				res.json(team);
			}
		});
	}

	function findTeamParentFirstThanSave(parentId) {
		teams.Team.findById(parentId, function(err, doc) {
			if (!doc) {
				res.json({
					error: "Team with id " + parentId + " does not exist."
				});
			} else {

				var team = new teams.Team(req.body)
				team.parent = doc;
				save(team);
			}
		});
	}

	if (req.body.parentId) {
		findTeamParentFirstThanSave(req.body.parentId);
	} else {
		save(new teams.Team(req.body));
	}
};
exports.update = function(req, res) {
	var team = req.team;

	team = _.extend(team, req.body);

	team.save(function(err) {
		res.json(team);
	});
};
exports.delete = function(req, res) {
	teams.Team.remove({
		_id: req.team.id
	}, function(err) {
		res.status(200).end();
	});
};

exports.read = function(req, res) {
	res.json(req.team);
};