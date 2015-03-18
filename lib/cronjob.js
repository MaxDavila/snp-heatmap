var CronJob = require('cron').CronJob;
var snpUtil = require('./snp-util');

var cronjob = {
  initialize: function() {
    var self = this;
    var job = new CronJob({
      cronTime: '00 29 04 * * 1-5',
      onTick: function() {
        snpUtil.performSnpUpdate();
      },
      start: true,
      timeZone: "America/New_York"
    });
  }
}

module.exports = cronjob;
