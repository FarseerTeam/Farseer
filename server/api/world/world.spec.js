'use strict';

var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var app = require('../../app');
var request = require('supertest');
var worlds = require("../../components/worlds");
var _ = require('lodash');

describe('GET /api/worlds', function () {
  var worldList = [];

  beforeEach(function (done) {
    worlds.World.create([{
      name: "Hogwarts"
    }, {
      name: "Narnia"
    }]).then(function (documents) {
      worldList = _.map(documents, function(document) {
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
    request(app)
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