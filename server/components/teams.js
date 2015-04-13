module.exports = (function() {

  var mongoose = require('mongoose');
	var tree = require('mongoose-path-tree');
  var common = require('./common');

  var Schema = mongoose.Schema;

  // define the TeamSchema
  var TeamSchema = new Schema({
    name: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    }
  });
  TeamSchema.plugin(tree);
  var _model = mongoose.model('Team', TeamSchema);

  var _findByName = function(teamName, successCB, errorCB) {
    _model.findOne({name: teamName}, function(err, doc) {
        common.performCallBack(err, doc, successCB, errorCB);
      }
    )
  };

  var _findById = function(id, successCB, errorCB) {
    _model.findById(id, function(err, doc) {
      common.performCallBack(err, doc, successCB, errorCB);
    });
  }

  var _findByAnyUniqueIdentifier = function(uniqueIdentifier, successCB, errorCB) {
    if(common.isObjectId(uniqueIdentifier)) {
      _findById(uniqueIdentifier, successCB, errorCB);
    } else {
      _findByName(uniqueIdentifier, successCB, errorCB);
    }
  }

  return {
    Team: _model,
    schema: TeamSchema,
    findByName: _findByName,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier
  }
})();