/*jshint expr: true*/
'use strict';

var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');
var teams = require("../../components/teams");
var players = require("../../components/players");
var dataService = require('../../components/dataService');
var _ = require('lodash');
var format = require("string-format");
dataService.connect();

var flattenId = function (object) {
  object._id = object._id.toString();
  return object;
};

var createPlayer = function (path, playerName) {
  return players.Player.create({
    name: playerName,
    email: format("{}@test.smith.com", playerName),
    _team: path
  });
};

var clearAll = function () {
  return players.Player.remove({}, function () {
    teams.Team.remove({});
  });
};

var execAndCheck = function (expected, done) {
  request(app)
    .get('/api/maps')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, response) {
      console.log("dumb ");
      if (err) {
        console.log(err);
        done(err);
        return;
      }
      expect(response.body).to.instanceof(Array);
      expect(response.body).to.eql(expected);
      done();
    });
};

describe('/api/maps', function () { //jshint ignore:line

  describe("Given player 'Aang' on team: 'avatar", function () {
    var player;

    beforeEach(function (done) {
      clearAll()
        .then(function () {
          return createPlayer("/avatar", "Aang");
        })
        .then(function (newPlayer) {
          player = newPlayer;
          return null;
        })
        .then(done, done);
    });

    it("should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}]}", function (done) {

      var expected = {
        team: 'avatar',
        players: [flattenId(player.toObject())]
      };

      execAndCheck([expected], done);
    });

    afterEach(function (done) {
      clearAll().then(done.bind(null, null), done);
    });
  });
});
