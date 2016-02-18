module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var common = require('./common');

  var _playerSchema = new Schema({
    email: {
      type: String,
      index: {
        required: true
      }
    },
    name: String,
    world: String,
    _team : String
  });
  _playerSchema.index({ email: 1, world: 1 }, { unique: true });
   
  var _model = mongoose.model('Player', _playerSchema);

  var _findByEmail = function(worldId, email, success, fail) {
    _model.findOne({world: worldId, email: email}, function(err, doc) {
      common.performCallBack(err, doc, success, fail);
    });
  };

  var _findById = function(worldId, id, success, fail) {
    _model.findOne({_id: id, world: worldId}, function(err, doc) {
      common.performCallBack(err, doc, success, fail);
    });
  };

  var _findByAnyUniqueIdentifier = function(worldId, uniqueIdentifier, success, fail) {
    if(common.isObjectId(uniqueIdentifier)) {
      _findById(worldId, uniqueIdentifier, success, fail);
    } else {
      _findByEmail(worldId, uniqueIdentifier, success, fail);
    }
  };

  var _updatePlayersWorlds = function(oldWorldName, newWorldName) {
    var query = {world: formatWorldName(oldWorldName)};
    var updateQuery = _model.update(query, {world: formatWorldName(newWorldName)}, {multi: true});
    return updateQuery.exec();
  };

  var formatWorldName = function(name) {
    return name.replace(/ /g, '').toLowerCase();
  };


  return {
    Player: _model,
    schema: _playerSchema,
    findByAnyUniqueIdentifier: _findByAnyUniqueIdentifier,
    updatePlayersWorlds: _updatePlayersWorlds
  }
})();
