var snpCompanies = require('./data/snp500.json');
var Snp500 = require('./lib/snp500');
var fs = require('fs');
var tradeking = require('./lib/tradeking')().authenticate();

var snpUtil = {
  performSnpUpdate: function() {
    console.log("cronjob started")
    var self = this;
    tradeking.getSnpQuotes(function(err, results) {
      if (err) {
        console.log("There was an error processing the request");
      }
      else {
        self.writeTofile('./data/snp500.json', results);
        self.updateCompanies();
      }       
    });
  },
  updateCompanies: function() {
    var snp500 = new Snp500(snpCompanies)
    this.writeTofile("./data/new-snp-data.json", snp500);
  },
  writeTofile: function(filepath, content) {
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log("Writing to " + filepath + " succeeded");
  },
}

module.exports = snpUtil

