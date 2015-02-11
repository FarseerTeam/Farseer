var should = require('should');
var teams = require("./teams")
var players = require("./players")
var maps = require("./maps");
var dataService = require('./dataService')
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



var createTeam = function(teamName, playerNames, callback) {
    teams.Team.create({
        name: teamName,
    }, function(err, parentTeam) {
        createPlayers(parentTeam, playerNames, callback);

    });

};
var createPlayers = function(parentTeam, playerNames, callback) {
    function endIfLast(index) {
        if ((1 + index) === playerNames.length) {
            callback();
        }
    }
    if (playerNames)
        callback();
    else
        _.each(playerNames, function(playerName, index) {
            players.Player.create({
                name: playerName,
                email: format("{}@test.smith.com", playerName),
                _team: parentTeam
            }, function(err, doc) {
                endIfLast(index);
            });
        });

};
var createParentTeam = function(teamName, playerNames, subTeamCallBack) {
    function endIfLast(theTeam, index) {
        if ((1 + index) === playerNames.length) {
            subTeamCallBack(theTeam);
        }
    }
    teams.Team.create({
        name: teamName,
    }, function(err, doc) {
        var theTeam = doc;

        createPlayers(theTeam, playerNames, function() {
            subTeamCallBack(theTeam);
        });

    });
};

var createSubTeam = function(parentTeam, teamName, playerNames, callback) {
    teams.Team.create({
        parent: parentTeam,
        name: teamName,

    }, function(err, doc) {
        var theTeam = doc;
        createPlayers(doc, playerNames, callback);
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
    maps.buildTeamPlayersMap(function(result) {
        result.should.be.instanceof(Array);
        expected.should.be.eql(result);
        done()
    });
};

describe('maps.buildTeamPlayersMap', function() {
    describe('when database is empty ', function() {
        it('should respond with an empty array', function(done) {
            execAndCheck([], done);
        });
    });

    describe("Given player 'Aang' on team: 'avatar", function() {

        beforeEach(function(done) {
            createTeam("avatar", ["Aang"], done);
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

    describe("Given player 'Aang' and 'Yung' on team: 'avatar", function() {
        beforeEach(function(done) {
            createTeam("avatar", ["Aang", "Yung"], done);
        });

        it("should respond with the appropriate format {team: 'avatar', players: [{name: 'Aang'}, {name:'Yung'}]},", function(done) {

            var expected = {
                team: 'avatar',
                players: [{
                    name: 'Aang'
                }, {
                    name: 'Yung'
                }]
            };

            execAndCheck([expected], done);

        });


        afterEach(function(done) {
            clearAll(done);
        });
    });

    // var buildTeam = function(name){
    //     var promisse = { withPlayers : function(){}};
    //     return function(){

    //     }();
    // }
    //            buildTeam("avatar").withPlayers(["Aang"])//
    //                    .buildTeam("fireNation").withPlayers("Yung").then(done);

    describe("Given player 'Aang' on team: 'avatar' and player 'Yung' on 'fireNation'", function() {

        beforeEach(function(done) {
            createTeam("avatar", ["Aang"],
                function() {
                    createTeam("fireNation", ["Yung"], done)
                });

        });

        it("should respond with the appropriate format ", function(done) {

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

            execAndCheck([teamOne, teamTwo], done);

        });


        afterEach(function(done) {
            clearAll(done);
        });
    });

    describe("Given player 'Aang' on team: 'avatar' under 'fireNation'", function() {

        beforeEach(function(done) {
            createParentTeam("fireNation", [],
                function(parentTeam) {
                    createSubTeam(parentTeam, "avatar", ["Aang"], done);
                });
        });

        it("should respond with the appropriate format ", function(done) {

            var teamNode = {
                team: 'fireNation',
                players: [],
                subTeams: [{
                    team: "avatar",
                    players: ["Aang"]
                }]
            };

            execAndCheck([teamNode], done);

        });


        afterEach(function(done) {
            clearAll(done);
        });
    });
});