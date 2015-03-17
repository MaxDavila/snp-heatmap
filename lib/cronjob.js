var tradeking = require('./tradeking')().authenticate();
var CronJob = require('cron').CronJob;
var fs = require('fs');
var snpUtil = require('./snp-util');

var cronjob = {
  initialize: function() {
    var self = this;
    var job = new CronJob({
      cronTime: '00 01 16 * * 0-6',
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
        snpUtil.writeTofile('./data/snp500.json', results);
        snpUtil.updateCompanies();
      }       
    });
  }
}

module.exports = cronjob;
