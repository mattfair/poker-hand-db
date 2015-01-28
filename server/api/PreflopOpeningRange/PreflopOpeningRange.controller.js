'use strict';

var _ = require('lodash');
var PreflopOpeningRange = require('./PreflopOpeningRange.model');

// Get list of PreflopOpeningRanges
exports.index = function(req, res) {
  PreflopOpeningRange.find(function (err, PreflopOpeningRanges) {
    if(err) { return handleError(res, err); }
    return res.json(200, PreflopOpeningRanges);
  });
};

// Get a single PreflopOpeningRange
exports.show = function(req, res) {
  PreflopOpeningRange.findById(req.params.id, function (err, PreflopOpeningRange) {
    if(err) { return handleError(res, err); }
    if(!PreflopOpeningRange) { return res.send(404); }
    return res.json(PreflopOpeningRange);
  });
};

// Creates a new PreflopOpeningRange in the DB.
exports.create = function(req, res) {
  PreflopOpeningRange.create(req.body, function(err, PreflopOpeningRange) {
    if(err) { return handleError(res, err); }
    return res.json(201, PreflopOpeningRange);
  });
};

// Updates an existing PreflopOpeningRange in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  PreflopOpeningRange.findById(req.params.id, function (err, PreflopOpeningRange) {
    if (err) { return handleError(res, err); }
    if(!PreflopOpeningRange) { return res.send(404); }
    var updated = _.merge(PreflopOpeningRange, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, PreflopOpeningRange);
    });
  });
};

// Deletes a PreflopOpeningRange from the DB.
exports.destroy = function(req, res) {
  PreflopOpeningRange.findById(req.params.id, function (err, PreflopOpeningRange) {
    if(err) { return handleError(res, err); }
    if(!PreflopOpeningRange) { return res.send(404); }
    PreflopOpeningRange.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}