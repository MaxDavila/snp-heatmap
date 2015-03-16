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
  this.marketQuoteUrl = "https://api.tradeking.com/v1/market/ext/quotes.json?symbols=";
  this.streamingRequestCount = 0;
  this.maxRequests = 2;
}

Tradeking.prototype.authenticate = function() {
  this.oa = new oauth.OAuth(null, null, this.consumer_key, this.consumer_secret, "1.0", null, "HMAC-SHA1");
  return this;
}

Tradeking.prototype.stream = function(io) {
  var allSymbols = this.sliceSymbols();

  if (this.streamingRequestCount < this.maxRequests) {
    this.buildStreamingRequest(allSymbols[0], io)
    this.buildStreamingRequest(allSymbols[1], io)
  }
}

Tradeking.prototype.getSingleMarketQuote = function(symbols) {
  var url = this.marketQuoteUrl + symbols;
  this.oa.get(url, this.access_token, this.access_secret, function(error, data, response) {
    if (error) {
      throw(err);
    }
    else {
      var data = JSON.parse(data);
      return data;
    }
  });
}

Tradeking.prototype.getSnpQuotes = function(callback) {
  var allSymbols = this.sliceSymbols();
  var url = this.marketQuoteUrl + allSymbols[0] + allSymbols[1];
  var results;
  this.oa.get(url, this.access_token, this.access_secret, function(error, data, response) {
    if (error) {
      callback(err, null);
    }
    else {
      var data = JSON.parse(data);
      results = data.response.quotes.quote;
      callback(null, results);
    }
  });
}

Tradeking.prototype.buildStreamingRequest = function(symbols, io) {
  var url = this.streamUrl + symbols;
  var request = this.oa.get(url, this.access_token, this.access_secret);
  this.streamingRequestCount++;

  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      try {
        var jsonBody = JSON.parse(data);
        if (jsonBody.trade) {
          io.sockets.emit('trade', { trade: jsonBody.trade })
          // console.log("trade", jsonBody.trade);
        } else {
          // console.log("quote trade");
        }
      }
      catch(err) {
        // console.log("error:", data);
      }

    })
  });
  request.end();
}

Tradeking.prototype.sliceSymbols = function() {
  var chunk1 = symbols.symbols.slice(0, 250).join(',');
  var chunk2 = symbols.symbols.slice(250, symbols.symbols.length).join(',');
  return [ chunk1, chunk2 ];
}

module.exports = Tradeking;
