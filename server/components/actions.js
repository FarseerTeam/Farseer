module.exports = (function() {

    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    var ActionSchema = new Schema({
        userEmail: {
            type: String,
            required: true
        }
    }, { timestamps: true });

    var _model = mongoose.model('Action', ActionSchema);

    return {
        Action: _model
    };
})();