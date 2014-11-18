var express = require('express');
var router = express.Router();

var oauth = require('oauth');
var config = require('config-heroku');



var oa = new oauth.OAuth(null, null, config.tradeking.consumer_key, config.tradeking.consumer_secret, "1.0", null, "HMAC-SHA1");

var request = oa.get("https://stream.tradeking.com/v1/market/quotes.json?symbols=AAPL,MMM,ACN,ALLE,APH,AVY,BA,CAT,CHRW,CTAS,GLW,CSX,CMI,DHR,ADBE,AKAM,ADS,ALTR,AME,ADI,AMAT",
              config.tradeking.access_token, 
              config.tradeking.access_secret);
/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io');

  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      try {
        var jsonBody = JSON.parse(data);
        if (jsonBody.trade) {
          io.sockets.emit('trade', { trade: jsonBody.trade })
          console.log("trade", jsonBody.trade);
        } else {
          console.log("quote trade")
        }
      }
      catch(err) {
        console.log(data)
      }

    })
  });
  request.end();
  res.render('index', { title: 'Express' });
});

router.post('/check', function(req, res) {
  var io = req.app.get('io');

  io.sockets.emit('trade', { trade: req.body.trade })
  res.end()
})
module.exports = router;
