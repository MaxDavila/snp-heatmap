var tradeking = require('./tradeking')().authenticate();
var CronJob = require('cron').CronJob;
var fs = require('fs');
var parser = require('./parser');

var cronjob = {
  initialize: function() {
    var self = this;
    var job = new CronJob({
      cronTime: '00 39 04 * * 0-6',
      onTick: function() {
        self.performSnpUpdate();
      },
      start: true,
      timeZone: "America/New_York"
    });
  },
  performSnpUpdate: function() {
    console.log("cronjob started")
    var self = this;
    tradeking.getSnpQuotes(function(err, results) {
      if (err) {
        console.log("There was an error processing the request");
      }
      else {
        parser.writeTofile('./data/snp500.json', results);
        parser.updateCompanies();
      }       
    });
  }
}

module.exports = cronjob;
