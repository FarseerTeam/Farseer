module.exports = (function () {

  var mongoose = require('mongoose'); 

  var Schema = mongoose.Schema;

  var WorldSchema = new Schema({
    name: {type: String}
  });
  
  var _model = mongoose.model('World', WorldSchema);

  return {
    World: _model,
    schema: WorldSchema
  };
})();
