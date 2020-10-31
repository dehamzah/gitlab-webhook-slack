const axios = require("axios");

exports.sendMessage = async ({ message }) => {
  const response = await axios.post(
    process.env.SLACK_WEBHOOK_CHANNEL_URL,
    message
  );
  return response.data;
};
