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
            return res.status(409).send({
                message: 'A player with email ' + player.email + ' already exists'
            });
        } else {
            res.json(player);
        }
    });
};

exports.update = function(req, res) {
    var player = req.player;

    player = _.extend(player, req.body);

    player.save(function(err) {
        if(err) {
          return res.status(409).send({
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

exports.updatePlayersTeam = function(req, res) {
    var team = req.team;
    var player = req.player;

    var dbCallFailure = function(err) {
        res.status(409).json({message: 'An unexpected application error has occured.  Please try again.'});
        req.end();
    };

    player._team = team;
    player.save(function(err, updatedPlayer) {               
        res.json(updatedPlayer);
    }, dbCallFailure);
};