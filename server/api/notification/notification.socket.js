/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var notification = require('./notification.model');

exports.register = function(socket) {
  notification.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  notification.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('notification:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('notification:remove', doc);
}