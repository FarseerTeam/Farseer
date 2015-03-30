
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

  var _findByName = function(teamName, successCB, errorCB) {
    _model.findOne(
      {
        name: teamName
      },
      function(err, doc) {
        if(err) {
          errorCB(err);
        } else {
          successCB(doc);
        }
      }
    )
  };

  return {
    Team: _model,
    schema: TeamSchema,
    findByName: _findByName
  }
})();
