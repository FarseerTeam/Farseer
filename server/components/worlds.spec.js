var mongoose = require("mongoose");
var worlds = require("./worlds");
var RSVP = require('rsvp');
var expect = require('chai').expect;
var should = require('should');
require('chai').use(require('dirty-chai'));
var assert = require('assert');
var config = require('../config/environment/test');

var dataService = require('./dataService');

dataService.connect();

describe("A world", function () {

  var world;
  var worldId = "hogwarts";
  var worldName = "Hogwarts";

  beforeEach(function (done) {

    worlds.World.remove({}, function () {
      var world = new worlds.World({id: worldId, name: worldName});
      world.save(function() {
        done();
      });

    });
  });

  it("should save only one world when trying to save multiple worlds with the same id", function(done) {

    var world = new worlds.World({id: worldId, name: worldName});
    setTimeout(function() {
      world.save(function(err) {
        if (err) {
          worlds.World.count({}, function(err, count){
            var expectedWorldCount = 1;
            expect(count).to.equal(expectedWorldCount);
          });
        } else {
          should.fail('Should not allow saving multiple worlds with the same id');
        }
      });

    }, 1000);

    done();
  });

  it("assigns internal ID and keeps the world id and name when saved", function (done) {
    worlds.World.findOne({id: worldId}, function (err, document) {
      expect(document._id).to.not.be.null();
      expect(document.id).to.equal(worldId);
      expect(document.name).to.equal(worldName);
      done();
    })
  });

});
