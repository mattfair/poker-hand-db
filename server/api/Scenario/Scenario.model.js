'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScenarioSchema = new Schema({
  parent: String,
  game: String,
  hero_seat: String,
  villain_seat: String,
  actiontohero: String,
  board: String,
  valueBet: String,
  bluffBet: String,
  call: String,
  notes: String
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
