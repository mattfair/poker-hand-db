'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScenarioSchema = new Schema({
  parent: Schema.Types.ObjectId,
  game: String,
  hero_seat: String,
  hero_range: String,
  villain_seat: String,
  villain_range: String,
  defendRate: Number,
  actiontohero: String,
  board: String,
  valueBet: String,
  bluffBet: String,
  call: String,
  notes: String,
  short_summary: String
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
