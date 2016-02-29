'use strict';

var setup = require('../common/data-setup');
var page = require('./worlds.po.js');
var RSVP = require('rsvp');
var progractor = require('protractor');

describe('the application opens to the Worlds screen by default and ...', function(){
  describe('when there are no worlds', function() {
    beforeEach(function(done){
      setup.purgeData()
        .then(browser.get('/'))
        .then(done);
    });

    afterEach(function(done){
      setup.purgeData()
        .then(done);
    });

    it('displays the Worlds entry screen on startup',function() {
      expect(element(by.id('worldTitle')).isPresent()).toBe(true);
    });

    it('has no worlds displayed on the screen',function() {
      expect(element(by.id('worldsList')).isPresent()).toBe(false);
    });

    it('has a text field for entering a new world',function(){
      expect(element(by.id('worldNameInput')).isPresent()).toBe(true);
    });

    it('has an add button to allowing adding of a new world',function(){
      expect(element(by.id('addWorldButton')).isPresent()).toBe(true);
    });

    it('displays a newly-added world as a hyperlink after entering a new world and clicking the add button',function(done){

      var inputName=element(by.id('worldNameInput'));
      var addButton=element(by.id('addWorldButton'));
      var ec = protractor.ExpectedConditions;

      inputName.sendKeys('Pandora');
      addButton.click();

      var worldList = element(by.id('worldsList'));
      browser.wait(ec.presenceOf(worldList),1000).then(function(){
        expect(worldList.getText()).toEqual('Pandora');
      }, function(err){
        fail();
      }).then(done);
    });
  });

  describe('when there are existing worlds in the database and...',function() {
    describe('when the application is started at the default routing',function() {
      beforeEach(function(done){
        setup.purgeData()
          .then(setup.addWorld('Pandora'))
          .then(setup.addWorld('Pillar'))
          .then(browser.get('/'))
          .then(done);
      });

      afterEach(function(done){
        setup.purgeData()
          .then(done);
      });

      it('displays the name of all of the worlds on file as hyperlinks', function (done) {

        var ec = protractor.ExpectedConditions;
        var worldList = element(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          var worldList=element.all(by.id('worldsList'));

          expect(worldList.getText()).toEqual(['Pandora','Pillar']);
        }, function(){
          fail();
        }).then(done);
      });

      it('displays an edit icon after each entry', function () {

      });
    });

    describe('when adding a new world to a set of existing worlds',function(){

      beforeEach(function(done){
        setup.purgeData()
          .then(setup.addWorld('Pandora', 'Pillar'))
          .then(browser.get('/'))
          .then(done);
      });

      afterEach(function(done){
        setup.purgeData()
          .then(done);
      });

      it('adds a new world to the list after entering the text and the add button is clicked',function(){

      });

      it('displays the new world with italic and bold attributes', function() {

      });
    });

    describe('when editing the existing entries',function(){

      it('displays a save icon after the text box when the edit icon is clicked',function() {

      });

      it('displays an undo icon after the text box when the edit icon is clicked', function() {

      });

      it('changes the hyperlink to a pre-filled text box when the edit icon is clicked', function(){

      });

      it('changes the text box to a hyperlink containing the new world name when the save icon is clicked', function(){

      });

      it('displays an edited entry hyperlink with bold and italic attributes', function() {

      });

      it('resets to the original world name after altering the text box and clicking the undo icon', function(){

      });

      it('deletes the world when the delete icon is clicked', function(){

      });
    });

  });
});
