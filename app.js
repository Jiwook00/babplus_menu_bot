const schedule = require("node-schedule-tz");
const { postMenu } = require("./slack");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = 1;
rule.minute = 30;

// schedule.scheduleJob(rule, () => {
//   postMenu();
// });

module.exports.handler = async (event, context, callback) => {
  await postMenu();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok",
      input: event,
    }),
  };
  callback(null, response);
};
