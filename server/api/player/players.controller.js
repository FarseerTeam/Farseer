/*jshint expr: true*/
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

var players = require("../../components/players");
var teams = require("../../components/teams");
// Get list of players

exports.index = function(req, res) {
    players.Player.find({}, function(err, doc) {
        res.json(doc);
    });
};

exports.create = function(req, res) {
    var player = new players.Player(req.body);
    player.save(function(err) {
        if (err) {
            return res.status(409).json({
                message: 'A player with email ' + player.email + ' already exists'
            });
        } else {
            res.json(player);
        }
    });
};

exports.delete = function(req, res) {
    players.Player.remove({
        _id: req.player.id
    }, function(err) {
        res.status(200).end();
    });

};

exports.read = function(req, res) {
    res.json(req.player);
};

exports.update = function(req, res) {
    
    var handleUpdate = function() {
        var player = req.player;
        findTeamAndThen(req.body._team, function(team) {         
            if (team) {
                req.body._team = team.path;
            }
            player = _.extend(player, req.body);
            updateThePlayer(player);
        });
    }

    var findTeamAndThen = function(identifier, callback) {
        if (!identifier) {
            callback(undefined)
        } else { 
            teams.findByAnyUniqueIdentifier(identifier, function(team) {
                if (!team) {
                    teamNotFoundError();
                } else {
                    callback(team);
                }
            }, dbCallFailure);
        }
    }

    var updateThePlayer = function(playerToSave) {
        playerToSave.save(function(err, updatedPlayer) {   
            if(err) {
              uniqueKeyViolation(err);
            } else {           
                res.json(updatedPlayer);
            }
        }, dbCallFailure);
    }

    var dbCallFailure = function(err) {
        res.status(409).json({message: 'An unexpected application error has occured.', err: err});
    };

    var uniqueKeyViolation = function(err) {
        res.status(409).send({message: 'A player with email ' + req.player.email + ' already exists'});
    }

    var teamNotFoundError = function(err) {
        res.status(404).send({message: "A team with identifier '" + req.body._team + "' does not exist"});
    }

    handleUpdate();

};
