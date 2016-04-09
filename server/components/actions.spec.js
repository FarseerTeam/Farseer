var expect = require('chai').expect;
var chai = require('chai');
chai.use(require('chai-datetime'));
var actions = require("./actions");
var worlds = require("./worlds");
var dataService = require('./dataService');

dataService.connect();

describe('Action', function() {
    var worldName = 'Hogwarts School of Witchcraft and Wizardry';
    var worldId = 'hogwarts';

    before(function(done) {
        worlds.World.create({
            id: worldId,
            name: worldName
        }, function(err) {
            done(err);
        });
    });

    after(function(done) {
        worlds.World.remove({}, function() {
            done();
        });
    });

    afterEach(function(done) {
        actions.Action.remove({}, function() {
            done();
        });
    });

    it('saves correctly when creating players', function(done) {
        var userEmail = 'you@you.com';
        var playerName = 'Ronald';
        var playerEmail = 'rweasley@email.com';

        actions.saveCreatePlayer(userEmail, worldId, playerName, playerEmail).then(function() {
            actions.Action.find({ userEmail: userEmail }, function(error, docs) {
                if (error) done(error);
                expect(docs.length).to.equal(1);
                expect(docs[0].createdAt).to.equalDate(new Date());
                expect(docs[0].description).to.equal('created player ' + playerName + ' (' + playerEmail + ') in ' + worldName);
                done();
            });
        }, function(error) {
            done(error);
        });
    });

    it('uses blank world name when not found', function(done) {
        var userEmail = 'you@you.com';
        var playerName = 'Ronald';
        var playerEmail = 'rweasley@email.com';

        actions.saveCreatePlayer(userEmail, 'bogus', playerName, playerEmail).then(function() {
            actions.Action.find({ userEmail: userEmail }, function(error, docs) {
                if (error) done(error);
                expect(docs.length).to.equal(1);
                expect(docs[0].createdAt).to.equalDate(new Date());
                expect(docs[0].description).to.equal('created player ' + playerName + ' (' + playerEmail + ') in ');
                done();
            });
        }, function(error) {
            done(error);
        });
    });
});