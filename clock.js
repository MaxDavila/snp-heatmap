var CronJob = require('cron').CronJob;
var snpUtil = require('./snp-util');

new CronJob({
  cronTime: '00 01 16 * * 1-5',
  onTick: function() {
    snpUtil.performSnpUpdate();
  },
  start: true,
  timeZone: "America/New_York"
});
