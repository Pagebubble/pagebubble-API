/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
if (config.env !== 'production') {
  var server = require('http').createServer(app);
}
else {
  var server = require('https').createServer({ key: fs.readFileSync('../pagebubble.key', 'utf8'), cert: fs.readFileSync('../pagebubble_com.crt', 'utf8'), passphrase: fs.readFileSync('../passphrase', 'utf8') }, app);
}
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.env !== 'production' ? config.port : 443, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.env !== 'production' ? config.port : 443, app.get('env'));
});

if (config.env === 'production') {
  require('http')
    .createServer(function (req, res) {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    })
    .listen(config.port, config.ip);
}

// Expose app
exports = module.exports = app;
