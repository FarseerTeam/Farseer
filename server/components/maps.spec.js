var should = require('should');
var expect = require('chai').expect;
var RSVP = require('rsvp');
var teams = require("./teams");
var players = require("./players");
var maps = require("./maps");
var dataService = require('./dataService');
var _ = require('lodash');
var format = require("string-format");
format.extend(String.prototype);
dataService.connect();

describe('In the api/components/maps module,', function () { //jshint ignore:line
  var clearAll = function (done) {
    players.Player.remove({},
      function () {
        teams.Team.remove({}, function () {
          done()
        });
      });
  };

  var callDone = function (done) {
    return function () {
      done();
    };
  };

  var callDoneWithError = function (done) {
    return function (err) {
      done(err);
    }
  };

  function checkMapMatches(expected) {
    return function (result) {
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.eql(expected);
      return null;
    };
  }

  var createTeam = function (teamName, parent) {
    return teams.Team.create({
      name: teamName,
      parent: parent
    });

  };
  var createPlayer = function (path, playerName) {
    return players.Player.create({
      name: playerName,
      email: format("{}@test.smith.com", playerName),
      _team: path
    });
  };
  var doCreatePlayer = function (team, playerName) {
    return function () {
      return createPlayer(team, playerName)
    }
  };
  var shouldReturn = function (obj) {
    return "Should return {} ".format(JSON.stringify(obj));
  };

  describe('for the buildTeamPlayersMap function', function () {
    describe('Given an empty database', function () {
      beforeEach(function (done) {
        clearAll(done);
      });
      it('should respond with an empty array when there are no records in database.', function (done) {
        (function (expected, done) {
          maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
        })([], done);
      });

    });

    describe("Given only player 'Aang' on team: 'avatar", function () {
      var player;

      beforeEach(function (done) {
        createPlayer("/avatar", "Aang").then(function (newPlayer) {
          player = newPlayer;
          done();
        }, done);
      });

      it("should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}]},", function (done) {

        var expected = {
          team: 'avatar',
          players: [player.toObject()]
        };

        (function (expected, done) {
          maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
        })([expected], done);

      });


      afterEach(function (done) {
        clearAll(callDone(done));
      });
    });

    describe("Given player 'Aang' AND 'Yung' on team: 'avatar", function () {

      var expected;

      beforeEach(function (done) {
        RSVP.hash({
          aang: createPlayer('/avatar', "Aang"),
          yung: createPlayer('/avatar', "Yung")
        })
          .then(function (players) {
            var aang = players.aang;
            var yung = players.yung;
            expected = {
              team: 'avatar',
              players: [aang.toObject(), yung.toObject()]
            };
            return null;
          })
          .then(done.bind(null, null), done);
      });


      it(shouldReturn(expected), function (done) {
        maps.buildTeamPlayersMap().then(checkMapMatches([expected])).then(done, done);
      });

      afterEach(clearAll);
    });

    describe("Given player 'Aang' on team: 'avatar' and player 'Yung' on 'fireNation'", function () {
      beforeEach(function (done) {
        createTeam("avatar").then(
          function (team) {
            return createPlayer(team, "Aang");
          }).then(createTeam("fireNation").then(
            function (team) {
              createPlayer(team, "Yung");
              return null;
            })).then(done, done);
      });

      var teamOne = {
        team: 'avatar',
        players: [{
          name: 'Aang'
        }]
      };

      var teamTwo = {
        team: 'fireNation',
        players: [{
          name: 'Yung'
        }]
      };

      it(shouldReturn([teamOne, teamTwo]), function (done) {


        (function (expected, done) {
          maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
        })([teamOne, teamTwo], done);

      });


      afterEach(function (done) {
        clearAll(done);
      });
    });

    describe("Given player 'Aang' on team: 'avatar' under 'fireNation'", function () {

      beforeEach(function (done) {

        var p = createTeam("fireNation").then(function (team) {
          return createTeam("avatar", team);
        });
        p = p.then(function (team) {
          return createPlayer(team, 'Aang');
        });
        p = p.then(callDone(done), callDoneWithError(done));
      });

      var teamNode = {
        team: 'fireNation',
        players: [],
        subTeams: [{
          team: "avatar",
          players: [{
            name: "Aang"
          }]
        }]
      };
      it(shouldReturn(teamNode), function (done) {
        (function (expected, done) {
          maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
        })([teamNode], done);
      });


      afterEach(function (done) {
        clearAll(done);
      });
    });


    describe("Given players: [{name:'Zuko', team:'/fireNation/royalty'}, " + //
      "{name: 'Aang', team: '/avatar}, {name: 'Katara', team: '/avatar' }" + //
      ", {name: 'Iroh', team: '/fireNation/royalty'}]",
      function () {

        beforeEach(function (done) {

          var p = createTeam("avatar");
          p = p.then(function (team) {
            // console.log(team);
            return createPlayer(team, 'Aang').then(
              doCreatePlayer(team, 'Katara'));
          });
          p = p.then(function () {
            return createTeam("fireNation")
          });
          p = p.then(function (team) {
            return createTeam("royalty", team);
          });
          p = p.then(function (team) {
            return createPlayer(team, "Zuko").then(doCreatePlayer(team, "Iroh"));
          });
          p = p.then(callDone(done), callDoneWithError(done));
        });

        var expected = [{
          team: 'avatar',
          players: [{
            name: 'Aang'
          }, {
            name: 'Katara'
          }]
        }, {
          team: 'fireNation',
          players: [],
          subTeams: [{
            team: 'royalty',
            players: [{
              name: 'Zuko'
            }, {
              name: 'Iroh'
            }]
          }]
        }];

        it(shouldReturn(expected), function (done) {
          (function (expected, done) {
            maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
          })(expected, done);
        });


        afterEach(function (done) {
          clearAll(done);
        });
      });

    describe("Players with no team assignment exist in the map.  " +
    "Given players: [{name:'Tui'}, {name:'Wan Shi Tong'}, {name: 'Aang', team: '/avatar}]", function () {

      beforeEach(function (done) {

        var p = createTeam("avatar");
        p = p.then(function (team) {
          return createPlayer(team, 'Aang');
        });
        p = p.then(function () {
          return createPlayer(undefined, 'Tui')
        });
        p = p.then(function () {
          return createPlayer(undefined, 'Wan Shi Tong')
        });
        p = p.then(callDone(done), callDoneWithError(done));
      });

      var expected =
        [{
          team: 'avatar',
          players: [
            {name: 'Aang'}
          ]
        }, {
          team: undefined,
          players: [
            {name: 'Tui'},
            {name: 'Wan Shi Tong'}
          ]
        }];

      it(shouldReturn(expected), function (done) {
        (function (expected, done) {
          maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
        })(expected, done);
      });

      afterEach(function (done) {
        clearAll(done);
      });
    });
  });
});
