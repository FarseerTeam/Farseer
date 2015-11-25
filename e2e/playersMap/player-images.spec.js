'use strict';

var page = require('./players-map.po');
var setup = require('../common/data-setup');
var RSVP = require('rsvp');

describe('The playersMap page has images for each player on it, and... ', function () {

  var imageTagsExist = function () {
    return element(by.css('li.player img')).isPresent();
  };

  var allImagesAreLoaded = function () {
    return page.playerImages.then(function (images) {
      return RSVP.hash({
        one: images[0].getSize(),
        two: images[1].getSize(),
        three: images[2].getSize()
      }).then(function (results) {
        return results.one.height > 0 && results.two.height > 0 && results.three.height > 0;
      });
    });
  };

  beforeEach(function (done) {
    setup.addTeam('team1', '/team1')
      .then(setup.addTeam('team2', '/team1/team2'))
      .then(setup.addPlayer('p0', 'p0@somewhere.com', undefined, 'world'))
      .then(setup.addPlayer('p1', 'p1@somewhere.com', '/team1', 'world'))
      .then(setup.addPlayer('p2', 'p2@somewhere.com', '/team1/team2', 'world'))
      .then(browser.get('playersMap'))
      .then(browser.wait(imageTagsExist, 1000))
      .then(browser.wait(allImagesAreLoaded, 10000))
      .then(done);
  });

  afterEach(function (done) {
    setup.purgeData().then(done);
  });

  it('the images are retrieved from gravatar.', function () {
    expect(page.playerImages.count()).toBe(3);
    for (var i = 0; i < 3; i++) {
      expect(page.imageSrc(page.playerImages.get(i))).toContain('gravatar.com/avatar');

      page.playerImages.get(i).getSize().then(function (size) {
        expect(size.height).toBeGreaterThan(50);
      });

    }
  });
});
