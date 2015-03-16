var express = require('express');
var router = express.Router();

var oauth = require('oauth');
var SocketHelper = require('../lib/socket_helper');

router.get('/', function(req, res) {
  var io = req.app.get('io');
  var tradeking = req.app.get('tradeking');

  // if market is open
  tradeking.stream(io);

  // else render map with json from previous market close

  res.render('index', { title: 'Express' });
});

router.get('/parse', function(req, res) {
  var tradeking = req.app.get('tradeking');
  tradeking.getSnpQuotes(function(err, results) {
    if (err) {
      res.send({ results: "There was an error processing your request" });
    }
    else {
      res.send({ results: results });
    }
  });
})

router.get('/health_check', function(req, res) {
  var io = req.app.get('io');
  var tradeking = req.app.get('tradeking');
  var clients = SocketHelper.findClients(io);

  res.send({ current_connections: clients, requests: tradeking.streamingRequestCount });
});

module.exports = router;
