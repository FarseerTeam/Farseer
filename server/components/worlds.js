module.exports = (function () {

  var mongoose = require('mongoose');
  var common = require('./common');

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    id: {type: String, required: true, unique: true, index: true}
  });

  var _model = mongoose.model('World', WorldSchema);

//TODO: actually update the name, once it exists
  var _updateWorldName = function(id, updatedWorldName) {
    var updateQuery = _model.findOneAndUpdate({id: id}, {id: updatedWorldName}, {upsert: true, new: true});

    return updateQuery.exec();
  };

  return {
    World: _model,
    schema: WorldSchema,
    updateWorldName: _updateWorldName
  };
})();
