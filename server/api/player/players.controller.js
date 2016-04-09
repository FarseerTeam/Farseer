/*jshint expr: true*/
'use strict';

var _ = require('lodash');

var players = require("../../components/players");
var teams = require("../../components/teams");
var actions = require("../../components/actions");

exports.index = function (req, res) {
  players.Player.find({ world: req.params.worldId }, function (err, doc) {
    if(req.isAuthenticated()) {
      console.log('OH yea, you are authenticated, my friend! ');
      console.log(req.user);
    }
    res.json(doc);
  });
};

exports.create = function(req, res) {
    var player = new players.Player(req.body);
    player.world = req.params.worldId;
    player.save(function(err) {
        if (err) {
            return res.status(409).json({
                message: 'A player with email ' + player.email + ' already exists'
            });
        } else {
            if (req.isAuthenticated()) {
                actions.saveCreatePlayer(req.user.email, player.world, player.name, player.email).then(function() {
                    res.json(player);
                }, function(error) {
                    console.log('Error saving action: ' + error);
                });
            } else {
                res.json(player);
            }
        }
    });
};

exports.delete = function (req, res) {
  players.Player.remove({
    _id: req.player.id
  }, function (err) {
    res.status(200).end();
  });

};

exports.read = function (req, res) {
  res.json(req.player);
};

exports.update = function (request, response) {

  var handleUpdate = function () {
    var player = request.player;
      player = _.extend(player, request.body);
      updateThePlayer(player);
  };

  var updateThePlayer = function (playerToSave) {
    playerToSave.save(function (err, updatedPlayer) {
      if (err) {
        uniqueKeyViolation(err);
      } else {
        response.json(updatedPlayer);
      }
    }, dbCallFailure);
  };

  var dbCallFailure = function (err) {
    response.status(409).json({message: 'An unexpected application error has occured.', err: err});
  };

  var uniqueKeyViolation = function (err) {
    response.status(409).send({message: 'A player with email ' + request.player.email + ' already exists'});
  };

  handleUpdate();

};