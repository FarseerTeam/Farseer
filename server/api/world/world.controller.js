'use strict';

var worlds = require('../../components/worlds');
var players = require('../../components/players');
var errorHandler = require('../common/errorHandler');

var generateWorldId = function(worldName){
    return worldName.replace(/ /g, '').toLowerCase();
};

exports.index = function (request, response) {
  worlds.World.find({}, function (err, doc) {
    response.json(doc);
  });
};

exports.read = function(request, response) {
    var worldId = request.params.worldId;
    worlds.World.findOne({ id: worldId }, function(err, doc) {
        if (doc) {
            response.json(doc);
        } else {
            response.status(404).send({
                message: 'World with id (' + worldId + ') does not exist.'
            });
        }
    });
};

exports.create = function(request, response) {
    var worldName = request.body.name;
    var worldId = generateWorldId(worldName);
    
    worlds.World.create({ id: worldId, name: worldName }).then(function(newWorld) {
        response.json(newWorld);
    }, function(error) {
        response.status(409).send({
            message: errorHandler.retrieveErrorMessage(error.code, 'world')
        });
    });
};

exports.delete = function (request, response) {
  var worldId = request.body.worldId;

  worlds.World.remove({id: worldId}).then(function(data) {
      //TODO: add test around player clean up
    players.Player.remove({world: worldId});
    response.json(data);
  }, function(error){
    response.send({message: "World could not be deleted"});
  });
};

exports.update = function (request, response) {
  var worldId =  request.body.worldId;
  var updatedWorldName = request.body.updatedWorldName;
  var updatedWorldId = generateWorldId(updatedWorldName);

  worlds.updateWorldName(worldId, updatedWorldId, updatedWorldName).then(function(data) {
//TODO: test coverage for player world update
    players.updatePlayersWorlds(worldId, updatedWorldId);
    response.json(data);
  }, function (err){
    response.status(409).send({
      message: errorHandler.retrieveErrorMessage(err.code, 'world')
    });
  });
};