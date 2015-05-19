'use strict';

var PlayersMapPage = function() {

	this.teams = element.all(by.css('li.team'));
	this.players = element.all(by.css('li.player'));
	this.teamNameFor = function(team) {
		return team.element(by.css('p'));
	}
};

module.exports = new PlayersMapPage();