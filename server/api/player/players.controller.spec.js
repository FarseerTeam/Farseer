'use strict';

var nextIfError = require("callback-wrappers").nextIfError;
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var players = require("../../components/players");
var teams = require("../../components/teams");
var dataService = require('../../components/dataService');
var format = require('string-format');
var mongoose = require('mongoose');

dataService.connect();

describe('/api/players', function() {
    describe('GET ', function() {
        var smith;

        beforeEach(function(done) {
            players.Player.create({
                name: "Smith ",
                email: "test@test.smith.com"
            }, function(err, doc) {
                smith = doc;
                done();
            });
        });

        it('should respond with JSON array', function(done) {
            request(app)
            .get('/api/players')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                smith.id.should.be.equal(res.body[0]._id);
                done();
            });
        });

        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });
    });

    //curl http://localhost:9000/api/players
    //curl -H "Content-Type: application/json" -d '{"name":"pedro","email":"pedro@email"}' http://localhost:9000/api/players
    describe('POST ', function() {
        it('should create players', function(done) {
            request(app)
            .post('/api/players')
            .send({
                name: 'Manny',
                email: 'cat@email.com'
            })
        .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });

        describe('when adding duplicate player', function() {
          beforeEach(function(done) {
              players.Player.create({
                  name: "Smith ",
                  email: "test@test.smith.com"
              }, function(err, doc) {
                  done();
              });
          });

          it('should return a human error message', function(done) {
            request(app)
              .post('/api/players')
              .send({
                  name: 'Smith',
                  email: 'test@test.smith.com'
              })
              .set('Accept', 'application/json')
              .expect(409)
              .expect('Content-Type', /json/)
              .expect({message: "A player with email test@test.smith.com already exists"}, function(error) {
                done(error);
              });

          });
        });

        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });
    });


});

describe('/api/players/:player_id', function() {

    describe('GET ', function() {
        var smith;

        beforeEach(function(done) {
            players.Player.create({
                name: "Smith ",
                email: "test@test.smith.com"
            },
            function(err, doc) {
                smith = doc;
                done();
            });
        });

        it('will return a valid object if exists ', function(done) {
            var url = '/api/players/' + smith.id;
            request(app)
            .get(url)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                smith.name.should.be.equal(res.body.name);
                smith.email.should.be.equal(res.body.email);
                done();
            });
        });

        it("will understand a player's email if passed as the player_id.", function(done) {
            var url = '/api/players/' + smith.email;
            request(app)
            .get(url)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                smith.name.should.be.equal(res.body.name);
                smith.email.should.be.equal(res.body.email);
                done();
            });
        });

        it('will return an empty object with error information ', function(done) {
            var randomId = parseInt(Math.random() * 1000);
            var url = '/api/players/' + randomId;
            request(app)
            .get(url)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(
                nextIfError(
                    function(res) {
                        res.body.message.should.be.equal(format("PLAYER with identifier '{}' does not exist.", randomId));
                        done();
                    },
                    function(err) {
                        done(err);
                    }
                    ));
        });
        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });
    });
   

    describe('DELETE', function() {
        var smith;
        beforeEach(function(done) {
            players.Player.create({
                name: "Smith ",
                email: "test@test.smith.com"
            },
            function(err, doc) {
                smith = doc;
                done();
            });
        });
        it('will remove an valid object ', function(done) {
            var url = '/api/players/' + smith.id;
            request(app)
            .delete(url)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });
    });


    describe('PUT', function() {
        var smith, anderson;
        var smithChanged = {
            name: 'Smith Update',
            email: 'email@changed.com'
        };

        beforeEach(function(done) {
            players.Player.create({
                name: "Smith ",
                email: "test@test.smith.com"
            },
            function(err, doc) {
                smith = doc;
                done();
            });
        });

        it('will update a valid object ', function(done) {
            var url = '/api/players/' + smith.id;

            request(app)
            .put(url)
            .send(smithChanged)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if(err) return done(err);
                players.Player.findById(smith.id, function(err, doc) {
                    if (err) return done(err);
                    doc.name.should.be.equal(smithChanged.name);
                    doc.email.should.be.equal(smithChanged.email);
                    done();
                });
            });
        });

        describe('when using duplicate email', function() {
          beforeEach(function(done) {
              players.Player.create({
                  name: "Anderson",
                  email: "neo@matrix.com"
              },
              function(err, doc) {
                  anderson = doc;
                  done();
              });
          });

          it('should return a human error message', function(done) {

            request(app)
              .put('/api/players/' + smith.id)
              .send({
                  name: 'Smitty',
                  email: anderson.email
              })
              .set('Accept', 'application/json')
              .expect(409)
              .expect('Content-Type', /json/)
              .expect({message: "A player with email " + anderson.email + " already exists"}, function(error) {
                done(error);
              });

          });

        });

        afterEach(function(done) {
            players.Player.remove({}, function() {
                done();
            });
        });

        describe('when updating the team as part of the update... ', function() {

            var expectedPlayer = {
                name: 'Harry Potter',
                email: 'Harry@gmail.com'      
            };


            describe('Given the _team field in the reqest body... ', function(){

                var team;
                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        expectedPlayer._team = createdTeam.path;
                        team = createdTeam;
                        createPlayer(undefined, 'Harry Potter', function() {
                            done();
                        });
                    });
                });                 

                afterEach(function(done){
                    clearAll(done);
                });

                it('it is ok to pass the TEAM PATH as the value.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, team.path, expectedPlayer, done);
                });

                it('it is ok to pass the TEAM _ID as the value.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, team._id, expectedPlayer, done);
                });

                it('it is ok to pass the TEAM NAME as the value.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, team.name, expectedPlayer, done);
                });
            });


            describe('When the player does not already have a team... ', function(){

                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        expectedPlayer._team = createdTeam.path;
                        createPlayer(undefined, 'Harry Potter', function() {
                            done();
                        });
                    });
                });                 

                afterEach(function(done){
                    clearAll(done);
                });

                it('updating the player with an existing team assigns the player to the team.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
                });
            });


            describe('When the player is already assigned to a tema... ', function(){

                beforeEach(function(done) {
                    createTeam('Muggle', function(createdTeam) {
                        createPlayer(createdTeam, 'Harry Potter', function() {
                            createTeam('Gryffindor', function(targetTeam) {
                                expectedPlayer._team = targetTeam.path;
                                done();
                            });
                        });
                    });
                });

                afterEach(function(done){
                    clearAll(done);
                });

                it('updating with a new team removes the player from the old team and puts the player on the new team.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
                });
            });


            describe('Given a player with an existing assignment...', function(){

                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        expectedPlayer._team = createdTeam.path;
                        createPlayer(createdTeam, 'Harry Potter', function() {
                            done();
                        });
                    });
                });

                afterEach(function(done){
                    clearAll(done);
                });

                it('updating with the same team returns an unchanged player.', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
                });
            });


            describe('When trying to assign a player to a subTeam...', function(){

                var expectedTeam;
                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        createPlayer(createdTeam, 'Harry Potter', function() {
                            createTeamWithSubteam('Hogwarts', createdTeam, function(subTeam) {
                                expectedTeam = subTeam;
                                expectedPlayer._team = subTeam._id;
                                done();
                            });
                        });
                    });
                });

                afterEach(function(done){
                    clearAll(done);
                });

                it('the update is successful with a team name', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedTeam.name, expectedPlayer, done);
                });

                it('the update is successful with a team path', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedTeam.path, expectedPlayer, done);
                });

                it('the update is successful with a team id', function(done) {
                    performUpdateAndCheck(expectedPlayer.email, expectedTeam._id, expectedPlayer, done);
                });
            });


            describe('When a team that does not exist is used to update... ', function(){

                var nonexistentId = 'ffffffffffffffffffffffff';

                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        createPlayer(createdTeam, 'Harry Potter', function() {
                            done();
                        });
                    });
                });

                afterEach(function(done){
                    clearAll(done);
                });

                var expectedError = {message: "A team with identifier '" + nonexistentId + "' does not exist"};

                it('the application returns 404', function(done) {
                    performUpdateAndCheckForError(expectedPlayer.email, nonexistentId, expectedError, 404, done);
                });
            });


            describe('Given an email with no associated player... ', function(){

                beforeEach(function(done) {
                    createTeam('Gryffindor', function(createdTeam) {
                        createPlayer(createdTeam, 'Harry Potter', function() {
                            done();
                        });
                    });
                });

                afterEach(function(done){
                    clearAll(done);
                });

                var expectedError = {message: "PLAYER with identifier 'Nonexistent@gmail.com' does not exist."};
                
                it('the application returns 404', function(done) {
                    performUpdateAndCheckForError('Nonexistent@gmail.com', 'Gryffindor', expectedError, 404, done);
                });
            });


            describe('Given an unexpected application error... ', function(){

                var actualFindOneFunction;

                beforeEach(function(done) {
                    mockTheDatabase_ToReturnAnError();
                    done();
                });

                var mockTheDatabase_ToReturnAnError = function() {
                    actualFindOneFunction = mongoose.Model.findOne;
                    mongoose.Model.findOne = function(modelObject, callback) {
                        callback('error', undefined);
                    };
                };

                var unmock = function() {
                    mongoose.Model.findOne = actualFindOneFunction;
                };

                afterEach(function(done){
                    unmock();
                    clearAll(done);
                });

                var expectedError = {err: 'error', message: 'An unexpected application error has occured.'};

                it('the application returns 500', function(done) {
                    performUpdateAndCheckForError(expectedPlayer.email, 'Gryffindor', expectedError, 500, done);
                });
            });


            var performUpdateAndCheck = function(playerEmail, teamIdentifier, expected, done) {
                request(app)
                    .put('/api/players/' + playerEmail)
                    .send({
                        _team: teamIdentifier
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) {
                            console.log(err);
                        }
                        if (res.body.message) {
                            console.log(">>>>>>>>>>>>>>>>\n" + JSON.stringify(res.body, null, '  '));
                        }
                        expected.email.should.be.eql(res.body.email);
                        expected._team.toString().should.be.eql(res.body._team.toString());
                        done();
                });
            };

            var performUpdateAndCheckForError = function(playerEmail, teamIdentifier, expectedError, responseCode, done) {
                request(app)
                    .put('/api/players/' + playerEmail)
                    .send({
                        _team: teamIdentifier
                    })
                    .expect(responseCode)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) {
                          console.log(err);
                        }
                        expectedError.should.be.eql(res.body);
                        done();
                });
            };

            var createTeam = function(teamName, callback) {
                teams.Team.create({
                    name: teamName
                }, function (err, doc) {callback(doc);});
            };

            var createTeamWithSubteam = function(teamName, parent, callback) {
                teams.Team.create({
                    name: teamName,
                    parent: parent._id
                }, function (err, doc) {callback(doc);});
            };

            var createPlayer = function(team, playerName, callback) {
                var player = {
                    name: playerName,
                    email: (playerName.split(' ')[0] + '@gmail.com')
                };
                if (team) {
                    player._team =  team;
                }
                players.Player.create(player, function(err, doc) {callback(doc);});
            };    

            var clearAll = function(done) {
                players.Player.remove({}, function() {
                    teams.Team.remove({}, function() {
                        done();
                    });
                });
            };
        });
    });
});