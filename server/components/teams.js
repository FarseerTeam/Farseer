
module.exports = (function() {

  var mongoose = require('mongoose');
	var tree = require('mongoose-path-tree');

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
    _model.findOne(
      {
        name: teamName
      },
      function(err, doc) {
        if(err) {
          errorCB(err);
        } else {
          successCB(doc);
        }
      }
    )
  };

  var _findById = function(id, successCB, errorCB) {
    _model.findById(id, function(err, doc) {
      if(err) {
        errorCB(err);
      } else {
        successCB(doc);
      }
    });
  }

  var _findByAnyUniqueIdentifier = function(uniqueIdentifier, successCB, errorCB) {
    if(isObjectId(uniqueIdentifier)) {
      _findById(uniqueIdentifier, successCB, errorCB);
    }
    else {
      _findByName(uniqueIdentifier, successCB, errorCB);
    }
  }

  var isObjectId = function(id) {
    var strId = String(id);
    return /^[0-9a-fA-F]{24}$/.test(strId); 
  }

  return {
    Team: _model,
    schema: TeamSchema,
    findByName: _findByName,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier
  }
})();
