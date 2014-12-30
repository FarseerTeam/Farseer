module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  // define the _teamSchema
  var _teamSchema = new Schema({
    name: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    }
  });
  var _model = mongoose.model('Team', _teamSchema);


  return {
    Team: _model,
    schema: _teamSchema,
  }
})();