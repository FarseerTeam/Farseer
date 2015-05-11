/*jshint expr: true*/
'use strict';

var _ = require('lodash');

var players = require("../../components/players");
var teams = require("../../components/teams");

exports.index = function (req, res) {
  players.Player.find({}, function (err, doc) {
    res.json(doc);
  });
};

exports.create = function (req, res) {
  var player = new players.Player(req.body);
  player.save(function (err) {
    if (err) {
      return res.status(409).json({
        message: 'A player with email ' + player.email + ' already exists'
      });
    } else {
      res.json(player);
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

  var teamNotFoundError = function (err) {
    response.status(404).send({message: "A team with identifier '" + request.body._team + "' does not exist"});
  };

  handleUpdate();

};
