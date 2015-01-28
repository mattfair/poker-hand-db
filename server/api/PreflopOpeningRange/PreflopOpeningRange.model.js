'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PreflopOpeningRangeSchema = new Schema({
  position: String,
  range: String,
  game: String,
  active: Boolean
});

module.exports = mongoose.model('PreflopOpeningRange', PreflopOpeningRangeSchema);