'use strict';

var _ = require('lodash');
var Scenario = require('./Scenario.model');

// Get list of Scenarios
exports.index = function(req, res) {
  Scenario.find(function (err, Scenarios) {
    if(err) { return handleError(res, err); }
    return res.json(200, Scenarios);
  });
};

// Get a single Scenario
exports.show = function(req, res) {
  Scenario.findById(req.params.id, function (err, Scenario) {
    if(err) { return handleError(res, err); }
    if(!Scenario) { return res.send(404); }
    return res.json(Scenario);
  });
};

// Creates a new Scenario in the DB.
exports.create = function(req, res) {
  Scenario.create(req.body, function(err, Scenario) {
    if(err) { return handleError(res, err); }
    return res.json(201, Scenario);
  });
};

// Updates an existing Scenario in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Scenario.findById(req.params.id, function (err, Scenario) {
    if (err) { return handleError(res, err); }
    if(!Scenario) { return res.send(404); }
    var updated = _.merge(Scenario, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, Scenario);
    });
  });
};

// Deletes a Scenario from the DB.
exports.destroy = function(req, res) {
  Scenario.findById(req.params.id, function (err, Scenario) {
    if(err) { return handleError(res, err); }
    if(!Scenario) { return res.send(404); }
    Scenario.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}