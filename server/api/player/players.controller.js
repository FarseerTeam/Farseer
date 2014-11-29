/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /players              ->  index
 * POST    /players              ->  create
 * GET     /players/:id          ->  show
 * PUT     /players/:id          ->  update
 * DELETE  /players/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var players = require("../../components/players")
// Get list of players
exports.index = function(req, res) {
  players.model.find({}, function(err, doc){
     res.json( doc );
  });
};