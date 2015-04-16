'use strict';

var nextIfError = require("callback-wrappers").nextIfError;
var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');
var players = require("../../components/players");
var teams = require("../../components/teams");
var dataService = require('../../components/dataService');
var format = require('string-format');
var mongoose = require('mongoose');

dataService.connect();

describe('/api/players', function () {
  describe('GET ', function () {
    var smith;

    beforeEach(function (done) {
      players.Player.create({
        name: "Smith ",
        email: "test@test.smith.com"
      }, function (err, doc) {
        smith = doc;
        done();
      });
    });

    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/players')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(smith.id).to.be.equal(res.body[0]._id);
          done();
        });
    });

    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });
  });

  //curl http://localhost:9000/api/players
  //curl -H "Content-Type: application/json" -d '{"name":"pedro","email":"pedro@email"}' http://localhost:9000/api/players
  describe('POST ', function () {
    it('should create players', function (done) {
      request(app)
        .post('/api/players')
        .send({
          name: 'Manny',
          email: 'cat@email.com'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });

    describe('when adding duplicate player', function () {
      beforeEach(function (done) {
        players.Player.create({
          name: "Smith ",
          email: "test@test.smith.com"
        }, done);
      });

      it('should return a human error message', function (done) {
        request(app)
          .post('/api/players')
          .send({
            name: 'Smith',
            email: 'test@test.smith.com'
          })
          .set('Accept', 'application/json')
          .expect(409)
          .expect('Content-Type', /json/)
          .expect({message: "A player with email test@test.smith.com already exists"}, done);
      });
    });

    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });
  });


});

describe('/api/players/:player_id', function () {

  describe('GET ', function () {
    var smith;

    beforeEach(function (done) {
      players.Player.create({
          name: "Smith ",
          email: "test@test.smith.com"
        },
        function (err, doc) {
          smith = doc;
          done();
        });
    });

    it('will return a valid object if exists ', function (done) {
      var url = '/api/players/' + smith.id;
      request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(smith.name).to.be.equal(res.body.name);
          expect(smith.email).to.be.equal(res.body.email);
          done();
        });
    });

    it("will understand a player's email if passed as the player_id.", function (done) {
      var url = '/api/players/' + smith.email;
      request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(smith.name).to.be.equal(res.body.name);
          expect(smith.email).to.be.equal(res.body.email);
          done();
        });
    });

    it('will return an empty object with error information ', function (done) {
      var randomId = parseInt(Math.random() * 1000);
      var url = '/api/players/' + randomId;
      request(app)
        .get(url)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(
        nextIfError(
          function (res) {
            expect(res.body.message).to.be.equal(format("PLAYER with identifier '{}' does not exist.", randomId));
            done();
          },
          function (err) {
            done(err);
          }
        ));
    });
    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });
  });


  describe('DELETE', function () {
    var smith;
    beforeEach(function (done) {
      players.Player.create({
          name: "Smith ",
          email: "test@test.smith.com"
        },
        function (err, doc) {
          smith = doc;
          done();
        });
    });
    it('will remove an valid object ', function (done) {
      var url = '/api/players/' + smith.id;
      request(app)
        .delete(url)
        .expect(200)
        .end(done);
    });
    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });
  });


  describe('PUT', function () {
    var smith, anderson;
    var smithChanged = {
      name: 'Smith Update',
      email: 'email@changed.com'
    };

    beforeEach(function (done) {
      players.Player.create({
          name: "Smith ",
          email: "test@test.smith.com"
        },
        function (err, doc) {
          smith = doc;
          done();
        });
    });

    it('will update a valid object ', function (done) {
      var url = '/api/players/' + smith.id;
      request(app)
        .put(url)
        .send(smithChanged)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err) {
          if (err) {
            return done(err)
          }
          players.Player.findById(smith.id, function (err, doc) {
            if (err) {
              return done(err)
            }
            expect(doc.name).to.be.equal(smithChanged.name);
            expect(doc.email).to.be.equal(smithChanged.email);
            done();
          });
        })
    });

    describe('when using duplicate email', function () {
      beforeEach(function (done) {
        players.Player.create({
            name: "Anderson",
            email: "neo@matrix.com"
          },
          function (err, doc) {
            anderson = doc;
            done();
          });
      });

      it('should return a human error message', function (done) {

        request(app)
          .put('/api/players/' + smith.id)
          .send({
            name: 'Smitty',
            email: anderson.email
          })
          .set('Accept', 'application/json')
          .expect(409)
          .expect('Content-Type', /json/)
          .expect({message: "A player with email " + anderson.email + " already exists"}, function (error) {
            done(error);
          });

      });

    });

    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });

    describe('when updating the team as part of the update ', function () {

      var expectedPlayer = {
        name: 'Harry Potter',
        email: 'Harry@gmail.com'
      };


      describe('Given the _team field in the request body ', function () {

        var team;
        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function (createdTeam) {
              expectedPlayer._team = createdTeam.path;
              team = createdTeam;
              createPlayer(undefined, 'Harry Potter', function () {
                done();
              });
            }, done);
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('it is ok to pass the TEAM PATH as the value.', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, team.path, expectedPlayer, done);
        });

        it('it is ok to pass the TEAM _ID as the value.', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, team._id, expectedPlayer, done);
        });
      });

      describe('When the player does not already have a team ', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function (createdTeam) {
              expectedPlayer._team = createdTeam.path;
              createPlayer(undefined, 'Harry Potter', function () {
                done();
              });
            });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating the player with an existing team assigns the player to the team.', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('When the player is already assigned to a team', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function () {
              createPlayer('/muggle', 'Harry Potter', done.bind(null, null));
            });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating with a new team removes the player from the old team and puts the player on the new team.', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('Given a player with an existing assignment', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor').then(function (createdTeam) {
            expectedPlayer._team = createdTeam.path;
            createPlayer(createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating with the same team returns an unchanged player.', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('When a team that does not exist is used to update ', function () {

        var nonexistentId = 'ffffffffffffffffffffffff';

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor').then(function (createdTeam) {
            createPlayer(createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        var expectedError = {message: "A team with identifier '" + nonexistentId + "' does not exist"};

        it('the application returns 404', function (done) {
          performUpdateAndCheckForError(expectedPlayer.email, nonexistentId, expectedError, 404, done);
        });
      });


      describe('Given an email with no associated player ', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor','/gryffindor').then(function (createdTeam) {
            createPlayer(createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        var expectedError = {message: "PLAYER with identifier 'Nonexistent@gmail.com' does not exist."};

        it('the application returns 404', function (done) {
          performUpdateAndCheckForError('Nonexistent@gmail.com', 'Gryffindor', expectedError, 404, done);
        });
      });


      describe('Given an unexpected application error ', function () {

        var actualFindOneFunction;

        beforeEach(function (done) {
          mockTheDatabase_ToReturnAnError();
          done();
        });

        var mockTheDatabase_ToReturnAnError = function () {
          actualFindOneFunction = mongoose.Model.findOne;
          mongoose.Model.findOne = function (modelObject, callback) {
            callback('error', undefined);
          };
        };

        var unmock = function () {
          mongoose.Model.findOne = actualFindOneFunction;
        };

        afterEach(function (done) {
          unmock();
          clearAll(done);
        });

        var expectedError = {err: 'error', message: 'An unexpected application error has occured.'};

        it('the application returns 500', function (done) {
          performUpdateAndCheckForError(expectedPlayer.email, 'Gryffindor', expectedError, 500, done);
        });
      });


      var putPlayerTeamUpdateAndValidateResponse = function (playerEmail, teamIdentifier, expected, done) {
        request(app)
          .put('/api/players/' + playerEmail)
          .send({
            _team: teamIdentifier
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, response) {
            if (err) {
              return done(err);
            }
            if (response.body.message) {
              return done(response.body);
            }
            expect(response.body.name).to.be.eql(expected.name);
            expect(response.body.email).to.be.eql(expected.email);
            expect(response.body._team).to.be.eql(expected._team);
            done();
          });
      };

      var performUpdateAndCheckForError = function (playerEmail, teamIdentifier, expectedError, responseCode, done) {
        request(app)
          .put('/api/players/' + playerEmail)
          .send({
            _team: teamIdentifier
          })
          .expect(responseCode)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              console.log(err);
            }
            expect(expectedError).to.be.eql(res.body);
            done();
          });
      };

      var createTeam = function (teamName, teamPath) {
        return teams.Team.create({
          name: teamName,
          path: teamPath
        });
      };

      var createPlayer = function (team, playerName, callback) {
        var player = {
          name: playerName,
          email: (playerName.split(' ')[0] + '@gmail.com')
        };
        if (team) {
          player._team = team;
        }
        players.Player.create(player, function (err, doc) {
          callback(doc);
        });
      };

      var clearAll = function (done) {
        players.Player.remove({}, function () {
          teams.Team.remove({}, function () {
            done();
          });
        });
      };
    });
  });
});
