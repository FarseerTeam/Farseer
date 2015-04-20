/*jshint expr: true*/
var mongoose = require("mongoose");
var teams = require("./teams");
var RSVP = require('rsvp');
var expect = require('chai').expect;
require('chai').use(require('dirty-chai'));
var assert = require('assert');
var config = require('../config/environment/test');

var dataService = require('./dataService');

dataService.connect();

describe("A team", function () {

  var theTeam = null;

  beforeEach(function (done) {
    teams.Team.create({
      path: "/ford",
      name: "Ford"
    }).then(function (doc) {
      theTeam = doc;
      done();
    }, done);
  });

  afterEach(function (done) {
    teams.Team.remove({}, function () {
      done();
    });
  });

  it("has a name", function (done) {
    expect(theTeam).to.be.ok();
    theTeam.save(function (err, doc) {
      expect(err).to.be.null();
      doc.name.should.eql(theTeam.name);
      done();
    });
  });

  it("is unique based on path", function (done) {
    var attemptedDuplicateTeam = new teams.Team();
    attemptedDuplicateTeam.path = theTeam.path;
    attemptedDuplicateTeam.save(function (err) {
      expect(err).not.to.be.null();
      (11000).should.eql(err.code);
      expect(err.message.indexOf('farseer-test.teams.$path_1')).to.not.equal(0);
      expect(err.message.indexOf('dup key: { : \"/ford\" }')).to.not.equal(0);
      done();
    });
  });

  it('can be searched for by the team path.', function (done) {
    var success = function (returnedTeam) {
      returnedTeam.name.should.equal(theTeam.name);
      returnedTeam.id.should.equal(theTeam.id);
      returnedTeam.path.should.equal(theTeam.path);
      done();
    };

    teams.findByPath('/ford', success);
  });

  it('when searched for with a name that does not exist returns null.', function (done) {
    var success = function (returnedTeam) {
      assert.equal(returnedTeam, null);
      done();
    };

    teams.findByPath('Unknown team', success);
  });

  it('when searched, calls the error callback function if an error is returned from the DB.', function (done) {
    var success = function () {
      unmock();
      done("This should return an error.");
    };
    var error = function () {
      unmock();
      done();
    };
    mockTheDatabase_ToReturnAnError();
    teams.findByPath('Expecting error', success, error);
  });

  var actualFindOne;
  var mockTheDatabase_ToReturnAnError = function () {
    actualFindOne = mongoose.Model.findOne;
    mongoose.Model.findOne = function (modelObject, callback) {
      callback('Hi this is the error', undefined);
    };
  };

  var unmock = function () {
    mongoose.Model.findOne = actualFindOne;
  };

});

describe('The findByAnyUniqueIdentifier function... ', function () {

  var savedTeam = null;
  var savedSubTeam = null;

  beforeEach(function (done) {
    RSVP.hash({
      best: teams.Team.create({
        name: "The best team",
        path: "/best"
      }),
      subteam: teams.Team.create({
        name: "subteam",
        path: "/best/subteam"
      })
    }).then(function (teams) {
      savedTeam = teams.best;
      savedSubTeam = teams.subteam;
      done();
    }, done);
  });

  it("Teams can be found by id", function (done) {
    teams.findByAnyUniqueIdentifier(savedTeam._id, function (doc) {
      validateTeam(doc, done);
    }, done);
  });

  it("Teams can be found by path", function (done) {
    teams.findByAnyUniqueIdentifier(savedTeam.path, function (doc) {
      validateTeam(doc, done);
    }, done);
  });

  it("'null' is returned (with no error) if no team matches the passed value.", function (done) {
    teams.findByAnyUniqueIdentifier('bad-value', function (doc) {
      expect(doc).to.not.exist();
      done();
    }, done);
  });

  it("Sub-teams can be found by path", function (done) {
    teams.findByAnyUniqueIdentifier(savedSubTeam.path, function (doc) {
      validateSubTeam(doc, done);
    }, done);
  });
  var validateTeam = function (team, done) {
    expect(team).to.exist();
    expect(savedTeam.name).to.equal(team.name);
    expect(savedTeam.path).to.equal(team.path);
    expect(savedTeam._id.equals(team._id)).to.be.ok();
    done();
  };


  afterEach(function (done) {
    teams.Team.remove({}, function () {
      done();
    });
  });

  var validateSubTeam = function (team, done) {
    expect(team).to.exist();
    savedSubTeam.name.should.equal(team.name);
    savedSubTeam.path.should.equal(team.path);
    expect(savedSubTeam._id.equals(team._id)).to.be.ok();
    done();
  };

  describe("if there is a database error... ", function () {
    var actualDatabaseFindOneFunction;
    var actualDatabaseFindByIdFunction;
    var findByNameError = 'findByNameError';
    var expectedIdError = 'findByIdError';
    var validId = '552058b0469006560cad7c58';
    var name = "Team the best team";

    beforeEach(function (done) {
      mockTheDatabase_ToReturnAnError();
      done();
    });

    afterEach(function (done) {
      unmock();
      done();
    });

    var mockTheDatabase_ToReturnAnError = function () {
      actualDatabaseFindOneFunction = mongoose.Model.findOne;
      actualDatabaseFindByIdFunction = mongoose.Model.findById;

      mongoose.Model.findOne = function (modelObject, callback) {
        callback(findByNameError, undefined);
      };
      mongoose.Model.findById = function (id, callback) {
        callback(expectedIdError, undefined);
      };
    };

    var unmock = function () {
      mongoose.Model.findOne = actualDatabaseFindOneFunction;
      mongoose.Model.findById = actualDatabaseFindByIdFunction;
    };

    it("the error function is called with the error returned from the database when finding by name.", function (done) {
      teams.findByAnyUniqueIdentifier(name, function () {
        done("This should not succeed.");
      }, function (error) {
        expect(findByNameError).to.equal(error);
        done();
      });
    });

    it("the error function is called with the error returned from the database when finding by id.", function (done) {
      teams.findByAnyUniqueIdentifier(validId, function () {
        done('This should not succeed.');
      }, function (error) {
        expect(expectedIdError).to.equal(error);
        done();
      });
    });
  });
});
