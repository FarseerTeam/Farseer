'use strict';

var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var worlds = require("../../components/worlds");
var players = require('../../components/players');
var _ = require('lodash');
var authenticatedRequest = require('../../authentication/authentication-helper.spec');
var VALID_USER = authenticatedRequest.VALID_USER;

describe('/api/worlds', function () {

  authenticatedRequest.useAuth(VALID_USER);

  describe('GET', function () {
    var worldList = [];

    beforeEach(function (done) {
      worlds.World.create([{
        name: "Hogwarts"
      }, {
          name: "Narnia"
        }]).then(function (documents) {
        worldList = _.map(documents, function (document) {
          var documentJSON = document.toJSON();
          documentJSON._id = document._id.toString();
          return documentJSON;
        });
        done();
      }, done);
    });

    afterEach(function (done) {
      worlds.World.remove({}, function () {
        done();
      });
    });

    it('should return a list of worlds', function (done) {
      authenticatedRequest
        .get('/api/worlds')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.eql(worldList);
        done();
      });
    });
  });

  describe('POST', function () {
    afterEach(function (done) {
      worlds.World.remove({}, function () {
        done();
      });
    });

    it('should add a world to the list', function (done) {
      var newWorld = { name: 'Lost World' };

      authenticatedRequest
        .post('/api/worlds')
        .send(newWorld)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.name).to.be.eql(newWorld.name);
        done();
      });
    });

    it('will reject request to create world with a preexisting id', function (done) {
      worlds.World.create({ name: 'Lost World' }).then(function (world) {
        authenticatedRequest
          .post('/api/worlds')
          .send(world)
          .expect(409)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.eql({ message: 'A world with that id already exists.' });
          done();
        });
      });
    });
  });

  describe('PUT', function() {
    var world = { name: 'Lost World' };
    beforeEach(function(done) {

      authenticatedRequest
        .post('/api/worlds')
        .send(world)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    afterEach(function(done) {
      worlds.World.remove({}, function () {
        done();
      });
    });

    it('should update a world name', function(done) {
      var newWorldName = 'Updated World';
      var request = {oldWorldName: world.name, updatedWorldName: newWorldName};

      authenticatedRequest
        .put('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.name).to.be.eql(newWorldName);
          done();
        });
    })
  })

  describe('DELETE', function() {
    var world = { name: 'Lost World' };
    beforeEach(function(done) {

      authenticatedRequest
        .post('/api/worlds')
        .send(world)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    afterEach(function(done) {
      worlds.World.remove({}, function () {
        done();
      });
    });

    it('should delete a world name', function(done) {
      var request = {worldName: world.name};

      authenticatedRequest
        .delete('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
            expect(res.body.ok).to.be.eql(1);
          done();
        });
    })
  })
});
