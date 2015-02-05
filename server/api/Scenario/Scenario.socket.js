/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Scenario = require('./Scenario.model');

exports.register = function(socket) {
  Scenario.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Scenario.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('Scenario:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Scenario:remove', doc);
}