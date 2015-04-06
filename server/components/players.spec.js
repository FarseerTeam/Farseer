/*jshint expr: true*/
var mongoose = require("mongoose");
var players = require("./players");
var teams = require("./teams");
var should = require('should');
var config = require('../config/environment/test');

var dataService = require('./dataService')

dataService.connect();


describe("In the components/players module,", function() {

    describe("A player ", function() {
        
        it("has an optional team reference", function(done) {
            
            var theTeam;

            teams.Team.create({
                name: "Ford"
            }).then(function(team) {
                should(team._id).be.ok;
                theTeam = team;

                var thePlayer = {
                    name: "AJohn",
                    email: "Atest@test.com",
                    _team: team
                };

                return players.Player.create(thePlayer);
            }, function(err) {
                done(err)
            }).then(function(player) {
                should(theTeam._id.equals(player._team)).be.truthy;

                done();
            }, function(err) {
                done(err)
            });

        });

        afterEach(function(done) {
            players.Player.remove({}, function() {
                teams.Team.remove({}, function() {
                    done();
                })
            });
        });

    });

    
    describe("In the findByEmail function... ", function(){

        //holds a players to use in the each test
        var currentCustomer = null;

        beforeEach(function(done) {

            //add some test data
            players.Player.create({
                name: "John",
                email: "test@test.com"
            }).then(function(doc) {
                currentCustomer = doc;
                done();
            }, function(err) {
                done(err)
            });
        });

        it("Players can be found by email", function(done) {
            players.findByEmail(currentCustomer.email, function(doc) {
                doc.email.should.equal(currentCustomer.email);
                done();
            }, function(e) {});
        });

        it("'null' is returned (with no error) if no player matches the email.", function(done) {
            players.findByEmail('bad-email@noplace.com', function(doc) {
                should.not.exist(doc);
                done();
            }, function(e) {
                should.fail();
            });
        });

        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });

    });

    describe("In the findByAnyUniqueIdentifier function... ", function(){

        var savedPlayer = null;

        beforeEach(function(done) {
            players.Player.create({
                name: "John",
                email: "test@tst.com"
            }).then(function(doc) {
                savedPlayer = doc;
                done();
            }, function(err) {
                done(err)
            });
        });

        it("Players can be found by email", function(done) {
            players.findByAnyUniqueIdentifier(savedPlayer.email, function(doc) {
                validatePlayer(doc, done);
            }, function(e) {
                console.log(e);
                should.fail();
            });
        });

        it("Players can be found by id", function(done) {
            players.findByAnyUniqueIdentifier(savedPlayer._id, function(doc) {
                validatePlayer(doc, done);
            }, function(e) {
                should.fail();
            });
        });

        it("'null' is returned (with no error) if no player matches the passed value.", function(done) {
            players.findByAnyUniqueIdentifier('bad-value', function(doc) {
                should.not.exist(doc);
                done();
            }, function(e) {
                should.fail();
            });
        });

        var validatePlayer = function(player, done) {
            should.exist(player);
            savedPlayer.name.should.equal(player.name);
            savedPlayer.email.should.equal(player.email);
            (savedPlayer._id.equals(player._id)).should.be.ok;
            done();
        }

        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });

        describe("if there is a database error... ", function() {

            var actualDatabaseFindOneFunction;
            var actualDatabaseFindByIdFunction;
            var expectedEmailError = 'findByEmailError';
            var expectedIdError = 'findByIdError';
            var validId = '552058b0469006560cad7c58';
            var email = "hi@there.com";

            beforeEach(function(done) {
                mockTheDatabase_ToReturnAnError();
                done();
            });

            afterEach(function(done) {
                unmock();
                done();
            });

            var mockTheDatabase_ToReturnAnError = function() {
                actualDatabaseFindOneFunction = mongoose.Model.findOne;
                actualDatabaseFindByIdFunction = mongoose.Model.findById;

                mongoose.Model.findOne = function(modelObject, callback) {
                    callback(expectedEmailError, undefined);
                };
                mongoose.Model.findById = function(id, callback) {
                    callback(expectedIdError, undefined);
                };
            };

            var unmock = function() {
                mongoose.Model.findOne = actualDatabaseFindOneFunction;
                mongoose.Model.findById = actualDatabaseFindByIdFunction;
            }

            it("the error function is called with the error returned from the database when finding by email.", function(done) {
                players.findByAnyUniqueIdentifier(email, function(doc) {
                    should.fail();
                }, function(error) {
                    expectedEmailError.should.be.equal(error);
                    done();
                });
            });

            it("the error function is called with the error returned from the database when finding by id.", function(done) {
                players.findByAnyUniqueIdentifier(validId, function(doc) {
                    should.fail();
                }, function(error) {
                    expectedIdError.should.be.equal(error);
                    done();
                });
            });

        });

    });

});