var express = require('express');
var router = express.Router();

var oauth = require('oauth');
var config = require('config-heroku');
var SocketHelper = require('../lib/socket_helper');

router.get('/', function(req, res) {
  var io = req.app.get('io');
  var tradeking = req.app.get('tradeking');

  tradeking.stream(io)

  res.render('index', { title: 'Express' });
});

router.post('/check', function(req, res) {
  var io = req.app.get('io');

  io.sockets.emit('trade', { trade: req.body.trade })
  res.end()
})

router.get('/health_check', function(req, res) {
  var io = req.app.get('io');
  var tradeking = req.app.get('tradeking');
  var clients = SocketHelper.findClients(io);

  res.send({ current_connections: clients, requests: tradeking.requestCount });
});

module.exports = router;
