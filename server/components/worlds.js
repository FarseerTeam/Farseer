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

  var _findWorldByName = function(worldName) {
    return _model.findOne({name: worldName}, function(err, doc) {
      if (err) {
        console.log("Error occurred while looking for a world by name");
      } else {
        return doc._doc;
      }
    });
  };



  return {
    World: _model,
    schema: WorldSchema,
    findWorldByName: _findWorldByName
  };
})();
