module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var common = require('./common');

  // define the _playerSchema
  var _playerSchema = new Schema({
    email: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    },
    name: String,
    _team : { type: Schema.Types.ObjectId, ref: 'Team' },
  });
  var _model = mongoose.model('Player', _playerSchema);

  var _findByEmail = function(email, success, fail) {
    _model.findOne({
      email: email
    }, function(err, doc) {
      common.performCallBack(err, doc, success, fail);
    });
  }

  var _findById = function(id, success, fail) {
    _model.findById(id, function(err, doc) {
      common.performCallBack(err, doc, success, fail);
    });
  }

  var _findByAnyUniqueIdentifier = function(uniqueIdentifier, success, fail) {
    if(common.isObjectId(uniqueIdentifier)) {
      _findById(uniqueIdentifier, success, fail);
    }
    else {
      _findByEmail(uniqueIdentifier, success, fail);
    }
  }

  return {
    Player: _model,
    schema: _playerSchema,
    findByEmail: _findByEmail,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier
  }
})();