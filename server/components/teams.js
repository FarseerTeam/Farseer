
module.exports = (function() {

  var mongoose = require('mongoose');
	var tree = require('mongoose-path-tree');

  var Schema = mongoose.Schema;

  // define the TeamSchema
  var TeamSchema = new Schema({
    name: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    }	
  });
  TeamSchema.plugin(tree);
  var _model = mongoose.model('Team', TeamSchema);


  return {
    Team: _model,
    schema: TeamSchema,
  }
})();