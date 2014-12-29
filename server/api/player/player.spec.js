'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var players = require("../../components/players")
var dataService = require('../../components/dataService')

dataService.connect();

describe('GET /api/players', function() {
  var smith, john;

  beforeEach(function(done) {
    smith = players.model.create({ name: "Smith ", email: "test@test.smith.com" });
    john = players.model.create({ name: "John", email: "test@test.com" }, function(err, doc) {
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
describe('GET /api/players/:player_id', function() {
  var smith, john;

  beforeEach(function(done) {
    players.model.create({ name: "Smith ", email: "test@test.smith.com" }, 
       function(err, doc){
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
  it('will return an empty object with error information ', function(done) {
    var randomId = parseInt(Math.random() * 1000);
    var url = '/api/players/' + randomId;
    request(app)
      .get(url)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.error.should.be.equal("Player with id " + randomId + " does not exist.");
        done();
      });
  });
  afterEach(function(done) {
    players.model.remove({}, function() {
      done();
    });
  });
});
//curl http://localhost:9000/api/players
//curl -H "Content-Type: application/json" -d '{"name":"pedro","email":"pedro@email"}' http://localhost:9000/api/players
describe('POST /api/players', function() {
  it('should create players', function(done){
    request(app)
      .post('/api/players')
      .send({ name: 'Manny', email: 'cat@email.com' })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  afterEach(function(done) {
    players.model.remove({}, function() {
      done();
    });
  });  
});

describe('PUT /api/players/:player_id', function() {
  var smith, john;
  var smithChanged = { name: 'Smith Update', email: 'email@changed.com' };
  beforeEach(function(done) {
    players.model.create({ name: "Smith ", email: "test@test.smith.com" }, 
       function(err, doc){
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
        players.model.findById(smith.id, function(err, doc){
          if (err) return done(err);
          doc.name.should.be.equal(smithChanged.name);
          doc.email.should.be.equal(smithChanged.email);
          done();
        });
      });
  });
  afterEach(function(done) {
    players.model.remove({}, function() {
      done();
    });
  });
});

describe('DELETE /api/players/:player_id', function() {
 var smith;
  beforeEach(function(done) {
    players.model.create({ name: "Smith ", email: "test@test.smith.com" }, 
       function(err, doc){
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
         done();
      });
  });
  afterEach(function(done) {
    players.model.remove({}, function() {
      done();
    });
  });
});

