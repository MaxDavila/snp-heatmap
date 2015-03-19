var CronJob = require('cron').CronJob;
var snpUtil = require('./snp-util');
var request = require('request');

var cronjob = {
  initialize: function() {
    var self = this;
    new CronJob({
      cronTime: '00 06 00 * * 1-5',
      onTick: function() {
        snpUtil.performSnpUpdate();
      },
      start: true,
      timeZone: "America/New_York"
    });
    new CronJob({
      cronTime: '0 */5 * * * *',
      onTick: function() {
        request.get('https://snp.herokuapp.com/')
      },
      start: true,
      timeZone: "America/New_York"
    });
  }
}


module.exports = cronjob;
