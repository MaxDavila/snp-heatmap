var oauth = require('oauth');
var config = require('config-heroku');

var symbols = require("../data/symbols.json")

function Tradeking() {
  if (!(this instanceof Tradeking)) return new Tradeking();

  this.consumer_key = config.tradeking.consumer_key;
  this.consumer_secret = config.tradeking.consumer_secret;
  this.access_token = config.tradeking.access_token;
  this.access_secret = config.tradeking.access_secret;
  this.streamUrl = "https://stream.tradeking.com/v1/market/quotes.json?symbols=";
  this.requestCount = 0;
}

Tradeking.prototype.authenticate = function() {
  this.oa = new oauth.OAuth(null, null, this.consumer_key, this.consumer_secret, "1.0", null, "HMAC-SHA1");
  return this;
}

Tradeking.prototype.stream = function(io) {
  var symbols1 = symbols.symbols.slice(0, 250).join(',');
  var symbols2 = symbols.symbols.slice(250, symbols.symbols.length).join(',');

  this.buildRequest(symbols1, io)
  this.buildRequest(symbols2, io)
}

Tradeking.prototype.buildRequest = function(symbols, io) {
  var url = this.streamUrl + symbols;
  var request = this.oa.get(url, this.access_token, this.access_secret);
  this.requestCount++;

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
        console.log("error:", data);
      }

    })
  });
  request.end();
}

module.exports = Tradeking;
