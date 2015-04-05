module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

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
      if (err) {
        fail(err);
      } else {
        success(doc);
      }
    });
  }

  var _findById = function(id, success, fail) {
    _model.findById(id, function(err, doc) {
      if(err) {
        fail(err);
      } else {
        success(doc);
      }
    });
  }

  var _findByAnyUniqueIdentifier = function(uniqueIdentifier, success, fail) {
    if(isObjectId(uniqueIdentifier)) {
      _findById(uniqueIdentifier, success, fail);
    }
    else {
      _findByEmail(uniqueIdentifier, success, fail);
    }
  }

  var isObjectId = function(id) {
    var strId = String(id);
    return /^[0-9a-fA-F]{24}$/.test(strId); 
    // http://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid 
    // https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
  }

  return {
    Player: _model,
    schema: _playerSchema,
    findByEmail: _findByEmail,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier
  }
})();