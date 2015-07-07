'use strict';

var app = require('../app');
var request = require('supertest');
var should = require('should');

function AuthTestHelper() {

  this.VALID_USER = 'validUser';
  this.INVALID = 'badUser';
  
  var Cookies = null;

  this.useAuth = function(username) {
    beforeEach(function(done) {
      request(app).get('/test-login?username=' + username + '&password=hi').end(function(err, res){
        if (err) {
          console.log('error logging in' + err);
          done(err);
        }
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
    });

    afterEach(function(){
      Cookies = null;
    });
  }

  this.get = function(url) {
    validateLoggedIn();
    var httpRequest = request(app).get(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  this.post = function(url) {
    validateLoggedIn();
    var httpRequest = request(app).post(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  this.put = function(url) {
    validateLoggedIn();
    var httpRequest = request(app).put(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  this.delete = function(url) {
    validateLoggedIn();
    var httpRequest = request(app).delete(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  var validateLoggedIn = function() {
    if (!Cookies) {
      should.fail('The useAuth method was never called.  AuthTestHelper needs useAuth to be called in the scope that the authentication should be valid before it can post an authenticated request.  See server/authentication/auth.spec.js for an example');
    }
  }
}

module.exports =  new AuthTestHelper();