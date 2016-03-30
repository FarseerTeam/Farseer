'use strict';

var assert = require('chai').assert;
require('chai').use(require('dirty-chai'));
var errorHandler = require('./errorHandler.js');


describe('The Error Handler... ', function() {

  it('returns the duplicate key error message for the proper field', function() {
    const DUPLICATE_KEY_ERROR_CODE = 11000;
    const EXPECTED_ERROR_MESSAGE_WORLD = "Cannot enter a world with " +
      "the same name as another world";
    const EXPECTED_ERROR_MESSAGE_PLAYER = "Cannot enter a player with " +
      "the same name as another player";

    var result = errorHandler.retrieveErrorMessage(DUPLICATE_KEY_ERROR_CODE, 'world');
    assert.equal(EXPECTED_ERROR_MESSAGE_WORLD, result);

    result = errorHandler.retrieveErrorMessage(DUPLICATE_KEY_ERROR_CODE, 'player');
    assert.equal(EXPECTED_ERROR_MESSAGE_PLAYER, result);
  });

  it('returns the internal server error message', function(){
    const INTERNAL_SERVER_ERROR = 500;
    const EXPECTED_ERROR_MESSAGE = "An internal server error has occurred.";
    var result = errorHandler.retrieveErrorMessage(INTERNAL_SERVER_ERROR);
    assert.equal(EXPECTED_ERROR_MESSAGE, result);
  });

  it('returns the empty string when no error code is given', function(){
    assert.equal('', errorHandler.retrieveErrorMessage());
  })

});
