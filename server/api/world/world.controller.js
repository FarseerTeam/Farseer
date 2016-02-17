'use strict';

var _ = require('lodash');
var worlds = require('../../components/worlds');

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
  var worldToFind =  request.body.oldWorldName;
  var updatedWorldName = request.body.updatedWorldName;

  worlds.findWorldByName(worldToFind).then(function(world) {
    world._doc.name = updatedWorldName;

    world.save();

    //var updatedWorld = worlds.World.save(world);

    console.log(updatedWorld);
  });


  //step1. find a world object by name
  //step2. update the name of the old world and save it with a new one

  //step3. update old worlds with the new world in all players via mango.
  //step4. return an updated world.
};