'use strict';

var setup = require('../common/data-setup');
var page = require('./worlds.po.js');
var RSVP = require('rsvp');
var protractor = require('protractor');
var ec = protractor.ExpectedConditions;

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
      checkIfHtmlElementIsDisplayed('#worldTitle');
    });

    it('has no worlds displayed on the screen',function() {
      expect(element(by.id('worldsList')).isPresent()).toBe(false);
    });

    it('has a text field for entering a new world',function(){
      checkIfHtmlElementIsDisplayed('#worldNameInput');
    });

    it('has an add button to allowing adding of a new world',function(){
      checkIfHtmlElementIsDisplayed('#addWorldButton');
    });

    it('displays a newly-added world as a hyperlink after entering a new world and clicking the add button',function(done){

      var inputName=element(by.id('worldNameInput'));
      var addButton=element(by.id('addWorldButton'));
      const EXPECTED_WORLD_NAME = 'Pandora';

      inputName.sendKeys(EXPECTED_WORLD_NAME);
      addButton.click();

      var worldList = element(by.id('worldsList'));
      browser.wait(ec.presenceOf(worldList),1000).then(function(){
        const hyperlinkText = element(by.css('#worldsList a')).getAttribute('innerHTML');
        expect(hyperlinkText).toEqual(EXPECTED_WORLD_NAME);
        expect(worldList.getText()).toEqual(EXPECTED_WORLD_NAME);
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
        var worldList = element(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          var worldList=element.all(by.id('worldsList'));
          var textOfHyperlinks = element.all(by.css('#worldsList a')).getAttribute('innerHTML');

          expect(worldList.getText()).toEqual(['Pandora','Pillar']);
          expect(textOfHyperlinks).toEqual(['Pandora','Pillar']);
        }, function(){
          fail();
        }).then(done);
      });

      it('displays an edit icon after each entry', function (done) {
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

        inputName.sendKeys(newWorld);
        addButton.click();

        var worldList = element(by.id('worldsList'));
        var worldListArr = element.all(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          expect(worldListArr.count()).toEqual(3);
          expect(worldListArr.getText()).toEqual(['Pandora','Pillar','Neptune']);
        }, function(err){
          fail();
        }).then(done);
      });

    });

    describe('when editing the existing entries',function(){
      var worldList = element(by.id('worldsList'));

      beforeEach(function(done){
        setup.purgeData()
          .then(setup.addWorld('Pandora'))
          .then(setup.addWorld('Pillar'))
          .then(browser.get('/'))
          .then(done);

        activateEditMode();
      });

      afterEach(function(done){
        setup.purgeData()
          .then(done);
      });

      it('displays a save, an undo, and a delete icon after the text box when the edit icon is clicked',function() {
        checkIfHtmlElementIsDisplayed('.fa-floppy-o');
        checkIfHtmlElementIsDisplayed('.fa-undo');
        checkIfHtmlElementIsDisplayed('.fa-trash');
      });

      it('changes the hyperlink to a pre-filled text box when the edit icon is clicked', function(done){
        var textBoxes = element.all(by.model('updatedWorldName'));
        var hyperlinks = element.all(by.css('#worldsList a'));

        browser.wait(ec.presenceOf(worldList),1000).then(function(){
          expect(textBoxes.getAttribute('value')).toEqual(hyperlinks.getAttribute('innerHTML'));
          checkIfHtmlElementIsDisplayed('#worldsList input');
          checkIfHtmlElementIsNotDisplayed('#worldsList a');
        }, function(err){
          fail();
        }).then(done);
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
          checkVisibilityOfElementsAfterLeavingEditMode();
        }).then(done);

      });

      it('resets to the original world name after altering the text box and clicking the undo icon', function(done) {
        var newWorld = "Neptune1234";
        var inputName=element(by.css('#worldsList input'));
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
          checkVisibilityOfElementsAfterLeavingEditMode();
        }, function(err){
          fail();
        }).then(done);


      });

      it('deletes the world when the delete icon is clicked', function(done){
        var worldList = element(by.id('worldsList'));
        var deleteIcon = retrieveElement('.fa-trash');

        deleteIcon.click();
        browser.switchTo().alert().accept();

        var worldListArr = element.all(by.id('worldsList'));
        browser.wait(ec.presenceOf(worldList), 1000).then(function(){
          var expectedWorldsArr = ['Pillar'];
          expect(worldListArr.count()).toEqual(1);
          expect(worldListArr.getText()).toEqual(expectedWorldsArr);
          checkVisibilityOfElementsAfterLeavingEditMode();
        }, function(err){
          fail();
        }).then(done);

      });

      function activateEditMode(){
        retrieveElement('.fa-pencil-square-o').click();
      }

      function checkVisibilityOfElementsAfterLeavingEditMode(){
        checkIfHtmlElementIsDisplayed('#worldsList a');
        checkIfHtmlElementIsDisplayed('.fa-pencil-square-o');
        checkIfHtmlElementIsNotDisplayed('#worldsList input');
        checkIfHtmlElementIsNotDisplayed('.fa-floppy-o');
        checkIfHtmlElementIsNotDisplayed('.fa-undo');
        checkIfHtmlElementIsNotDisplayed('.fa-trash');
      }

    });

  });

  function retrieveElement(cssSelector){
    return browser.driver.findElement(by.css(cssSelector));
  }

  function checkIfHtmlElementIsDisplayed(cssSelector){
    expect(retrieveElement(cssSelector).getCssValue('display')).not.toEqual('none');
    expect(retrieveElement(cssSelector).getCssValue('display')).not.toEqual('');
  }

  function checkIfHtmlElementIsNotDisplayed(cssSelector){
    expect(retrieveElement(cssSelector).getCssValue('display')).toEqual('none');
  }
});
