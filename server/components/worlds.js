module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    name: {type: String, required: true, unique: true, index: true}
  });

  var _model = mongoose.model('World', WorldSchema);

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
