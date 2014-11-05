var express = require('express');
var router = express.Router();

var oauth = require('oauth');
var config = require('config-heroku');



var oa = new oauth.OAuth(null, null, config.tradeking.consumer_key, config.tradeking.consumer_secret, "1.0", null, "HMAC-SHA1");

var request = oa.get("https://stream.tradeking.com/v1/market/quotes.json?symbols=AAPL", 
              config.tradeking.access_token, 
              config.tradeking.access_secret);

/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io');

  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      var jsonBody = JSON.parse(data);

        if (jsonBody.trade) {
          io.sockets.emit('trade', { trade: jsonBody.trade })
          console.log(jsonBody.trade);
        } else {
          console.log("quote trade")
        }
    })
  });
  request.end();
  res.render('index', { title: 'Express' });
});

module.exports = router;
