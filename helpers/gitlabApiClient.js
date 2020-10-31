const axios = require("axios");

exports.getUsernameById = async (userId) => {
  const response = await axios.get(
    process.env.GITLAB_API_BASE_URL +
      userId +
      "?private_token" +
      process.env.GITLAB_PA_TOKEN
  );
  return response.data.username;
};
