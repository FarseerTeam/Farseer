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
	return function(req, res, next, id) {

	    var playerNotFound = function() {
    		res.status(404).json({message: 'Player with email "' + id + '" does not exist.'});
            res.end();
		};

		players.findByEmail(id, function(player) {
	        if (!player) {
	        	playerNotFound();
	        } else {
				req[paramName] = player;
				next();
	        }
    	}, playerNotFound);
	};
};

exports.teamNameInterceptor = function(paramName) {
	return function(req, res, next, id) {

		var badInputFailure = function() {
        	res.status(404).json({message: 'A team with teamName "' + id + '" does not exist.'});
            res.end();
    	};

	    var dbCallFailure = function(err) {
	        res.status(409).json({message: 'An unexpected application error has occured.  Please try again.'});
	        res.end();
	    };

		teams.findByName(id, function(team) {
            if (!team) {
            	badInputFailure();
            } else {
				req[paramName] = team;
				next();
            }
        }, dbCallFailure);
	};
}