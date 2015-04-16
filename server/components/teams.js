module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');

  var Schema = mongoose.Schema;

  var TeamSchema = new Schema({
    path: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    },
    name: {
      type: String
    }
  });
  var _model = mongoose.model('Team', TeamSchema);

  var _findByPath = function (teamPath, successCB, errorCB) {
    _model.findOne(
      {
        path: teamPath
      },
      function (err, doc) {
        common.performCallBack(err, doc, successCB, errorCB);
      }
    )
  };

  var _findById = function (id, successCB, errorCB) {
    _model.findById(id, function (err, doc) {
      common.performCallBack(err, doc, successCB, errorCB);
    });
  };

  var _findByAnyUniqueIdentifier = function (uniqueIdentifier, successCB, errorCB) {
    if (common.isObjectId(uniqueIdentifier)) {
      _findById(uniqueIdentifier, successCB, errorCB);
    }
    else {
      _findByPath(uniqueIdentifier, successCB, errorCB);
    }
  };

  return {
    Team: _model,
    schema: TeamSchema,
    findByPath: _findByPath,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier
  }
})();
