/*jshint expr: true*/
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var teams = require("../../components/teams")
var players = require("../../components/players")
var dataService = require('../../components/dataService')
var _ = require('lodash');
var format = require("string-format");
dataService.connect();

/*
 Given players: [{name:'Zuko', team:'/fireNation/royalty'},
                {name: 'Aang', team: '/avatar},
                 {name: 'Katara', team: '/avatar' },
                 {name: 'Iroh', team: '/fireNation/royalty'}]

                 [{team: 'avatar', players: [{name: 'Aang'},
                 {name: 'Katara'}]},
          {team: 'fireNation',
          subteams: [{team: 'royalty',
          players: [{name: 'Zuko'}, {name: 'Iroh'}]}]}]

*/

var createPlayer = function(path, playerName) {
    return players.Player.create({
      name: playerName,
      email: format("{}@test.smith.com", playerName),
      _team: path
    });
};

var clearAll = function(done) {
  players.Player.remove({}, function() {
    teams.Team.remove({}, function() {
      done();
    })
  });
};

var execAndCheck = function(expected, done) {
  request(app)
    .get('/api/maps')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      console.log("dumb ");
      if (err) {
        console.log(err);
        done(err);
        return;
      }
      res.body.should.be.instanceof(Array);
      expected.should.be.eql(res.body);
      done();
    });
};

xdescribe('/api/maps', function() { //jshint ignore:line

  describe("Given player 'Aang' on team: 'avatar", function() {
    var player;

    beforeEach(function(done) {
      clearAll(
        function() {
          createPlayer("/avatar", "Aang").then(function(newPlayer) {
            player = newPlayer;
            done();
          }, done);
        }
      );

    });

    it("should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}]}", function(done) {

      var expected = {
        team: 'avatar',
        players: [player.toJSON()]
      };

      console.info(player);

      execAndCheck([expected], done);

    });


    afterEach(function(done) {
      clearAll(done);
    });
  });
});
