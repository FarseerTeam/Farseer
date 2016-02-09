module.exports = (function () {

  var mongoose = require('mongoose');

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

  return {
    World: _model,
    schema: WorldSchema
  };
})();
