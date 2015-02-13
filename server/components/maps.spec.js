var should = require('should');
var teams = require("./teams")
var players = require("./players")
var maps = require("./maps");
var dataService = require('./dataService')
var _ = require('lodash');
var format = require("string-format");
format.extend(String.prototype);
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
 
describe('In the api/components/maps module,', function() {
    var clearAll = function(done) {
        players.Player.remove({},
            function() {
                teams.Team.remove({}, function() {
                    done()
                });
            });
    };

    var callDone = function(done) {
        return function() {
            //console.log("Calling Done");
            done();
        };
    }

    var callDoneWithError = function(done) {
        return function(err) {
            //console.log("Done with Error");
            done(err);
        }
    }

    var execAndCheck = function(expected, done) {
        //console.log("Executing ");
        maps.buildTeamPlayersMap(function(result) {
            result.should.be.instanceof(Array);
            expected.should.be.eql(result);
            callDone(done)();
        });
    };



    var createTeam = function(teamName) {
        //console.log("Creating team %s ", teamName);
        return teams.Team.create({
            name: teamName,
        });

    };
    var createPlayer = function(team, playerName) {
        //console.log("Creating player %s for team %s", playerName, team.name);
        return players.Player.create({
            name: playerName,
            email: format("{}@test.smith.com", playerName),
            _team: team
        });
    };
    var doCreatePlayer = function(team, playerName) {
        return function() {
            return createPlayer(team, playerName)
        }
    };
    var shouldReturn = function(obj) {
        return "Should return {} ".format(JSON.stringify(obj));
    }
    describe('for the buildTeamPlayersMap function', function() {
        describe('Given an empty database', function() {
            beforeEach(function(done) {
                clearAll(done);
            });
            it('should respond with an empty array when there are no records in database.', function(done) {
                execAndCheck([], done);
            });

        });

        describe("Given player 'Aang' on team: 'avatar", function() {

            beforeEach(function(done) {
                createTeam("avatar").then(
                    function(team) {
                        return createPlayer(team, "Aang");
                    },
                    function(err) {
                        done(err);
                    }
                ).then(callDone(done), callDoneWithError(done));
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
                clearAll(callDone(done));
            });
        });

        describe("Given player 'Aang' AND 'Yung' on team: 'avatar", function() {
            beforeEach(function(done) {

                createTeam("avatar").then(
                    function(team) {
                        createPlayer(team, "Aang")
                            .then(doCreatePlayer(team, "Yung"))
                            .then(callDone(done, callDoneWithError(done)));
                    });
            });
            var expected = {
                team: 'avatar',
                players: [{
                    name: 'Aang'
                }, {
                    name: 'Yung'
                }]
            };

            it(shouldReturn(expected), function(done) {

                execAndCheck([expected], done);

            });


            afterEach(function(done) {
                clearAll(done);
            });
        });


        describe("Given player 'Aang' on team: 'avatar' and player 'Yung' on 'fireNation'", function() {


            beforeEach(function(done) {

                var p = createTeam("avatar").then(
                    function(team) {
                        return createPlayer(team, "Aang");
                    });
                p = p.then(createTeam("fireNation").then(
                    function(team) {
                        return createPlayer(team, "Yung");
                    }));

                p = p.then(callDone(done), callDoneWithError(done));
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

            it(shouldReturn([teamOne, teamTwo]), function(done) {


                execAndCheck([teamOne, teamTwo], done);

            });


            afterEach(function(done) {
                clearAll(done);
            });
        });

        xdescribe("Given player 'Aang' on team: 'avatar' under 'fireNation'", function() {

            beforeEach(function(done) {
                done();
            });

            var teamNode = {
                team: 'fireNation',
                players: [],
                subTeams: [{
                    team: "avatar",
                    players: ["Aang"]
                }]
            };
            it(shouldReturn(teamNode), function(done) {



                execAndCheck([teamNode], done);

            });


            afterEach(function(done) {
                clearAll(done);
            });
        });
    });
});