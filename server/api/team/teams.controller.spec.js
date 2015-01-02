'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var teams = require("../../components/teams")
var dataService = require('../../components/dataService')

dataService.connect();

describe('/api/teams', function() {
  describe('GET ', function() {
    var ford;

    beforeEach(function(done) {
      teams.Team.remove({}, function() {
        teams.Team.create({
          name: "Ford",
        }, function(err, doc) {
          ford = doc;
          done();
        });

      });
    });

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/teams')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          ford.id.should.be.equal(res.body[0]._id);
          done();
        });
    });
    afterEach(function(done) {
      teams.Team.remove({}, function() {
        done();
      });
    });
  });

  //curl http://localhost:9000/api/teams
  //curl -H "Content-Type: application/json" -d '{"name":"pedro"}' http://localhost:9000/api/teams
  describe('POST ', function() {
    var ford;

    beforeEach(function(done) {
      teams.Team.remove({}, function() {
        teams.Team.create({
          name: "Ford",
        }, function(err, doc) {
          ford = doc;
          done();
        });

      });
    });
    it('should create teams', function(done) {
      request(app)
        .post('/api/teams')
        .send({
          name: 'GFORCE',
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('should create a sub team if there is a valid parent reference', function(done) {
      request(app)
        .post('/api/teams')
        .send({
          name: 'GFORCE',
          parentId: ford.id
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.parent = ford.id
          done();
        });
    });
    it('should display a message if it is not a valid parent reference', function(done) {
      request(app)
        .post('/api/teams')
        .send({
          name: 'Invalid GFORCE',
          parentId: 587979877787
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          (res.body.error === null).should.be.false;
          ("Team with id " + 587979877787 + " does not exist.").should.eql(res.body.error);
          done();
        });
    });    
    afterEach(function(done) {
      teams.Team.remove({}, function() {
        done();
      });
    });
  });
});

describe('/api/teams/:team_id', function() {

  describe('GET ', function() {
    var cengage;

    beforeEach(function(done) {
      teams.Team.create({
          name: "Cengage ",
        },
        function(err, doc) {
          cengage = doc;
          done();
        });
    });
    it('will return a valid object if exists ', function(done) {
      var url = '/api/teams/' + cengage.id;
      request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          cengage.name.should.be.equal(res.body.name);
          done();
        });
    });
    it('will return an empty object with error information ', function(done) {
      var randomId = parseInt(Math.random() * 1000);
      var url = '/api/teams/' + randomId;
      request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.errorMessage.should.be.equal("TEAM with id " + randomId + " does not exist.");
          done();
        });
    });
    afterEach(function(done) {
      teams.Team.remove({}, function() {
        done();
      });
    });
  });
  describe('PUT', function() {
    var cengage;
    var cengageChanged = {
      name: 'Cengage Learning',
    };
    beforeEach(function(done) {
      teams.Team.create({
          name: "Cengage",
        },
        function(err, doc) {
          cengage = doc;
          done();
        });
    });
    it('will update a valid object ', function(done) {
      var url = '/api/teams/' + cengage.id;
      request(app)
        .put(url)
        .send(cengageChanged)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          teams.Team.findById(cengage.id, function(err, doc) {
            if (err) return done(err);
            doc.name.should.be.equal(cengageChanged.name);
            done();
          });
        });
    });
    afterEach(function(done) {
      teams.Team.remove({}, function() {
        done();
      });
    });
  });

  describe('DELETE', function() {
    var cengage;
    beforeEach(function(done) {
      teams.Team.create({
          name: "Cengage",
        },
        function(err, doc) {
          cengage = doc;
          done();
        });
    });
    it('will remove an valid object ', function(done) {
      var url = '/api/teams/' + cengage.id;
      request(app)
        .delete(url)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
    afterEach(function(done) {
      teams.Team.remove({}, function() {
        done();
      });
    });
  });
});