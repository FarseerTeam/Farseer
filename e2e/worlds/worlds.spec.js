'use strict';

var setup = require('../common/data-setup');
var page = require('./worlds.po.js');
var RSVP = require('rsvp');
var protractor = require('protractor');

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

  describe('when there are existing worlds in the database and...', function() {
    describe('when the application is started at the default routing', function() {
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
          expect(worldList.getText()).toContain('Pandora');
          expect(worldList.getText()).toContain('Pillar');
        }, function(){
          fail();
        }).then(done);
      });

      it('displays an edit icon after each entry', function (done) {

        var ec = protractor.ExpectedConditions;
        var editIcons = element(by.css('.fa-pencil-square-o'));

        browser.wait(ec.presenceOf(editIcons),1000).then(function(){
          var elements = element.all(by.className('fa-pencil-square-o'));

          expect(element(by.className('fa-pencil-square-o')).isDisplayed()).toBeTruthy();
          expect(elements.count()).toEqual(2);

        }, function(){
          fail();
        }).then(done);

      });
    });

    describe('when adding a new world to a set of existing worlds',function(){
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

      it('adds a new world to the list after entering the text and the add button is clicked',function(done){
        var newWorld = "Neptune";
        var inputName=element(by.id('worldNameInput'));
        var addButton=element(by.id('addWorldButton'));
        var ec = protractor.ExpectedConditions;

        inputName.sendKeys(newWorld);
        addButton.click();

        var worldList = element(by.id('worldsList'));
        var worldListArr = element.all(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          expect(worldListArr.count()).toEqual(3);
          expect(worldListArr.getText()).toContain('Pandora');
          expect(worldListArr.getText()).toContain('Pillar');
          expect(worldListArr.getText()).toContain('Neptune');
        }, function(err){
          fail();
        }).then(done);
      });

    });

    describe('when editing the existing entries',function(){

      var ec = protractor.ExpectedConditions;
      var worldList = element(by.id('worldsList'));

      beforeEach(function(done){
        setup.purgeData()
          .then(setup.addWorld('Pandora'))
          .then(setup.addWorld('Pillar'))
          .then(browser.get('/'))
          .then(done);

        var editIcon = retrieveElement('.fa-pencil-square-o');
        editIcon.click();
      });

      afterEach(function(done){
        setup.purgeData()
          .then(done);
      });

      it('displays a save, an undo, and a delete icon after the text box when the edit icon is clicked',function(done) {
        checkIfHtmlElementIsDisplayed(done, '.fa-floppy-o');
        checkIfHtmlElementIsDisplayed(done, '.fa-undo');
        checkIfHtmlElementIsDisplayed(done, '.fa-trash');
      });

      it('changes the hyperlink to a pre-filled text box when the edit icon is clicked', function(done){
        var textBoxes = element.all(by.model('updatedWorldName'));
        var hyperlinks = element.all(by.css('#worldsList a'));

        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          expect(textBoxes.getAttribute('value')).toEqual(hyperlinks.getAttribute('innerHTML'));
        }, function(err){
          fail();
        }).then(done);

        checkIfHtmlElementIsDisplayed(done, '#worldsList input');
        checkIfHtmlElementIsNotDisplayed(done, '#worldsList a');
      });

      it('changes the text box to a hyperlink containing the new world name when the save icon is clicked', function(done){
        var textToAppend = "Omega";
        var expectedNewWorldName = "Pandora" + textToAppend;
        var textBoxes = retrieveElement('#worldsList input');
        var hyperlinks = retrieveElement('#worldsList a');
        var saveIcon = retrieveElement('.fa-floppy-o');

        var worldList = retrieveElement('#worldsList');
        textBoxes.sendKeys(textToAppend);

        saveIcon.click().then(function(){
          expect(worldList.getText()).toEqual(expectedNewWorldName);
          expect(worldList.getText()).toEqual(hyperlinks.getAttribute('innerHTML'));
          expect(worldList.getText()).toEqual(textBoxes.getAttribute('value'));
          checkVisibilityOfElementsAfterLeavingEditMode(done)
        }).then(done);

      });

      it('resets to the original world name after altering the text box and clicking the undo icon', function(done) {
        var newWorld = "Neptune1234";
        var inputName=element(by.id('worldNameInput'));
        var textBoxes = element.all(by.model('updatedWorldName'));
        var hyperlinks = element.all(by.css('#worldsList a'));

        inputName.sendKeys(newWorld);
        var undoIcon = element(by.css('.fa-undo'));
        undoIcon.click();

        var worldListArr = element.all(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          expect(worldListArr.count()).toEqual(2);
          expect(worldListArr.getText()).toEqual(hyperlinks.getAttribute('innerHTML'));
          expect(worldListArr.getText()).toEqual(textBoxes.getAttribute('value'));
        }, function(err){
          fail();
        }).then(done);


        checkVisibilityOfElementsAfterLeavingEditMode(done);
      });

      it('deletes the world when the delete icon is clicked', function(done){
        var worldList = element(by.id('worldsList'));
        var deleteIcon = retrieveElement('.fa-trash');

        //sort?
        deleteIcon.click();
        browser.switchTo().alert().accept();

        var worldListArr = element.all(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList), 1000).then(function(){
          var expectedWorldsArr = ['Pillar'];
          expect(worldListArr.count()).toEqual(1);
          expect(worldListArr.getText()).toEqual(expectedWorldsArr);
          checkVisibilityOfElementsAfterLeavingEditMode(done);
        }, function(err){
          fail();
        }).then(done);

      });

      function retrieveElement(cssSelector){
        return browser.driver.findElement(by.css(cssSelector));
      }

      function checkIfHtmlElementIsDisplayed(done, cssSelector){
        expect(retrieveElement(cssSelector).getCssValue('display')).not.toEqual('none');
        expect(retrieveElement(cssSelector).getCssValue('display')).not.toEqual('');
        done();
      }

      function checkIfHtmlElementIsNotDisplayed(done, cssSelector){
        expect(retrieveElement(cssSelector).getCssValue('display')).toEqual('none');
        done();
      }

      function checkVisibilityOfElementsAfterLeavingEditMode(done){
        checkIfHtmlElementIsDisplayed(done, '#worldsList a');
        checkIfHtmlElementIsDisplayed(done, '.fa-pencil-square-o');
        checkIfHtmlElementIsNotDisplayed(done, '#worldsList input');
        checkIfHtmlElementIsNotDisplayed(done, '.fa-floppy-o');
        checkIfHtmlElementIsNotDisplayed(done, '.fa-undo');
        checkIfHtmlElementIsNotDisplayed(done, '.fa-trash');
      }

    });

  });
});
