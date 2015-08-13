'use strict';

var should = require('should');
var players = require("../components/players");
var middleware = require('./middleware');

describe('The middleware module', function () {

	describe('When intercepting player unique identifier', function () {

		var identifier = 'anything';
		var world = 'catland';
		var mockPlayer = { name: 'Juan', email: 'juan@gmail.com' };
		var mockRequest = { params: { worldId: world } };
		var next = function () { };
		var mockError = { err: 'mock error' };
		var mockResponse = {
			statusCode: undefined,
			jsonObject: undefined,
			status: function (code) { this.statusCode = code; return this; },
			json: function (obj) { this.jsonObject = obj; return this; }
		};
		var originalFunction;

		beforeEach(function (done) {
			originalFunction = players.findByAnyUniqueIdentifier;
			done();
		});

		afterEach(function (done) {
			unmock();
			done();
		});

		it('it adds the results from the components/players module as a parameter', function (done) {
			mockPlayersWhenGivenToReturn(world, identifier, mockPlayer);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function () {
				mockPlayer.should.be.equal(mockRequest.player);
				done();
			}, identifier);
		});

		it('if no player is found, sends status code 404', function (done) {
			mockPlayersWhenGivenToReturn(world, identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			(404).should.be.equal(mockResponse.statusCode);
			done();
		});

		it('if no player is found, returns a json object with error message', function (done) {
			mockPlayersWhenGivenToReturn(world, identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			should.exist(mockResponse.jsonObject);
			mockResponse.jsonObject.message.should.equal("PLAYER with identifier '" + identifier + "' does not exist.");
			done();
		});

		it('it does not call the next interceptor if no player is found', function (done) {
			mockPlayersWhenGivenToReturn(world, identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function () {
				should.fail();
			}, identifier);
			done();
		});

		it('if an error happens during the database call, sends status code 500', function (done) {
			mockPlayersToGiveError(world, identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			(500).should.be.equal(mockResponse.statusCode);
			done();
		});

		it('if an error happens during the database call, returns a json object with the error message and the error object', function (done) {
			mockPlayersToGiveError(world, identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			should.exist(mockResponse.jsonObject);
			mockResponse.jsonObject.message.should.equal('An unexpected application error has occured.');
			mockResponse.jsonObject.err.should.equal(mockError);
			done();
		});

		it('if an error happens during the database call, it does not call the next interceptor', function (done) {
			mockPlayersToGiveError(world, identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function () {
				should.fail();
			}, identifier);
			done();
		});

		var unmock = function () {
			players.findByAnyUniqueIdentifier = originalFunction;
		}

		var mockPlayersWhenGivenToReturn = function (expectedWorldId, expectedIdentifier, result) {
			players.findByAnyUniqueIdentifier = function (worldId, identifier, success, fail) {
				identifier.should.be.equal(expectedIdentifier);
				worldId.should.be.equal(expectedWorldId);
				success(result);
			};
		}

		var mockPlayersToGiveError = function (expectedWorldId, expectedIdentifier, error) {
			players.findByAnyUniqueIdentifier = function (worldId, identifier, success, fail) {
				identifier.should.be.equal(expectedIdentifier);
				worldId.should.be.equal(expectedWorldId);
				fail(error);
			};
		}
	});
});