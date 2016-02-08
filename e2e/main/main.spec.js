'use strict';

describe('The Home Page', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('redirects to playersMap', function(done) {
    expect(browser.getCurrentUrl()).toContain('/worlds');
    done();
  });
});
