/*jshint expr: true*/
'use strict';

var expect = require('chai').expect;
var authenticatedRequest = require('../../authentication/authentication-helper.spec');
var VALID_USER = authenticatedRequest.VALID_USER;
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

describe('/api/worlds/world/maps', function () { //jshint ignore:line

  authenticatedRequest.useAuth(VALID_USER);

  describe("/avatar", function () {
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

    it("should return player on the team", function (done) {

      var expected = {
        team: 'avatar',
        path: '/avatar',
        players: [flattenId(player.toObject())],
        subTeams: []
      };

      authenticatedRequest
        .get('/api/worlds/world/maps')
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

    describe('/sub/team', function () {
      var subTeamPlayer;

      beforeEach(function (done) {
        createPlayer("/avatar/sub/team", "Namoor")
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

        authenticatedRequest
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