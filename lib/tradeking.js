var oauth = require('oauth');
var config = require('config-heroku');

function Tradeking() {
  if (!(this instanceof Tradeking)) return new Tradeking();

  this.consumer_key = config.tradeking.consumer_key;
  this.consumer_secret = config.tradeking.consumer_secret;
  this.access_token = config.tradeking.access_token;
  this.access_secret = config.tradeking.access_secret;
  this.streamUrl = "https://stream.tradeking.com/v1/market/quotes.json?symbols=";
}

Tradeking.prototype.authenticate = function() {
  this.oa = new oauth.OAuth(null, null, this.consumer_key, this.consumer_secret, "1.0", null, "HMAC-SHA1");
  return this;
}

Tradeking.prototype.stream = function(io) {
  var symbols = "AAPL,MMM,ACN,ALLE,APH,AVY,BA,CAT,CHRW,CTAS,GLW,CSX,CMI,DHR,ADBE,AKAM,ADS,ALTR,AME,ADI,AMAT"
  var url = this.streamUrl + symbols;

  var request = this.oa.get(url, this.access_token, this.access_secret);

  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      try {
        var jsonBody = JSON.parse(data);
        if (jsonBody.trade) {
          io.sockets.emit('trade', { trade: jsonBody.trade })
          console.log("trade", jsonBody.trade);
        } else {
          console.log("quote trade");
        }
      }
      catch(err) {
        console.log(data);
      }

    })
  });
  request.end();
}

module.exports = Tradeking;
