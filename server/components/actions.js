module.exports = (function() {
    var mongoose = require('mongoose');
    var RSVP = require('rsvp');
    var worlds = require('./worlds');

    var Schema = mongoose.Schema;

    var ActionSchema = new Schema({
        userEmail: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }, { timestamps: true });

    var Action = mongoose.model('Action', ActionSchema);

    var saveCreatePlayer = function(userEmail, worldId, playerName, playerEmail) {
        return findWorldName(worldId).then(function(worldName) {
            var promise = new RSVP.Promise(function(resolve, reject) {
                var action = new Action({
                    userEmail: userEmail,
                    description: 'created player ' + playerName + ' (' + playerEmail + ') in ' + worldName
                });
                action.save(function(error) {
                    if (error) reject(error);
                });
                resolve(action);
            }, function(error) {
                return new RSVP.Promise(function(resolve, reject) {
                    reject(error);
                });
            });

            return promise;
        });
    };

    var findWorldName = function(worldId) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            worlds.World.findOne({ id: worldId }, function(error, world) {
                if (error) reject(error);
                else if (world) {
                    resolve(world.name);
                } else {
                    resolve('');
                }
            });
        });

        return promise;
    };

    return {
        Action: Action,
        saveCreatePlayer: saveCreatePlayer
    };
})();