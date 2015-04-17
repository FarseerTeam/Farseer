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

describe('The maps module', function () { //jshint ignore:line
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

  afterEach(clearAll);

  describe("buildTeamPlayersMap", function () {
    it('Given an empty database should respond with an empty array when there are no records in database.', function (done) {
      var expected = [];
      maps.buildTeamPlayersMap().then(checkMapMatches(expected)).then(done, done);
    });

    it("Given only player 'Aang' on team: 'avatar should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}]},", function (done) {
      createPlayer('/avatar', "Aang")
        .then(function (aang) {
          var expectedMap = {
            team: 'avatar',
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
          players: [players.aang],
          subTeams: []
        }, {
          team: 'fireNation',
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
            players: [],
            subTeams: [{
              team: 'avatar',
              players: [aang],
              subTeams: []
            }]
          }];
          return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
        }).then(done, done);
    });

    it("Given players: [{name:'Zuko', team:'/fireNation/royalty'}, " +
    "{name: 'Aang', team: '/avatar}, {name: 'Katara', team: '/avatar' }" +
    ", {name: 'Iroh', team: '/fireNation/royalty'}]", function (done) {
      RSVP.hash({
        aang: createPlayer('/avatar', "Aang"),
        katara: createPlayer('/avatar', "Katara"),
        zuko: createPlayer('/fireNation/royalty', "Zuko"),
        iroh: createPlayer('/fireNation/royalty', "Iroh")
      }).then(function (players) {
        var expectedMap = [
          {team: 'avatar', players: [players.aang, players.katara], subTeams: []},
          {
            team: 'fireNation', players: [],
            subTeams: [{team: 'royalty', players: [players.zuko, players.iroh], subTeams: []}]
          }
        ];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("Players with no team assignment exist in the map.  " +
    "Given players: [{name:'Tui'}, {name:'Wan Shi Tong'}, {name: 'Aang', team: '/avatar}]", function (done) {
      RSVP.hash({
        aang: createPlayer('/avatar', "Aang"),
        tui: createPlayer(undefined, 'Tui'),
        wan: createPlayer(undefined, 'Wan Shi Ton')
      }).then(function (players) {
        var expectedMap = [
          {team: 'avatar', players: [players.aang], subTeams: []},
          {team: undefined, players: [players.tui, players.wan], subTeams: []}
        ];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });

    it("Teams that have additional attributes have those attributes in the map.", function (done) {
      RSVP.hash({
        teamAvatar: teams.Team.create({path: '/avatar', name: 'Avatar', image: 'avatar.jpg'}),
        aang: createPlayer('/avatar', "Aang")
      }).then(function (prereqs) {
        var expectedMap = [
          {team: 'avatar', path: '/avatar', name: 'Avatar', image: 'avatar.jpg', players: [prereqs.aang], subTeams: []}
        ];
        return maps.buildTeamPlayersMap().then(checkMapMatches(expectedMap));
      }).then(done, done);
    });
  });
});