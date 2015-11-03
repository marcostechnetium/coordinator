var CronJob = require('cron').CronJob;

new CronJob('*/10 * * * * *', function() {
  console.log(new Date().toString());
}, null, true, 'America/Argentina/Buenos_Aires');
