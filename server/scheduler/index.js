const CronJob = require("node-cron");
const { createNewMonthlyFundOfClubs } = require('./task')

/**
 ┌────────────── second (optional) 	0-59
 │ ┌──────────── minute             0-59
 │ │ ┌────────── hour               0-23
 │ │ │ ┌──────── day of month       1-31
 │ │ │ │ ┌────── month              1-12 (or names)
 │ │ │ │ │ ┌──── day of week        0-7 (or names, 0 or 7 are sunday)
 │ │ │ │ │ │
 * * * * * *
*/
const cronExpression = "* * 1 * *"    // run task every month
exports.initScheduledJobs = async () => {
    const scheduledJobFunction = CronJob.schedule(cronExpression, async () => {
        console.log("I'm executed on a schedule!");
        // Add your custom logic here
        await createNewMonthlyFundOfClubs();
    });

    scheduledJobFunction.start();
}