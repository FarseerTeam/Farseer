'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var players = require("../../components/players")
var mongoose = require("mongoose");
var config = require('../../config/environment/test');

mongoose.connection.on('error', function(err){
  console.log("connection already opened");
})
mongoose.connect(config.mongo.uri);

describe('GET /api/players', function() {

  beforeEach(function(done) {
    players.model.create({ name: "Smith ", email: "test@test.smith.com" });
    players.model.create({ name: "John", email: "test@test.com" }, function(err, doc) {
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
        done();
      });
  });
  afterEach(function(done) {
    players.model.remove({}, function() {
      done();
    });
  });

});