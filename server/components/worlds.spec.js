var mongoose = require("mongoose");
var worlds = require("./worlds");
var RSVP = require('rsvp');
var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var assert = require('assert');
var config = require('../config/environment/test');

var dataService = require('./dataService');

dataService.connect();

describe("A world", function () {

  var world;

  beforeEach(function (done) {
    worlds.World.create({
      name: "Hogwarts"
    }).then(function (document) {
      world = document;
      done();
    }, done);
  });

  afterEach(function (done) {
    worlds.World.remove({}, function () {
      done();
    });
  });

  it("should save only one world when trying to save multiple worlds with the same name", function(done) {
    world.save(function(err, document) {





      worlds.World.create({
        name: "Hogwarts1"
      }).then(function (document) {
        document.save(function(err, document) {
          console.log("Error:", err);
          worlds.World.find({} ,function(err, worlds) {
            console.log("our worlds:", worlds);
          });
        });

        //done();
      }, done);
    });

    //world.save(function(err, document) {
    //
    //});

    //count worlds should be equal to 1

    done();
  });

  it("assigns ID and keeps the world name when saved", function (done) {
    world.save(function (err, document) {
      expect(document.name).to.equal("Hogwarts1");
      expect(document._id).to.not.be.null();
      done(err);
    });
  });

});
