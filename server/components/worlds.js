module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');
  var uniqueValidator = require('mongoose-unique-validator');

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    name: {type: String, required: true, unique: true, index: true}
  });
  WorldSchema.plugin(uniqueValidator);

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