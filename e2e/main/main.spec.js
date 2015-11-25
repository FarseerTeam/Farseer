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
});
