/*
   {team: 'fireNation', subteams: [{team: 'royalty', players: [{name: 'Zuko'}, {name: 'Iroh'}]}]}]
   Teams contains Names that are unique
   Teams contains other Teams called subteams
   Teams contains other Teams called subteams that have other subteams

   Players are part of one team


*/

/*jshint expr: true*/
var mongoose = require("mongoose");
var teams = require("./teams");
var should = require('should');
var assert = require('assert');
var config = require('../config/environment/test');

var dataService = require('./dataService')

dataService.connect();

describe("In the components/teams module,", function() {

    describe('a Team ', function() {
        var theTeam = null;

        beforeEach(function(done) {
            teams.Team.create({
                name: "Ford"
            }).then(function(doc) {
                theTeam = doc;
                done();
            }, function(err) {
                    done(err);
            });
        });

        it("contains names", function() {
            theTeam.should.be.ok;
            theTeam.save(function(err, doc) {
                (err === null).should.be.true;
                doc.name.should.eql(theTeam.name);
            });
        });

        it("that is unique ", function() {
            var teamFailed = new teams.Team();
            teamFailed.name = theTeam.name;
            teamFailed.save(function(err) {
                err.should.be.ok;
                (11000).should.eql(err.code);
            });
        });

        it("contains other teams", function(done) {

            var subTeam = new teams.Team();
            subTeam.parent = theTeam;
            subTeam.save(function(err) {
                (err === null).should.be.true;
                theTeam.getChildren(function(err, childrenTeam) {
                    childrenTeam.should.be.instanceof(Array);
                    (subTeam.id).should.be.eql(childrenTeam[0].id);
                    done();
                });
            });
        });

        it('can be searched for by the team Name.', function(done) {
            var success = function(returnedTeam){
                returnedTeam.name.should.equal(theTeam.name);
                returnedTeam.id.should.equal(theTeam.id);
                returnedTeam.path.should.equal(theTeam.path);
                done();
            };

            teams.findByName('Ford', success);
        });

        it('when searched for with a name that does not exist returns null.', function(done) {
            var success = function(returnedTeam){
                assert.equal(returnedTeam, null);
                done();
            };

            teams.findByName('Unknown team', success);
        });

        it('when searched, calls the error callback function if an error is returned from the DB.', function(done) {
            var success = function(returnedTeam){
                unmock();
                should.fail();
            };
            var error = function(error){
                unmock();
                done();
            };
            mockTheDatabase_ToReturnAnError();
            teams.findByName('Expecting error', success, error);
        });

        var actualFindOne;
        var mockTheDatabase_ToReturnAnError = function() {
            actualFindOne = mongoose.Model.findOne;
            mongoose.Model.findOne = function(modelObject, callback){
                callback('Hi this is the error', undefined);
            };
        };

        var unmock = function () {
            mongoose.Model.findOne = actualFindOne;
        };

        afterEach(function(done) {
            teams.Team.remove({}, function() {
                done();
            });
        });
    });

    describe('The findByAnyUniqueIdentifier function... ', function(){
        
        var savedTeam = null;
        var savedSubTeam;

        beforeEach(function(done) {
            teams.Team.create({ name: "The best team" }).then(function(doc) {
                savedTeam = doc;
                teams.Team.create({name: "subteam", parent: doc._id}).then(function(doc) {
                    savedSubTeam = doc;
                    done();
                });
            }, function(err) {
                done(err)
            });
        });

        it("Teams can be found by name", function(done) {
            teams.findByAnyUniqueIdentifier(savedTeam.name, function(doc) {
                validateTeam(doc, done);
            }, function(e) {
                console.log(e);
                should.fail();
            });
        });

        it("Teams can be found by id", function(done) {
            teams.findByAnyUniqueIdentifier(savedTeam._id, function(doc) {
                validateTeam(doc, done);
            }, function(e) {
                should.fail();
            });
        });

        it("Teams can be found by path", function(done) {
            teams.findByAnyUniqueIdentifier(savedTeam.path, function(doc) {
                validateTeam(doc, done);
            }, function(e) {
                should.fail();
            });
        });

        it("Sub-teams can be found by path", function(done) {
            teams.findByAnyUniqueIdentifier(savedSubTeam.path, function(doc) {
                validateSubTeam(doc, done);
            }, function(e) {
                should.fail();
            });
        });

        it("'null' is returned (with no error) if no team matches the passed value.", function(done) {
            teams.findByAnyUniqueIdentifier('bad-value', function(doc) {
                should.not.exist(doc);
                done();
            }, function(e) {
                should.fail();
            });
        });

        var validateTeam = function(team, done) {
            should.exist(team);
            savedTeam.name.should.equal(team.name);
            savedTeam.path.should.equal(team.path);
            (savedTeam._id.equals(team._id)).should.be.ok;
            done();
        }

        var validateSubTeam = function(team, done) {
            should.exist(team);
            savedSubTeam.name.should.equal(team.name);
            savedSubTeam.path.should.equal(team.path);
            (savedSubTeam._id.equals(team._id)).should.be.ok;
            done();
        }

        afterEach(function(done) {
            teams.Team.remove({}, function() {
                done();
            });
        });

        describe("if there is a database error... ", function() {

            var actualDatabaseFindOneFunction;
            var actualDatabaseFindByIdFunction;
            var findByNameError = 'findByNameError';
            var expectedIdError = 'findByIdError';
            var validId = '552058b0469006560cad7c58';
            var name = "Team the best team";

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
                    callback(findByNameError, undefined);
                };
                mongoose.Model.findById = function(id, callback) {
                    callback(expectedIdError, undefined);
                };
            };

            var unmock = function() {
                mongoose.Model.findOne = actualDatabaseFindOneFunction;
                mongoose.Model.findById = actualDatabaseFindByIdFunction;
            }

            it("the error function is called with the error returned from the database when finding by name.", function(done) {
                teams.findByAnyUniqueIdentifier(name, function(doc) {
                    should.fail();
                }, function(error) {
                    findByNameError.should.be.equal(error);
                    done();
                });
            });

            it("the error function is called with the error returned from the database when finding by id.", function(done) {
                teams.findByAnyUniqueIdentifier(validId, function(doc) {
                    should.fail();
                }, function(error) {
                    expectedIdError.should.be.equal(error);
                    done();
                });
            });

        });

    });

});