var express = require('express');
var router = express.Router();

var oauth = require('oauth');
var config = require('config-heroku');

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
  var clients = findClientsSocket(io);

  res.send({ current_connections: clients, requests: tradeking.requestCount });
});

function findClientsSocket(io, roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          var index = ns.connected[id].rooms.indexOf(roomId) ;
          if(index !== -1) {
            res.push(ns.connected[id].id);
          }
        } else {
          res.push(ns.connected[id].id);
        }
      }
    }
    return res;
}

module.exports = router;
