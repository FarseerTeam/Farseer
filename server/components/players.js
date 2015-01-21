module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  // define the _playerSchema
  var _playerSchema = new Schema({
    email: {
      type: String,
      index: {
        unique: true,
        required: true
      }
    },
    name: String,
    _team : { type: Schema.Types.ObjectId, ref: 'Team' },
  });
  var _model = mongoose.model('Player', _playerSchema);

  var _findByEmail = function(email, success, fail) {
    _model.findOne({
      email: email
    }, function(err, doc) {
      if (err) {
        fail(err)
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