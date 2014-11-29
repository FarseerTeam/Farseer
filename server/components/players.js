module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  // define the _playerSchema
  var _playerSchema = new Schema({
    id: Number,
    email: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    },
    name: String
  });
  var _model = mongoose.model('Player', _playerSchema);

  var _findByEmail = function(email, success, fail) {
    _model.findOne({
      email: email
    }, function(e, doc) {
      if (e) {
        fail(e)
      } else {
        success(doc);
      }
    });
  }

  return {
    model: _model,
    schema: _playerSchema,
    findByEmail: _findByEmail
  }
})();