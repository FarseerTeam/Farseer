'use strict';

var nextIfError = require("callback-wrappers").nextIfError;
var expect = require('chai').expect;
var chai = require('chai');
chai.use(require('chai-datetime'));
var app = require('../../app');
var request = require('supertest-as-promised');
var players = require("../../components/players");
var teams = require("../../components/teams");
var actions = require("../../components/actions");
var dataService = require('../../components/dataService');
var format = require('string-format');
var mongoose = require('mongoose');
var _ = require('lodash');

dataService.connect();

describe('/api/worlds/world/players', function () {
  describe('GET', function () {
    var smith, neo;

    beforeEach(function (done) {
      players.Player.create([{
        name: "Smith ",
        email: "test@test.smith.com",
        world: "matrix"
      }, {
          name: "Mr. Anderson",
          email: "neo@email",
          world: "newyork"
        }], function (err, docs) {
          smith = docs[0];
          neo = docs[1];
          done();
        });
    });

    it('should return players from the right world', function (done) {
      request(app)
        .get('/api/worlds/matrix/players')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          var ids = _.pluck(res.body, '_id');
          expect(ids).to.be.eql([smith._id.toString()]);
          done();
        });
    });

    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });
  });

  describe('POST ', function() {
      beforeEach(function(done) {
          actions.Action.remove({}, function() {
              done();
          });
      });

      it('should create players', function(done) {
          request(app)
              .post('/api/worlds/hogwarts/players')
              .send({
                  name: 'Neville',
                  email: 'longbottom@email.com'
              })
              .set('Accept', 'application/json')
              .expect(200)
              .expect('Content-Type', /json/)
              .end(function(error, response) {
                  if (error) done(error);
                  expect(response.body.name).to.equal('Neville');
                  expect(response.body.email).to.equal('longbottom@email.com');
                  players.Player.find({ email: 'longbottom@email.com' }, function(err, doc) {
                      if (error) done(error);
                      expect(doc[0].name).to.equal('Neville');
                      expect(doc[0].world).to.equal('hogwarts');
                      done();
                  });
              });
      });

      it('should log action when authenticated', function(done) {
          var agent = request.agent(app);
          var userEmail = 'author@email';
          agent
              .get('/test-login?username=' + userEmail + '&password=pws')
              .then(function() {
                  return agent
                      .post('/api/worlds/hogwarts/players')
                      .send({
                          name: 'Ginny',
                          email: 'gweasley@email.com'
                      })
                      .expect(200)
              })
              .then(function(response) {
                  actions.Action.find({ userEmail: userEmail }, function(err, docs) {
                      expect(docs.length).to.equal(1);
                      expect(docs[0].createdAt).to.equalDate(new Date());
                      done();
                  });
              });
      });

      it('should not log action when not authenticated', function(done) {
          var agent = request.agent(app);
          agent
              .post('/api/worlds/hogwarts/players')
              .send({
                  name: 'Ginny',
                  email: 'gweasley@email.com'
              })
              .expect(200)
              .then(function(response) {
                  actions.Action.find({}, function(err, docs) {
                      expect(docs.length).to.equal(0);
                      done();
                  });
              });
      });

      it('should allow creating players with a shared email in different worlds', function(done) {
          players.Player.create({
              name: "Mr. Smith ",
              email: "test@test.smith.com",
              world: "matrix"
          }, function() {
              request(app)
                  .post('/api/worlds/michigan/players')
                  .send({
                      name: 'Rob',
                      email: 'test@test.smith.com'
                  })
                  .set('Accept', 'application/json')
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end(function(error, response) {
                      if (error) done(error);
                      expect(response.body.name).to.equal('Rob');
                      expect(response.body.email).to.equal('test@test.smith.com');
                      players.Player.find({ email: 'test@test.smith.com', world: 'michigan' }, function(err, doc) {
                          if (error) done(error);
                          expect(doc[0].name).to.equal('Rob');
                          expect(doc[0].world).to.equal('michigan');
                          done();
                      });
                  });
          });
      });

      describe('when adding duplicate player', function() {
          beforeEach(function(done) {
              players.Player.create({
                  name: "Smith ",
                  email: "test@test.smith.com",
                  world: "world"
              }, done);
          });

          it('should return a human error message', function(done) {
              request(app)
                  .post('/api/worlds/world/players')
                  .send({
                      name: 'Smith',
                      email: 'test@test.smith.com'
                  })
                  .set('Accept', 'application/json')
                  .expect(409)
                  .expect('Content-Type', /json/)
                  .expect({ message: "A player with email test@test.smith.com already exists" }, done);
          });

          it('should not log action even when authenticated', function(done) {
              var agent = request.agent(app);
              agent
                  .get('/test-login?username=author@email&password=pws')
                  .then(function() {
                      return agent
                          .post('/api/worlds/world/players')
                          .send({
                              name: 'Smith',
                              email: 'test@test.smith.com'
                          })
                          .expect(409)
                  })
                  .then(function(response) {
                      actions.Action.find({}, function(err, docs) {
                          expect(docs.length).to.equal(0);
                          done();
                      });
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

describe('/api/worlds/world/players/:player_id', function () {

  describe('GET', function () {
    var smith;

    beforeEach(function (done) {
      players.Player.create({
        name: "Smith ",
        email: "test@test.smith.com",
        world: "world"
      },
        function (err, doc) {
          smith = doc;
          done();
        });
    });

    it('should return a valid object if exists', function (done) {
      var url = '/api/worlds/world/players/' + smith.id;
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

    it('should not return a player if it is not of this world', function (done) {
      var url = '/api/worlds/newyork/players/' + smith.id;
      request(app)
        .get(url)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.message).to.be.equal(format("PLAYER with identifier '{}' does not exist.", smith.id));
          done();
        });
    });

    it("will understand a player's email if passed as the player_id", function (done) {
      var url = '/api/worlds/world/players/' + smith.email;
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
      var url = '/api/worlds/world/players/' + randomId;
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
        email: "test@test.smith.com",
        world: "world"
      },
        function (err, doc) {
          smith = doc;
          done();
        });
    });

    it('will remove a player given the correct world', function (done) {
      var url = '/api/worlds/world/players/' + smith.id;
      request(app)
        .delete(url)
        .expect(200)
        .end(done);
    });

    it('will NOT remove a player given the wrong world', function (done) {
      var url = '/api/worlds/notworld/players/' + smith.id;
      request(app)
        .delete(url)
        .expect(404)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body.message).to.be.equal(format("PLAYER with identifier '{}' does not exist.", smith.id));
          done();
        });
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
      players.Player.create([{
        name: "Smith ",
        email: "test@test.smith.com",
        world: "world"
      }, {
          name: 'Neo',
          email: 'anderson@email.com',
          world: 'fantasy'
        }],
        function (err, docs) {
          smith = docs[0];
          anderson = docs[1];
          done();
        });
    });

    it('will update a player given correct world', function (done) {
      var url = '/api/worlds/world/players/' + smith.id;
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

    it('will NOT update a player given the wrong world', function (done) {
      var url = '/api/worlds/notworld/players/' + smith.id;
      request(app)
        .put(url)
        .send(smithChanged)
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function (error, response) {
          if (error) done(error);
          expect(response.body.message).to.be.equal(format("PLAYER with identifier '{}' does not exist.", smith.id));
          done();
        })
    });

    it('will allow using duplicate email from another world', function (done) {
      var url = '/api/worlds/world/players/' + smith.id;
      smithChanged.email = 'anderson@email.com';
      request(app)
        .put(url)
        .send(smithChanged)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err) {
          if (err) done(err);
          players.Player.findById(smith.id, function (err, doc) {
            if (err) done(err);
            expect(doc.name).to.be.equal(smithChanged.name);
            expect(doc.email).to.be.equal(smithChanged.email);
            done();
          });
        })
    });

    describe('when using duplicate email in the same world', function () {
      beforeEach(function (done) {
        players.Player.create({
          name: "Anderson",
          email: "neo@matrix.com",
          world: "world"
        },
          function (err, doc) {
            anderson = doc;
            done();
          });
      });

      it('should return a human error message', function (done) {

        request(app)
          .put('/api/worlds/world/players/' + smith.id)
          .send({
            name: 'Smitty',
            email: anderson.email
          })
          .set('Accept', 'application/json')
          .expect(409)
          .expect('Content-Type', /json/)
          .expect({ message: "A player with email " + anderson.email + " already exists" }, function (error) {
            done(error);
          });

      });

    });

    afterEach(function (done) {
      players.Player.remove({}, function () {
        done();
      });
    });

    describe('when updating the team as part of the update', function () {

      var expectedPlayer = {
        name: 'Harry Potter',
        email: 'Harry@gmail.com',
        world: 'world'
      };


      describe('Given the _team field in the request body', function () {

        var team;
        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function (createdTeam) {
              expectedPlayer._team = createdTeam.path;
              team = createdTeam;
              createPlayer('world', undefined, 'Harry Potter', function () {
                done();
              });
            }, done);
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('it is ok to pass the TEAM PATH as the value', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, team.path, expectedPlayer, done);
        });

      });

      describe('When the player does not already have a team', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function (createdTeam) {
              expectedPlayer._team = createdTeam.path;
              createPlayer('world', undefined, 'Harry Potter', function () {
                done();
              });
            });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating the player with an existing team assigns the player to the team', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('When the player is already assigned to a team', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor')
            .then(function () {
              createPlayer('world', '/muggle', 'Harry Potter', done.bind(null, null));
            });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating with a new team removes the player from the old team and puts the player on the new team', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('Given a player with an existing assignment', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor').then(function (createdTeam) {
            expectedPlayer._team = createdTeam.path;
            createPlayer('world', createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        it('updating with the same team returns an unchanged player', function (done) {
          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, expectedPlayer._team, expectedPlayer, done);
        });
      });


      describe('When a team that does not exist is used to update', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor').then(function (createdTeam) {
            createPlayer('world', createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });


        afterEach(function (done) {
          clearAll(done);
        });

        it('still allows the update because teams do not require a db entry', function (done) {

          var expectedPlayer = {
            name: 'Harry Potter',
            email: 'Harry@gmail.com',
            _team: '/bestTeamEver'
          }

          putPlayerTeamUpdateAndValidateResponse(expectedPlayer.email, "/bestTeamEver", expectedPlayer, done);
        });
      });


      describe('Given an email with no associated player', function () {

        beforeEach(function (done) {
          createTeam('Gryffindor', '/gryffindor').then(function (createdTeam) {
            createPlayer('world', createdTeam, 'Harry Potter', function () {
              done();
            });
          });
        });

        afterEach(function (done) {
          clearAll(done);
        });

        var expectedError = { message: "PLAYER with identifier 'Nonexistent@gmail.com' does not exist." };

        it('the application returns 404', function (done) {
          performUpdateAndCheckForError('Nonexistent@gmail.com', 'Gryffindor', expectedError, 404, done);
        });
      });


      describe('Given an unexpected application error', function () {

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

        var expectedError = { err: 'error', message: 'An unexpected application error has occured.' };

        it('the application returns 500', function (done) {
          performUpdateAndCheckForError(expectedPlayer.email, 'Gryffindor', expectedError, 500, done);
        });
      });


      var putPlayerTeamUpdateAndValidateResponse = function (playerEmail, teamIdentifier, expected, done) {
        request(app)
          .put('/api/worlds/world/players/' + playerEmail)
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
          .put('/api/worlds/world/players/' + playerEmail)
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

      var createPlayer = function (worldId, team, playerName, callback) {
        var player = {
          name: playerName,
          email: (playerName.split(' ')[0] + '@gmail.com'),
          world: worldId
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