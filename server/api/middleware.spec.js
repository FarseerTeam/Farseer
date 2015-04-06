'use strict';

var should = require('should');
var players = require("../components/players");
var middleware = require('./middleware');

describe('The middleware module... ', function(){

	describe('When intercepting playerUniqueIdentifier... ', function(){

		var identifier = 'anything';
		var mockPlayer = {name: 'Juan', email: 'juan@gmail.com'};
		var mockRequest = {};
		var next = function(){};
		var mockError = {err: 'mock error'};
		var mockResponse = {
				statusCode: undefined,
				jsonObject: undefined,
				status: function(code) {this.statusCode = code; return this;},
				json: function(obj) {this.jsonObject = obj; return this;}
			};
		var originalFunction;

		beforeEach(function(done) {
			originalFunction = players.findByAnyUniqueIdentifier;
			done();
		});

		afterEach(function(done){
			unmock();
			done();
		});

		it('it adds the results from the components/players module to the param.', function(done) {
			mockPlayersWhenGivenToReturn(identifier, mockPlayer);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function() {
				mockPlayer.should.be.equal(mockRequest.player);
				done();
			}, identifier);
		});

		it('if no player is found, sends status code 404. ', function(done){
			mockPlayersWhenGivenToReturn(identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			(404).should.be.equal(mockResponse.statusCode);
			done();
		});

		it('if no player is found, returns a json object with error message. ', function(done){
			mockPlayersWhenGivenToReturn(identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			should.exist(mockResponse.jsonObject);
			mockResponse.jsonObject.message.should.equal("PLAYER with identifier '" + identifier + "' does not exist.");
			done();
		});

		it('it does not call the next interceptor if no player is found. ', function(done){
			mockPlayersWhenGivenToReturn(identifier, null);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function() {
				should.fail();
			}, identifier);
			done();
		});

		it('if an error happens during the database call, sends status code 500.', function(done) {
			mockPlayersToGiveError(identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			(500).should.be.equal(mockResponse.statusCode);
			done();
		});

		it('if an error happens during the database call, returns a json object with the error message and the error object.', function(done) {
			mockPlayersToGiveError(identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, next, identifier);
			should.exist(mockResponse.jsonObject);
			mockResponse.jsonObject.message.should.equal('An unexpected application error has occured.');
			mockResponse.jsonObject.err.should.equal(mockError);
			done();
		});

		it('if an error happens during the database call, it does not call the next interceptor.', function(done) {
			mockPlayersToGiveError(identifier, mockError);

			middleware.playerUniqueIdentifierInterceptor('player')(mockRequest, mockResponse, function() {
				should.fail();
			}, identifier);
			done();
		});

		var unmock = function() {
			players.findByAnyUniqueIdentifier = originalFunction;
		}

		var mockPlayersWhenGivenToReturn = function(expectedParameter, result) {
			players.findByAnyUniqueIdentifier = function(identifier, success, fail) {
				identifier.should.be.equal(expectedParameter);
				success(result);
			};
		}

		var mockPlayersToGiveError = function(expectedParameter, error) {
			players.findByAnyUniqueIdentifier = function(identifier, success, fail) {
				identifier.should.be.equal(expectedParameter);
				fail(error);
			};
		}
	});
});