module.exports = (function() {

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    var ActionSchema = new Schema({
    });

    var _model = mongoose.model('Action', ActionSchema);

    return {
        Action: _model
    };
})();