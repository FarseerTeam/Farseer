'use strict';

var players = require("../components/players");
var teams = require("../components/teams");

exports.idInterceptor = function(modelReference, model) {
	return function(req, res, next, id) {

		modelReference.findById(id, function(err, doc) {

			if (err) {
				res.json({
					errorMessage:  model.toUpperCase() + " with id " + id + " does not exist.",
					err: err
				});
				res.end();
			} else {
				req[model] = doc;
				next();
			}

		});
	};
};

exports.playerUniqueIdentifierInterceptor = function(paramName) {

	var handler = function(req, res, next, id) {	
		players.findByAnyUniqueIdentifier(id, function(player) {
			storePlayerAsParam(player, req, res, next, id);
		}, databaseCallFailure(res));
	};

	var storePlayerAsParam = function(player, req, res, next, id) {
        if (!player) {
        	playerNotFound(id, res)();
        } else {
			req[paramName] = player;
			next();
        }
	};

	return handler;
};

exports.teamNameInterceptor = function(paramName) {
	return function(req, res, next, id) {

		var badInputFailure = function() {
        	res.status(404).json({message: 'A team with teamName "' + id + '" does not exist.'});
    	};

		teams.findByName(id, function(team) {
            if (!team) {
            	badInputFailure();
            } else {
				req[paramName] = team;
				next();
            }
        }, databaseCallFailure(res));
	};
}

function playerNotFound(id, res) {
	return function() {
		res.status(404).json({message: 'Player with identifier "' + id + '" does not exist.'});
	};
}

function databaseCallFailure(res) {
	return function(err) {
    	res.status(500).json(buildApplicationErrorBody(err));
	}
}

function buildApplicationErrorBody(err) {
	return {
		message: 'An unexpected application error has occured.',
		err: err
	};
}