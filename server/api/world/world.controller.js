'use strict';

var worlds = require('../../components/worlds');
var players = require('../../components/players');
var errorHandler = require('../common/errorHandler');

exports.index = function (request, response) {
  worlds.World.find({}, function (err, doc) {
    response.json(doc);
  });
};

exports.create = function(request, response) {
    var worldId = request.body.id;
    worlds.World.create({ id: worldId }).then(function(newWorld) {
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

//TODO: test coverage for player world update
  worlds.updateWorldName(worldId, updatedWorldName).then(function(data) {
    players.updatePlayersWorlds(worldId, updatedWorldName);
    response.json(data);
  }, function (err){
    response.status(409).send({
      message: errorHandler.retrieveErrorMessage(err.code, 'world')
    });
  });
};
