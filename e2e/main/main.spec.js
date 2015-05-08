'use strict';

describe('Main View', function() {
  var page;
  var myElement;

  beforeEach(function() {
    browser.get('/');
    myElement = element(by.id("email"));
    page = require('./main.po');
  });

  it('... this is only a test to see if this thing works!', function() {
    //console.log(myElement);
    expect(myElement).toBeDefined();
    expect(page.emailTextInput).toBeDefined();
  });
});
