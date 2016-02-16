'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  name: String,
  data: Schema.Types.Mixed,
  originUrl: String,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Notification', NotificationSchema);