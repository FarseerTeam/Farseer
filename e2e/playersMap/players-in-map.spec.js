'use strict';

var page = require('./players-map.po');
var setup = require('../common/data-setup');

describe('The players map', function () {

  beforeEach(function () {
    setup.addPlayer('newPlayer', 'some@gmail.com', undefined, 'world');
    setup.addTeam('Single Quotes', 'quotes');
    setup.addPlayer('Q', 'cutie@gmail.com', '/quotes', 'world');
    browser.get('playersMap');
  });

  afterEach(function (done) {
    //setup.purgeData().then(done);
  });

  it('shows unassigned players in a group titled "unassigned"', function () {
    var unassignedTeam = page.team('unassigned');
    expect(page.playerOnTeam(unassignedTeam, 'newPlayer').isPresent()).toBe(true);
  });

  fit('displays the team name', function () {
    var quoteTeam = element(by.id('/quotes'));
    var teamName = quoteTeam.element(by.className('team-name'));
    expect(teamName.getText()).toBe('Single Quotes');
  });

  it('displays the team path element when no team name exists', function () {

  });
});
