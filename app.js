const { postMenu } = require("./slack");

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
