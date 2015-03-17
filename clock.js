var CronJob = require('cron').CronJob;
var snpUtil = require('./snp-util');

new CronJob({
  cronTime: '00 51 04 * * 1-5',
  onTick: function() {
    snpUtil.performSnpUpdate();
  },
  start: true,
  timeZone: "America/New_York"
});
