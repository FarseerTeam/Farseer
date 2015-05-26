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
		if (typeof parentTeam === 'string') {
			return page.team(parentTeam).all(by.css('li.team'));
		}
		return parentTeam.all(by.css('li.team'));
	};

	this.imageSrc = function(image) {
		return image.getAttribute('src');
	};
};

module.exports = new PlayersMapPage();