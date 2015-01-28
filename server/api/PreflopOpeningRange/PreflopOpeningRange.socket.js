/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var PreflopOpeningRange = require('./PreflopOpeningRange.model');

exports.register = function(socket) {
  PreflopOpeningRange.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  PreflopOpeningRange.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('PreflopOpeningRange:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('PreflopOpeningRange:remove', doc);
}