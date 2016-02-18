'use strict';

var _ = require('lodash');
var worlds = require('../../components/worlds');
var players = require('../../components/players');

exports.index = function (request, response) {
  worlds.World.find({}, function (err, doc) {
    response.json(doc);
  });
};

exports.create = function (request, response) {
  worlds.World.create(request.body)
    .then(function (newWorld) {
    response.json(newWorld);
  }, function (error) {
      response.status(409).send({ message: "A world with that id already exists." });
    });
};

exports.update = function (request, response) {
  var worldToChange =  request.body.oldWorldName;
  var updatedWorldName = request.body.updatedWorldName;

  //TODO:
  //approach 1: call just as is and then read worlds from world
  //approach 2. save and update (by returning an updated object) an existing world
  //var res = worlds.updateWorldName(worldToChange, updatedWorldName, function(err, doc) {
  //    if (err) {
  //      console.log("Error occurred while looking for a world by name");
  //      //TODO: how do we do resolve?
  //      return err;
  //    } else {
  //      return doc;
  //    }
  //});
  var res = worlds.updateWorldName(worldToChange, updatedWorldName).then(function(data) {
    console.log("I'm in a promise callback, ", data);
    players.updatePlayersWorlds(worldToChange, updatedWorldName);
    response.json(data);

  });



  console.log("object", res);
};