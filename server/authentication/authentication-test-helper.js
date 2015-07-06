'use strict';

var app = require('../app');
var request = require('supertest');

function AuthTestHelper() {
  var Cookies;
  var username = 'hi';
  var password = 'there';

  this.init = function() {
    beforeEach(function(done) {
      request(app).get('/test-login?username=' + username + '&password=' + password).end(function(err, res){
        if (err) {
          console.log('error logging in' + err);
          done(err);
        }
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
    });
  }

  this.login = function(uname, pword) {
    this.username = uname ? uname : 'hi';
    this.password = pword ? pword : 'there';
    return this;
  }

  this.get = function(url) {
    var httpRequest = request(app).get(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  this.post = function(url) {
    var httpRequest = request(app).post(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }

  this.put = function(url) {
    var httpRequest = request(app).put(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }


  this.delete = function(url) {
    var httpRequest = request(app).delete(url);
    httpRequest.cookies = Cookies;
    return httpRequest;
  }
}

module.exports =  new AuthTestHelper();