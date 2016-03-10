'use strict';

var worlds = require('../../components/worlds');
var players = require('../../components/players');
var errorHandler = require('../common/errorHandler');

exports.index = function (request, response) {
  worlds.World.find({}, function (err, doc) {
    response.json(doc);
  });
};

exports.create = function (request, response) {
  worlds.World.create(request.body).then(function (newWorld) {
    response.json(newWorld);
  }, function (error) {
    response.status(409).send({
      message: errorHandler.retrieveErrorMessage(error.code, 'world')
    });
  });
};

exports.delete = function (request, response) {
  var worldName = request.body.worldName;
  var worldNameFormatted = worldName.replace(/ /g, '').toLowerCase();

  worlds.World.remove({name: worldName}).then(function(data) {
    players.Player.remove({world: worldNameFormatted});
    response.json(data);
  }, function(error){
    response.send({message: "World could not be deleted"});
  });
};

exports.update = function (request, response) {
  var worldToChange =  request.body.oldWorldName;
  var updatedWorldName = request.body.updatedWorldName;

  worlds.updateWorldName(worldToChange, updatedWorldName).then(function(data) {
    players.updatePlayersWorlds(worldToChange, updatedWorldName);
    response.json(data);
  }, function (err){
    response.status(409).send({
      message: errorHandler.retrieveErrorMessage(err.code, 'world')
    });
  });
};
