module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    name: {type: String},
    path: {
      type: String,
      index: {
        required: true
      }
    }
  });
  WorldSchema.index({ path: 1}, { unique: true });

  var _model = mongoose.model('World', WorldSchema);

  //TODO: make world name unique
  var _updateWorldName = function(worldName, updatedWorldName) {
    var updateQuery = _model.findOneAndUpdate({name: worldName}, {name: updatedWorldName}, {upsert: true, new: true});

    return updateQuery.exec();
  };

  return {
    World: _model,
    schema: WorldSchema,
    updateWorldName: _updateWorldName
  };
})();