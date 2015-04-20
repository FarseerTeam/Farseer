'use strict';

var common = require('./common');
var should = require('should');

describe('The components/common module... ', function(){

	describe('The isObjectId() function returns... ', function(){

		it('true if exactly 24 characters and hex characters.', function(done) {
			var result = common.isObjectId('01234567890aBcDeF0123456');
			result.should.be.equal(true);
			done();
		});

		it('false for 23 characters.', function(done) {
			var result = common.isObjectId('01234567890abcdef012345');
			result.should.be.equal(false);
			done();
		});

		it('false for 25 characters.', function(done) {
			var result = common.isObjectId('01234567890abcdef01234567');
			result.should.be.equal(false);
			done();
		});

		it('false for non-hex characters.', function(done) {
			var result = common.isObjectId('01234567890abcdef012345G');
			result.should.be.equal(false);
			done();
		});

		it('false for null.', function(done) {
			var result = common.isObjectId(null);
			result.should.be.equal(false);
			done();
		});

		it('false for undefined.', function(done) {
			var result = common.isObjectId(undefined);
			result.should.be.equal(false);
			done();
		});

		it('false for some object.', function(done) {
			var result = common.isObjectId({some: 'object'});
			result.should.be.equal(false);
			done();
		});

		it('false for an array.', function(done) {
			var result = common.isObjectId([]);
			result.should.be.equal(false);
			done();
		});
	});

	describe('The isPath() function returns... ', function(){

		it('true if exactly 24 characters and hex characters.', function(done) {
			var result = common.isPath('01234567890aBcDeF0123456');
			result.should.be.equal(true);
			done();
		});

		it('false for multiples of 24 characters separated by #.', function(done) {
			var result = common.isPath('01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef0123456');
			result.should.be.equal(true);
			result = common.isPath('01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef0123456');
			result.should.be.equal(true);
			done();
		});

		it('false for 23 + 25 characters.', function(done) {
			var result = common.isPath('01234567890abcdef012345#01234567890abcdef01234567');
			result.should.be.equal(false);
			done();
		});

		it('false for non-hex characters.', function(done) {
			var result = common.isPath('01234567890abcdef0123456#01234567890abcdef0123456#01234567890abcdef012345G');
			result.should.be.equal(false);
			done();
		});

		it('false for null.', function(done) {
			var result = common.isPath(null);
			result.should.be.equal(false);
			done();
		});

		it('false for undefined.', function(done) {
			var result = common.isPath(undefined);
			result.should.be.equal(false);
			done();
		});

		it('false for an object.', function(done) {
			var result = common.isPath({some: 'object'});
			result.should.be.equal(false);
			done();
		});

		it('false for an array.', function(done) {
			var result = common.isPath([]);
			result.should.be.equal(false);
			done();
		});
	});

	describe('The performCallBack() function... ', function(){

		it('calls the error callback (with the passed error) if an error exists.', function(done){
			var obj = {any: 'object'};
			var err = {error: 'object'};
			var successCB = function(doc) {should.fail();};
			var errorCB = function(error) {
				err.should.be.equal(error);
				done();
			};

			common.performCallBack(err, obj, successCB, errorCB);
		});

		it('calls the success callback (with the passed object) if no error exists.', function(done){
			var obj = {any: 'object'};
			var successCB = function(doc) {
				obj.should.be.equal(doc);
				done();
			};
			var errorCB = function(error) {should.fail();};

			common.performCallBack(undefined, obj, successCB, errorCB);
		});
	});
});
