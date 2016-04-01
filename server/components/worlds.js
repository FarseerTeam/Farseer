module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    id: {type: String, required: true, unique: true, index: true},
    name: {type: String, required: true}
  });

  var _model = mongoose.model('World', WorldSchema);

  var _updateWorldName = function(id, updatedWorldId, updatedWorldName) {
      var updateQuery = _model.findOneAndUpdate(
          { id: id },
          { id: updatedWorldId, name: updatedWorldName },
          { upsert: true, new: true });

    return updateQuery.exec();
  };

  return {
    World: _model,
    schema: WorldSchema,
    updateWorldName: _updateWorldName
  };
})();
