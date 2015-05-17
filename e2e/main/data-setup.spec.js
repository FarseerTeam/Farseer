var players = require('../../server/components/players');
var teams = require('../../server/components/teams');
var setup = require('./data-setup');
var dataService = require('../../server/components/dataService');

describe('The data-setup module... ', function() {

	dataService.connect();

	var firstPlayer = {email: 'm@e.com', name: 'itsMe', _team:'/myTeam'};
	var secondPlayer = {email: 'm@etoo.com', name: 'itsMeAgain', _team:'/myTeam'};
	var firstTeam = {path: '/firstTeam', name: 'firstTeam'};
	var secondTeam = {path: '/secondTeam', name: 'secondTeam'};

	var findAllPlayers = function() {
		return players.Player.find().exec();
	}

	var findAllTeams = function() {
		return teams.Team.find().exec();
	}

	var validateCountOf = function(expectedCount) {
		return function(queryResults) {
			// console.log('found results: ' + queryResults);
			expect(queryResults.length).toEqual(expectedCount);	
		}
	}

	var handleError = function(done) {
		return function(err) {
			console.log('Error!! - ' + error);
			done(err);
		}
	}

	describe('the purgeData function... ', function() {

		beforeEach(function(done) {
			setup.addPlayer(firstPlayer)
				.then(setup.addPlayer(secondPlayer))
				.then(done);
		});

		afterEach(function(done) {
			players.Player.remove({})
				.then(function() {done();});
		});

		it('clears all players from the database.', function(done) {
			setup.purgeData()
				.then(findAllPlayers)
				.then(validateCountOf(0))
				.then(done);
		});

		it('clears all teams from the database.', function(done) {
			setup.purgeData()
				.then(findAllTeams)
				.then(validateCountOf(0))
				.then(done);
		});

		it('returns no value - so that calling done like this will work: (like setup.purgeData().then(done);)', function(done) {
			setup.purgeData()
				.then(function(args) {
					expect(args).not.toBeDefined();
					done();
				});
		});
	});

	describe('the addPlayer function... ', function() {

		beforeEach(function(done) {
			players.Player.remove({})
				.then(findAllPlayers)
				.then(validateCountOf(0))
				.then(done);
		});

		afterEach(function(done) {
			players.Player.remove({})
				.then(function() {done();});
		});

		it('can insert a single player using promises.', function(done) {
			
			setup.addPlayer(firstPlayer)
				.then(findAllPlayers)
				.then(validateCountOf(1))
				.then(done)
				.then(null, handleError(done));
		});

		it('can insert two players using promises.', function(done) {
			
			setup.addPlayer(firstPlayer)
				.then(setup.addPlayer(secondPlayer))
				.then(findAllPlayers)
				.then(validateCountOf(2))
				.then(done)
				.then(null, handleError(done));
		});

		it('returns no value - so that calling done like this will work: setup.addPlayer(player).then(done);', function() {
			setup.addPlayer(firstPlayer)
				.then(function(arg){
					expect(arg).not.toBeDefined();
					done();
				}); 
		});
	});

	describe('the addTeam function... ', function() {

		beforeEach(function(done) {
			teams.Team.remove({})
				.then(findAllTeams)
				.then(validateCountOf(0))
				.then(done);
		});

		afterEach(function(done) {
			teams.Team.remove({})
				.then(function() {done();});
		});

		it('can insert a single team using promises.', function(done) {
			
			setup.addTeam(firstTeam)
				.then(findAllTeams)
				.then(validateCountOf(1))
				.then(done)
				.then(null, handleError(done));
		});

		it('can insert two teams using promises.', function(done) {
			
			setup.addTeam(firstTeam)
				.then(setup.addTeam(secondTeam))
				.then(findAllTeams)
				.then(validateCountOf(2))
				.then(done)
				.then(null, handleError(done));
		});

		it('returns no value - so that calling done like this will work: setup.addTeam(team).then(done);', function() {
			setup.addTeam(firstTeam)
				.then(function(arg){
					expect(arg).not.toBeDefined();
					done();
				}); 
		});
	});
});