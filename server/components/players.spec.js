/*jshint expr: true*/
var mongoose = require("mongoose");
var players = require("./players");
var teams = require("./teams");
var should = require('should');
var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var config = require('../config/environment/test');
var rsvp = require('rsvp');

var dataService = require('./dataService');

dataService.connect();


describe("Player", function() {

    describe("finding by unique identifier", function(){

        var savedPlayer = null;

        beforeEach(function(done) {
            players.Player.create({
                name: "John",
                email: "test@tst.com",
                world: "michigan"
            }).then(function(doc) {
                savedPlayer = doc;
                done();
            }, function(err) {
                done(err)
            });
        });

        it("should find player by email and world", function(done) {
            players.findByAnyUniqueIdentifier(savedPlayer.world, savedPlayer.email, function(doc) {
                validatePlayer(doc, done);
            }, function(e) {
                should.fail();
            });
        });

        it("should find player by id and world", function(done) {
            players.findByAnyUniqueIdentifier(savedPlayer.world, savedPlayer._id, function(doc) {
                validatePlayer(doc, done);
            }, function(e) {
                should.fail();
            });
        });
        
        it("should NOT find player out of this world by email", function(done){
            players.findByAnyUniqueIdentifier('Nebraska', savedPlayer.email, function(doc) {
                expect(doc).to.not.exist();
                done();
            }, done);
        });
        
        it("should NOT find player out of this world by id", function(done){
            players.findByAnyUniqueIdentifier('Nebraska', savedPlayer._id, function(doc) {
                expect(doc).to.not.exist();
                done();
            }, done);
        });

        it("'null' is returned (with no error) if no player matches the passed value.", function(done) {
            players.findByAnyUniqueIdentifier(savedPlayer.world,'bad-value', function(doc) {
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

        describe("if there is a database error", function() {

            var actualDatabaseFindOneFunction;
            var actualDatabaseFindByIdFunction;
            var expectedError = 'IAmError';
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
                    callback(expectedError, undefined);
                };
            };

            var unmock = function() {
                mongoose.Model.findOne = actualDatabaseFindOneFunction;
                mongoose.Model.findById = actualDatabaseFindByIdFunction;
            }

            it("the error function is called with the error returned from the database when finding", function(done) {
                players.findByAnyUniqueIdentifier('world', email, function(doc) {
                    should.fail();
                }, function(error) {
                    expectedError.should.be.equal(error);
                    done();
                });
            });
        });
    });
});