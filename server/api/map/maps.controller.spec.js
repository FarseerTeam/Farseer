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

var createTeam = function(teamName, playerName, callback) {

  teams.Team.create({
    name: teamName,
  }, function(err, doc) {
    var theTeam = doc;

    players.Player.create({
      name: playerName,
      email: format("{}@test.smith.com", playerName),
      _team: theTeam
    }, function(err, doc) {
      callback();
    });

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

describe('/api/maps', function() {
  // describe('GET when database is empty ', function() {
  //   it('should respond with an empty JSON array', function(done) {
  //     execAndCheck([], done);
  //   });
  // });

  describe("Given player 'Aang' on team: 'avatar", function() {

    beforeEach(function(done) {
      clearAll(
        function() {
          createTeam("avatar", "Aang", done);

        }
      );

    });

    it("should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}]},", function(done) {

      var expected = {
        team: 'avatar',
        players: [{
          name: 'Aang'
        }]
      };

      execAndCheck([expected], done);

    });


    afterEach(function(done) {
      clearAll(done);
    });
  });
});


describe('/api/maps/:playerEmail/:teamName', function() {

  var performUpdateAndCheck = function(playerEmail, teamName, expected, done) {
    request(app)
      .post('/api/maps/' + playerEmail + '/' + teamName)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          console.log(err);
        }
        res.body.should.be.instanceof(Array);
        expected.should.be.eql(res.body);
        done();
      });
  };

  var createTeam = function(teamName, callback) {
      teams.Team.create({
        name: teamName
      }, function (err, doc) {callback(doc);});
  };

  var createPlayer = function(team, playerName, callback) {
      var player = {
        name: playerName,
        email: (playerName.split(' ')[0] + '@gmail.com')
      };
      if (team) {
        player._team =  team;
      }

      players.Player.create(player, function(err, doc) {callback(doc);});
  };


  describe('Given a player with no assignment, and an existing team...', function(){

    beforeEach(function(done) {
      createTeam('Gryffindor', function(createdTeam) {
        createPlayer(createdTeam, 'Hermione Granger', function() {
          createPlayer(undefined, 'Harry Potter', function() {
            done();
          });
        });
      });
    });

    afterEach(function(done){
      clearAll(done);
    });

    var expectedMap = [{
        team: 'Gryffindor',
        players: [
          {name: 'Hermione Granger'},
          {name: 'Harry Potter'}
        ]
      }];

    it('updating the map with player email and team name puts the player on the team.', function(done) {
      performUpdateAndCheck('Harry@gmail.com', 'Gryffindor', expectedMap, done);
    });
  });


  describe('Given a player with an existing assignment, and two existing teams...', function(){

    beforeEach(function(done) {
      createTeam('Muggle', function(createdTeam) {
        createPlayer(createdTeam, 'Harry Potter', function() {
          createTeam('Gryffindor', function() {
            done();
          });
        });
      });
    });

    afterEach(function(done){
      clearAll(done);
    });

    var expectedMap = [
      {
        team: 'Muggle',
        players: []
      },{
        team: 'Gryffindor',
        players: [
          {name: 'Harry Potter'}
        ]
      }];

    it('updating the map with player email and a different team name removes the player from the old team and puts the player on the new team.', function(done) {
      performUpdateAndCheck('Harry@gmail.com', 'Gryffindor', expectedMap, done);
    });
  });
});