/**
 * server.js
 * Created by dcorns on 5/28/15.
 */
'use strict';
var express = require('express');
//var debug = require('debug')('NodeExpress:server');
var app = express();
var http = require('http');

var port = 3000;
app.set('port', process.env.PORT || port);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.status(200).res.sendFile('index.html');
});

app.get('*', function(req, res){
  res.status(400);
  res.sendFile(__dirname + '/public/404.html');
});

var server = http.createServer(app);

server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
 // var bind = typeof addr === 'string'
 //   ? 'pipe ' + addr
 //   : 'port ' + addr.port;
 // debug('Listening on ' + bind);
}

