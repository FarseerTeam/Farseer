/*jshint expr: true*/
var mongoose = require("mongoose");
var players = require("./players");
var teams = require("./teams");
var should = require('should');
var config = require('../config/environment/test');

var dataService = require('./dataService')

dataService.connect();


describe("In the components/players module,", function() {
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
    it("Players can be found by email", function(done) {
        players.findByEmail(currentCustomer.email, function(doc) {
            doc.email.should.equal(currentCustomer.email);
            done();
        }, function(e) {});
    });
    afterEach(function(done) {
        players.Player.remove({}, function() {
            done();
        });
    });

});