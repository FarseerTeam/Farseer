'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.dev.MONGO_URI || 'mongodb://localhost/farseer-dev'
  },

  seedDB: true
};
