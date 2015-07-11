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
var RSVP = require('rsvp');

dataService.connect();

var flattenId = function (object) {
  object._id = object._id.toString();
  return object;
};

var createPlayer = function (worldId, path, playerName) {
  return players.Player.create({
    name: playerName,
    email: format("{}@test.smith.com", playerName),
    world: worldId,
    _team: path
  });
};

var clearAll = function () {
  return players.Player.remove({}, function () {
    teams.Team.remove({});
  });
};

describe('/api/worlds/world/maps', function () { //jshint ignore:line

  describe("/avatar", function () {
    var aang, neo;

    beforeEach(function (done) {
      clearAll()
      .then(function() {
        RSVP.hash({
          aang: createPlayer('someworld', '/avatar', 'Aang'),
          neo: createPlayer('otherworld', '/avatar', 'Neo')
        })
        .then(function(players) {
          aang = players.aang;
          neo = players.neo;
        }).then(done, done);
      });        
    });

    it("should return player on the team from correct world", function (done) {
      var expected = {
        team: 'avatar',
        path: '/avatar',
        players: [flattenId(aang.toObject())],
        subTeams: []
      };

      request(app)
        .get('/api/worlds/someworld/maps')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, response) {
          if (err) done(err);
          expect(response.body).to.instanceof(Array);
          expect(response.body).to.eql([expected]);
          done();
        });
    });

    describe('/sub/team', function () {
      var subTeamPlayer;

      beforeEach(function (done) {
        createPlayer('world', "/avatar/sub/team", "Namoor")
          .then(function (newPlayer) {
            subTeamPlayer = newPlayer;
            done();
          });
      });

      it('should only return players in the sub team', function (done) {
        var expected = {
          team: 'team',
          path: '/avatar/sub/team',
          players: [flattenId(subTeamPlayer.toObject())],
          subTeams: []
        };

        request(app)
          .get('/api/worlds/world/maps/avatar/sub/team')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, response) {
            if (err) {
              console.log(err);
              done(err);
              return;
            }
            expect(response.body).to.instanceof(Array);
            expect(response.body).to.eql([expected]);
            done();
          });

      });
    });

    afterEach(function (done) {
      clearAll().then(done.bind(null, null), done);
    });
  });

});