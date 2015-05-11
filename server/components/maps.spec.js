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

describe('The maps module', function () {
  var clearAll = function (done) {
    players.Player.remove({},
      function () {
        teams.Team.remove({}, function () {
          done()
        });
      });
  };

  function checkMapMatches(expected) {
    return function (result) {
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.eql(expected);
      return null;
    };
  }

  var createPlayer = function (path, playerName) {
    return players.Player.create({
      name: playerName,
      email: format("{}@test.smith.com", playerName),
      _team: path
    }).then(function (playerMongoose) {
      return playerMongoose.toObject();
    });
  };

  var createTeam = function (teamPath) {
    var pathElements = teamPath.split('/')
    return teams.Team.create({
      name: pathElements[pathElements.length - 1],
      path: teamPath
    }).then(function (teamMongoose) {
      return teamMongoose.toObject();
    });
  };

  afterEach(clearAll);

  describe("buildTeamPlayersMap", function () {
    it('Given an empty database should respond with an empty array when there are no records in database.', function (done) {
      var expected = [];
      maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
    });

    it("Given only player 'Aang' on team 'avatar' should respond with the appropriate format", function (done) {
      createPlayer('/avatar', "Aang")
        .then(function (aang) {
        var expectedMap = {
          team: 'avatar',
          path: '/avatar',
          players: [aang],
          subTeams: []
        };
        return maps.buildTeamPlayersMap().then(checkMapMatches([expectedMap]));
      }).then(done, done);
    });

    it("Given player 'Aang' AND 'Yung' on team: 'avatar' will return a map containing both.", function (done) {
      RSVP.hash({
        aang: createPlayer('/avatar', "Aang"),
        yung: createPlayer('/avatar', "Yung")
      }).then(function (players) {
        var expectedMap = {
          team: 'avatar',
          path: '/avatar',
          players: [players.aang, players.yung],
          subTeams: []
        };
        return maps.buildTeamPlayersMap().then(checkMapMatches([expectedMap]));
      }).then(done, done);
    });

    it("Player 'Aang' on team: 'avatar' and player 'Yung' on 'fireNation' are separated in map", function (done) {
      RSVP.hash({
        aang: createPlayer('/avatar', "Aang"),
        yung: createPlayer('/fireNation', "Yung")
      }).then(function (players) {
        var expectedMap = [{
          team: 'avatar',
          path: '/avatar',
          players: [players.aang],
          subTeams: []
        }, {
            team: 'fireNation',
            path: '/fireNation',
            players: [players.yung],
            subTeams: []
          }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("Given player 'Aang' on team: 'avatar' under 'fireNation', fireNation shows up inside of avatar", function (done) {
      createPlayer('/fireNation/avatar', "Aang")
        .then(function (aang) {
        var expectedMap = [{
          team: 'fireNation',
          path: '/fireNation',
          players: [],
          subTeams: [{
            team: 'avatar',
            path: '/fireNation/avatar',
            players: [aang],
            subTeams: []
          }]
        }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("can represent multiple players and multiple subteams",
      function (done) {
        RSVP.hash({
          aang: createPlayer('/avatar', "Aang"),
          katara: createPlayer('/avatar', "Katara"),
          zuko: createPlayer('/fireNation/royalty', "Zuko"),
          iroh: createPlayer('/fireNation/royalty', "Iroh")
        }).then(function (players) {
          var expectedMap = [{
            team: 'avatar',
            path: '/avatar',
            players: [players.aang, players.katara],
            subTeams: []
          }, {
              team: 'fireNation',
              path: '/fireNation',
              players: [],
              subTeams: [{
                team: 'royalty',
                path: '/fireNation/royalty',
                players: [players.zuko, players.iroh],
                subTeams: []
              }]
            }];
          return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
        }).then(done, done);
      });

    it('should handle triple team nesting', function (done) {
      RSVP.hash({
        aang: createPlayer('/humans/airNation/avatar', "Aang")
      }).then(function (players) {
        var expectedMap = [{
          team: 'humans',
          path: '/humans',
          players: [],
          subTeams: [{
            team: 'airNation',
            path: '/humans/airNation',
            players: [],
            subTeams: [{
              team: 'avatar',
              path: '/humans/airNation/avatar',
              players: [players.aang],
              subTeams: []
            }]
          }]
        }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it('should handle quintuple team nesting', function (done) {
      RSVP.hash({
        aang: createPlayer('/humans/airNation/avatar', "Aang"),
        zuko: createPlayer('/humans/fireNation/avatar/royalty/scarfaces')
      }).then(function (players) {
        var expectedMap = [{
          team: 'humans',
          path: '/humans',
          players: [],
          subTeams: [{
            team: 'airNation',
            path: '/humans/airNation',
            players: [],
            subTeams: [{
              team: 'avatar',
              path: '/humans/airNation/avatar',
              players: [players.aang],
              subTeams: []
            }]
          }, {
              team: 'fireNation',
              path: '/humans/fireNation',
              players: [],
              subTeams: [{
                team: 'avatar',
                path: '/humans/fireNation/avatar',
                players: [],
                subTeams: [{
                  team: 'royalty',
                  path: '/humans/fireNation/avatar/royalty',
                  players: [],
                  subTeams: [{
                    team: 'scarfaces',
                    path: '/humans/fireNation/avatar/royalty/scarfaces',
                    players: [players.zuko],
                    subTeams: []
                  }]
                }]
              }]
            }]
        }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("can represent players with no team assignment",
      function (done) {
        RSVP.hash({
          aang: createPlayer('/avatar', "Aang"),
          tui: createPlayer(undefined, 'Tui'),
          wan: createPlayer(undefined, 'Wan Shi Ton')
        }).then(function (players) {
          var expectedMap = [{
            team: 'avatar',
            path: '/avatar',
            players: [players.aang],
            subTeams: []
          }, {
              team: 'unassigned',
              path: '/unassigned',
              players: [players.tui, players.wan],
              subTeams: []
            }];
          return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
        }).then(done, done);
      });

    it("Teams that have additional attributes have those attributes in the map.", function (done) {
      RSVP.hash({
        teamAvatar: teams.Team.create({
          path: '/avatar',
          name: 'Avatar',
          image: 'avatar.jpg'
        }),
        aang: createPlayer('/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [{
          team: 'avatar',
          path: '/avatar',
          name: 'Avatar',
          image: 'avatar.jpg',
          players: [prereqs.aang],
          subTeams: []
        }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("Teams from the database include correct paths when nested. This problem only occurs when child team player is created before the parent team player.", function (done) {
      RSVP.hash({
        teamAvatar: createTeam('/avatar'),
        teamChild: createTeam('/avatar/children'),
        aangsKid: createPlayer('/avatar/children', "AangsKid"),
        aang: createPlayer('/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [{
          team: 'avatar',
          path: '/avatar',
          name: 'avatar',
          players: [prereqs.aang],
          subTeams: [
            {
              team: 'children',
              path: '/avatar/children',
              name: 'children',
              players: [prereqs.aangsKid],
              subTeams: []
            }
          ]
        }];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });
  });
});