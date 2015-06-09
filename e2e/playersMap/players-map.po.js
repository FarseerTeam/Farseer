/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var PlayersMapPage = function() {

	var page = this;

	this.allTeams = element.all(by.css('li.team'));

	this.allPlayers = element.all(by.css('li.player'));

	this.playerImages = element.all(by.css('li.player img')); 
	
	this.teamNameFor = function(team) {
		return team.all(by.css('p')).get(0).getText();
	};

	this.team = function(teamName) {
		return page.allTeams.filter(function(element, index) {
			return page.teamNameFor(element).then(function(text) {
				return text === teamName;
			});
		}).get(0);	
	};

	this.childTeamsOf = function(parentTeam) {
		var parentNode = parentTeam
		if (typeof parentTeam === 'string') {
			parentNode = page.team(parentTeam)
		}
		return parentNode.all(by.css('li.team'));
	};

	this.imageSrc = function(image) {
		return image.getAttribute('src');
	};

	this.player = function(playerName) {
		return page.allPlayers.filter(function(element, index){
			return page.playerNameFor(element).then(function(text) {
				return text === playerName;
			});
		}).get(0);
	};

	this.playerNameFor = function(player) {
		return player.all(by.css('div')).first().getText();
	}

	this.teamNameForPlayer = function(player) {
		var pathFromPlayerToTeamName = '../../p';
		var playerNode = player;
		if (typeof player === 'string') {
			playerNode =  page.player(player);
		}
		return playerNode.all(by.xpath(pathFromPlayerToTeamName)).first().getText();
	};
};

module.exports = new PlayersMapPage();