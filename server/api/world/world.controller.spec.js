'use strict';

var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var worlds = require("../../components/worlds");
var players = require('../../components/players');
var _ = require('lodash');
var authenticatedRequest = require('../../authentication/authentication-helper.spec');
var VALID_USER = authenticatedRequest.VALID_USER;
var errorHandler = require('../common/errorHandler');
var sinon = require('sinon');

describe('/api/worlds', function () {

  const DUPLICATE_ERROR_CODE = 11000;
  const EXPECTED_ERROR_MESSAGE_WORLD = "A world is in peril";
  const WORLD = 'world';
  var stubErrorHandler;

  authenticatedRequest.useAuth(VALID_USER);

  describe('GET', function () {
    var worldList = [];

    beforeEach(function(done) {

        worlds.World.remove({}, function() {
        });

        worlds.World.create([
            {
                id: "hogwarts"
            }, {
                id: "narnia"
            }]).then(function(documents) {
                worldList = _.map(documents, function(document) {
                    var documentJSON = document.toJSON();
                    documentJSON._id = document._id.toString();
                    return documentJSON;
                });
                done();
            }, done);
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
    beforeEach(function(){
      setupStubErrorHandler(DUPLICATE_ERROR_CODE, WORLD, EXPECTED_ERROR_MESSAGE_WORLD);
    })

    afterEach(function (done) {
      restoreStubs();
      worlds.World.remove({}, function () {
        done();
      });
    });

    it('should add a world to the list', function (done) {
      var request = { id: 'lostworld' };

      authenticatedRequest
        .post('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.id).to.be.eql(request.id);
        done();
      });
    });

    it('will reject request to create a world with the same id as another world', function(done){
      var request = {id: 'lostworld'}

      worlds.World.create({ id: 'lostworld' }).then(function (){
        authenticatedRequest
          .post('/api/worlds/')
          .send(request)
          .expect(409)
          .expect('Content-Type', /json/)
          .end(function (err, res){
            if (err) return done(err);
            expect(stubErrorHandler.calledWith(DUPLICATE_ERROR_CODE, WORLD)).to.be.eql(true);
            expect(res.body.message).to.be.eql(EXPECTED_ERROR_MESSAGE_WORLD);
            done();
          });
        });
      });

    });

  describe('PUT', function() {
    const world1 = { id: "hogwarts" };
    const world2 = { id: 'narnia' };

    beforeEach(function (done) {
      setupStubErrorHandler(DUPLICATE_ERROR_CODE, WORLD, EXPECTED_ERROR_MESSAGE_WORLD);
      worlds.World.remove({}, function () {
      });

      worlds.World.create([world1, world2]).then(function () {
         done();
      }, done);

    });

    afterEach(function(){
      restoreStubs();
    })

    it('should update a world name (temporarily same as id)', function(done) {
      var newWorldName = 'updatedworld';
      var request = {worldId: world2.id, updatedWorldName: newWorldName};

      authenticatedRequest
        .put('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.id).to.be.eql(newWorldName);
          done();
        });
    });

    it('will throw an error if the updated name (temporarily same as id) is taken', function(done){
      var request = {worldId: world2.id, updatedWorldName: world1.id};

      authenticatedRequest
        .put('/api/worlds')
        .send(request)
        .expect(409)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          sinon.assert.calledWith(stubErrorHandler, DUPLICATE_ERROR_CODE, WORLD);
          expect(res.body.message).to.be.eql(EXPECTED_ERROR_MESSAGE_WORLD);
          done();
        });
    });
  })

  describe('DELETE', function() {
    var request = { id: 'lostworld' };
    
    beforeEach(function(done) {
      authenticatedRequest
        .post('/api/worlds')
        .send(request)
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

    it('should delete a world', function(done) {
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

  function setupStubErrorHandler(errorCode, propertyName, message){
    stubErrorHandler = sinon.stub(errorHandler, 'retrieveErrorMessage');
    stubErrorHandler.withArgs(errorCode, propertyName).returns(message);
  }

  function restoreStubs(){
    stubErrorHandler.restore();
  }
});
