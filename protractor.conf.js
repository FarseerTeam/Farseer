// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

var ScreenShotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  seleniumAddress: process.env.SELENIUM_ADDRESS,
  baseUrl: 'http://' + (process.env.TEST_HOST || 'localhost') +':' + (process.env.PORT || '9001'),

  // **DEPRECATED**
  // If true, only ChromeDriver will be started, not a Selenium Server.
  // This should be replaced with directConnect.
  // chromeOnly: true,

  // Boolean. If true, Protractor will connect directly to the browser Drivers
  // at the locations specified by chromeDriver and firefoxPath. Only Chrome
  // and Firefox are supported for direct connect.
  directConnect: false,

  // list of files / patterns to load in the browser
  specs: [
    'e2e/**/*.spec.js'
  ],

  // Patterns to exclude.
  exclude: [],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {

  },

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine2',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    defaultTimeoutInterval: 8000
  },

  onPrepare: function () {
    jasmine.getEnv().addReporter(new ScreenShotReporter({
      dest: './screenshots',
      captureOnlyFailedSpecs: true
    }));

  }
};
