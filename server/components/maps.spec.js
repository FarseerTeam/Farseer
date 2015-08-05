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

  var createPlayer = function (worldId, path, playerName) {
    return players.Player.create({
      name: playerName,
      email: format("{}@test.smith.com", playerName),
      world: worldId,
      _team: path
    }).then(function (playerMongoose) {
      return playerMongoose.toObject();
    });
  };

  var createTeam = function (teamPath, worldId) {
    var pathElements = teamPath.split('/');
    return teams.Team.create({
      name: pathElements[pathElements.length - 1],
      path: teamPath,
      world: worldId
    }).then(function (teamMongoose) {
      return teamMongoose.toObject();
    });
  };

  afterEach(clearAll);

  describe("buildTeamPlayersMap", function () {
    it('should respond with an empty map when there are no records in database.', function (done) {
      var expected = [];
      maps.buildTeamPlayersMap('world').then(checkMapMatches(expected)).then(done, done);
    });

    it("should handle single player on a team", function (done) {
      createPlayer('world', '/avatar', "Aang")
        .then(function (aang) {
          var expectedMap = {
            pathElement: 'avatar',
            path: '/avatar',
            players: [aang],
            subTeams: []
          };
          return maps.buildTeamPlayersMap('world').then(checkMapMatches([expectedMap]));
        }).then(done, done);
    });

    it("should only return player from the requested world", function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/avatar', "Aang"),
        yung: createPlayer('anotherWorld', '/avatar', "Yung")
      }).then(function (players) {
        var expectedMap = {
          pathElement: 'avatar',
          path: '/avatar',
          players: [players.aang],
          subTeams: []
        };
        return maps.buildTeamPlayersMap('world').then(checkMapMatches([expectedMap]));
      }).then(done, done);
    });

    it("should handle two players on the same team", function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/avatar', "Aang"),
        yung: createPlayer('world', '/avatar', "Yung")
      }).then(function (players) {
        var expectedMap = {
          pathElement: 'avatar',
          path: '/avatar',
          players: [players.aang, players.yung],
          subTeams: []
        };
        return maps.buildTeamPlayersMap('world').then(checkMapMatches([expectedMap]));
      }).then(done, done);
    });

    it("should handle two players on two separate teams", function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/avatar', "Aang"),
        yung: createPlayer('world', '/fireNation', "Yung")
      }).then(function (players) {
        var expectedMap = [{
          pathElement: 'avatar',
          path: '/avatar',
          players: [players.aang],
          subTeams: []
        }, {
            pathElement: 'fireNation',
            path: '/fireNation',
            players: [players.yung],
            subTeams: []
          }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("should handle single player on a subteam", function (done) {
      createPlayer('world', '/fireNation/avatar', "Aang")
        .then(function (aang) {
          var expectedMap = [{
            pathElement: 'fireNation',
            path: '/fireNation',
            players: [],
            subTeams: [{
              pathElement: 'avatar',
              path: '/fireNation/avatar',
              players: [aang],
              subTeams: []
            }]
          }];
          return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
        }).then(done, done);
    });

    it("should return only players on a specified subteam", function (done) {
      createPlayer('world', '/fireNation/avatar', "Aang")
        .then(function (aang) {
          var expectedMap = [{
            pathElement: 'avatar',
            path: '/fireNation/avatar',
            players: [aang],
            subTeams: []
          }];
          return maps.buildTeamPlayersMap('world', "/fireNation/avatar").then(checkMapMatches(expectedMap));
        }).then(done, done);
    });

    it("should return only players on a specified double nested subteam", function (done) {
      createPlayer('world', '/fireNation/avatar/airbender', "Aang")
        .then(function (aang) {
          var expectedMap = [{
            pathElement: 'airbender',
            path: '/fireNation/avatar/airbender',
            players: [aang],
            subTeams: []
          }];
          return maps.buildTeamPlayersMap('world', "/fireNation/avatar/airbender").then(checkMapMatches(expectedMap));
        }).then(done, done);
    });

    it("should return the entire map when requested path is not valid", function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/firenation/avatar', "Aang"),
        yung: createPlayer('world', '/firenation', "Yung")
      }).then(function (players) {
        var expectedMap = [{
          pathElement: 'firenation',
          path: '/firenation',
          players: [players.yung],
          subTeams: [{
            pathElement: 'avatar',
            path: '/firenation/avatar',
            players: [players.aang],
            subTeams: []
          }]
        }];
        return maps.buildTeamPlayersMap('world', '/firenation/airbender').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("should handle multiple players and multiple subteams",
      function (done) {
        RSVP.hash({
          aang: createPlayer('world', '/avatar', "Aang"),
          katara: createPlayer('world', '/avatar', "Katara"),
          zuko: createPlayer('world', '/fireNation/royalty', "Zuko"),
          iroh: createPlayer('world', '/fireNation/royalty', "Iroh")
        }).then(function (players) {
          var expectedMap = [{
            pathElement: 'avatar',
            path: '/avatar',
            players: [players.aang, players.katara],
            subTeams: []
          }, {
              pathElement: 'fireNation',
              path: '/fireNation',
              players: [],
              subTeams: [{
                pathElement: 'royalty',
                path: '/fireNation/royalty',
                players: [players.zuko, players.iroh],
                subTeams: []
              }]
            }];
          return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
        }).then(done, done);
      });

    it('should handle triple team nesting', function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/humans/airNation/avatar', "Aang")
      }).then(function (players) {
        var expectedMap = [{
          pathElement: 'humans',
          path: '/humans',
          players: [],
          subTeams: [{
            pathElement: 'airNation',
            path: '/humans/airNation',
            players: [],
            subTeams: [{
              pathElement: 'avatar',
              path: '/humans/airNation/avatar',
              players: [players.aang],
              subTeams: []
            }]
          }]
        }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it('should handle quintuple team nesting', function (done) {
      RSVP.hash({
        aang: createPlayer('world', '/humans/airNation/avatar', "Aang"),
        zuko: createPlayer('world', '/humans/fireNation/avatar/royalty/scarfaces')
      }).then(function (players) {
        var expectedMap = [{
          pathElement: 'humans',
          path: '/humans',
          players: [],
          subTeams: [{
            pathElement: 'airNation',
            path: '/humans/airNation',
            players: [],
            subTeams: [{
              pathElement: 'avatar',
              path: '/humans/airNation/avatar',
              players: [players.aang],
              subTeams: []
            }]
          }, {
              pathElement: 'fireNation',
              path: '/humans/fireNation',
              players: [],
              subTeams: [{
                pathElement: 'avatar',
                path: '/humans/fireNation/avatar',
                players: [],
                subTeams: [{
                  pathElement: 'royalty',
                  path: '/humans/fireNation/avatar/royalty',
                  players: [],
                  subTeams: [{
                    pathElement: 'scarfaces',
                    path: '/humans/fireNation/avatar/royalty/scarfaces',
                    players: [players.zuko],
                    subTeams: []
                  }]
                }]
              }]
            }]
        }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("should handle players with no team assignment",
      function (done) {
        RSVP.hash({
          aang: createPlayer('world', '/avatar', "Aang"),
          tui: createPlayer('world', undefined, 'Tui'),
          wan: createPlayer('world', undefined, 'Wan Shi Ton')
        }).then(function (players) {
          var expectedMap = [{
            pathElement: 'avatar',
            path: '/avatar',
            players: [players.aang],
            subTeams: []
          }, {
              pathElement: 'unassigned',
              path: '/unassigned',
              players: [players.tui, players.wan],
              subTeams: []
            }];
          return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
        }).then(done, done);
      });

    it("Teams that have additional attributes have those attributes in the map", function (done) {
      RSVP.hash({
        teamAvatar: teams.Team.create({
          path: '/avatar',
          name: 'Avatar',
          image: 'avatar.jpg',
          world: 'world'
        }),
        aang: createPlayer('world', '/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [{
          pathElement: 'avatar',
          path: '/avatar',
          name: 'Avatar',
          image: 'avatar.jpg',
          players: [prereqs.aang],
          subTeams: []
        }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("teams attributes from the wrong world are excluded", function (done) {
      RSVP.hash({
        teamAvatar: teams.Team.create({
          path: '/avatar',
          name: 'Avatar',
          image: 'avatar.jpg',
          world: 'nowhere'
        }),
        aang: createPlayer('world', '/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [{
          pathElement: 'avatar',
          path: '/avatar',
          players: [prereqs.aang],
          subTeams: []
        }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("Teams from the database include correct paths when nested. This problem only occurs when child team player is created before the parent team player.", function (done) {
      RSVP.hash({
        teamAvatar: createTeam('/avatar', 'world'),
        teamChild: createTeam('/avatar/children', 'world'),
        aangsKid: createPlayer('world', '/avatar/children', "AangsKid"),
        aang: createPlayer('world', '/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [{
          pathElement: 'avatar',
          path: '/avatar',
          name: 'avatar',
          players: [prereqs.aang],
          subTeams: [
            {
              pathElement: 'children',
              path: '/avatar/children',
              name: 'children',
              players: [prereqs.aangsKid],
              subTeams: []
            }
          ]
        }];
        return maps.buildTeamPlayersMap('world').then(checkMapMatches(expectedMap));
      }).then(done, done);
    });
  });
});
