'use strict';

describe('The Home Page', function() {
  var myElement;

  beforeEach(function() {
    browser.get('/');
  });

  it('redirects to playersMap', function(done) {
    expect(browser.getCurrentUrl()).toContain('/playersMap');
    done();
  });
  
  it('has a Google sing in link', function() {
    var signInLink = element(by.css('a#google-sign-in')); 
    expect(signInLink.isPresent()).toBe(true);
    expect(signInLink.getAttribute('href')).toBe('http://localhost:9001/auth/google');
  });

});
