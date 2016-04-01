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
                id: 'hogwarts',
                name: 'Hogwarts'
            }, {
                id: 'narnia',
                name: 'Narnia'
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
      var request = { name: 'Lost World' };

      authenticatedRequest
        .post('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.name).to.be.eql(request.name);
        done();
      });
    });
    
    it('should generate a url-friendly world id from the name', function(done) {
        var request = { name: 'Lost World' };

        authenticatedRequest
            .post('/api/worlds')
            .send(request)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.id).to.be.eql('lostworld');
                done();
            });
    });

    it('should reject request to create a world with a name that would generate a duplicate id', function(done){
      var request = {name: 'LostWorld'}

      worlds.World.create({ id: 'lostworld', name: 'Lost World' }).then(function (){
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
    const world1 = { id: "hogwarts", name: 'Hogwarts' };
    const world2 = { id: 'narnia', name: 'Narnia' };

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

    it('should update a world name and id', function(done) {
      var newWorldName = 'Better Name';
      var request = {worldId: world2.id, updatedWorldName: newWorldName};

      authenticatedRequest
        .put('/api/worlds')
        .send(request)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.name).to.be.eql(newWorldName);
          expect(res.body.id).to.be.eql('bettername');
          done();
        });
    });

    it('should throw an error if the updated name would generate a duplicate id', function(done){
      var request = {worldId: world2.id, updatedWorldName: 'ho gwar ts'};

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
    var postRequest = { name: 'Lost World' };
    var deleteRequest = { id: 'lostworld' };
    
    beforeEach(function(done) {
      authenticatedRequest
        .post('/api/worlds')
        .send(postRequest)
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
        .send(deleteRequest)
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
