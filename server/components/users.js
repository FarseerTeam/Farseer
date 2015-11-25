module.exports = (function() {

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var _usersSchema = new Schema({
    email: {
      type: String,
      index: {
        required: true
      }
    }
  });
   
  var _model = mongoose.model('User', _usersSchema);

  return {
    User: _model
  }
})();
