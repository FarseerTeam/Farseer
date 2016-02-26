'use strict';

var page = require('./players-map.po');
var setup = require('../common/data-setup');

describe('The players map', function () {

  beforeEach(function () {
    setup.addPlayer('newPlayer', 'some@gmail.com', undefined, 'world');
    setup.addPlayer('Q', 'cutie@gmail.com', '/quotes', 'world');
    setup.addPlayer('R', 'random@gmail.com', '/noquotes', 'world');

    setup.addTeam('Double Quotes', '/quotes', 'anotherWorld');
    setup.addTeam('Single Quotes', '/quotes', 'world');
    setup.addTeam(undefined, '/noquotes');

    browser.get('worlds/world/playersMap');
  });

  afterEach(function (done) {
    setup.purgeData().then(done);
  });

  it('shows unassigned players in a group titled "unassigned"', function () {
    var unassignedTeam = page.team('unassigned');
    expect(page.playerOnTeam(unassignedTeam, 'newPlayer').isPresent()).toBe(true);
  });

  it('displays the team name', function () {
    var quoteTeam = element(by.id('/quotes'));
    var teamName = quoteTeam.element(by.className('team-name'));
    expect(teamName.getText()).toBe('Single Quotes');
  });

  it('displays only teams for the selected world', function(){
    var quoteTeam = element(by.id('/quotes'));
    var players = quoteTeam.all(by.className('player'));
    expect(players.count()).toBe(1);
  });

  it('displays the team path element when no team name exists', function () {
    var quoteTeam = element(by.id('/noquotes'));
    var teamName = quoteTeam.element(by.className('team-name'));
    expect(teamName.getText()).toBe('noquotes');
  });
});
