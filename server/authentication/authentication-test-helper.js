'use strict';

var app = require('../app');
var request = require('supertest');

function AuthTestHelper() {
  var Cookies;

  this.init = function() {
    beforeEach(function(done) {
      request(app).get('/test-login?username=hi&password=there').end(function(err, res){
        if (err) {
          console.log('error logging in');
          done(err);
        }
        console.log('returning from get for login');
        console.log('res' + JSON.stringify(res, null, ' '));
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        console.log('new cookie: ' + Cookies);
        done();
      });
    });
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