'use strict';

describe('Google sign in link', function() {
  
  it('appears on the players map page', function() {
	  browser.get('/playersMap');
    var signInLink = element(by.css('a#google-sign-in')); 
    expect(signInLink.isPresent()).toBe(true);
    expect(signInLink.getAttribute('href')).toBe('http://localhost:9001/auth/google');
  }); 
  
  it('appears on the players roster page', function() {
	  browser.get('/players');
    var signInLink = element(by.css('a#google-sign-in')); 
    expect(signInLink.isPresent()).toBe(true);
    expect(signInLink.getAttribute('href')).toBe('http://localhost:9001/auth/google');
  });
});