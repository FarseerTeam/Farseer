'use strict';

describe('The Home Page... ', function() {
  var myElement;

  beforeEach(function() {
    browser.get('');
  });

  it('is playersMap', function(done) {
    expect(browser.getCurrentUrl()).toContain('/playersMap');
    done();
  });

});
