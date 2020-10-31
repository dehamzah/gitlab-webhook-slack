const isIgnoredGitlabUsername = require("../../helpers/isIgnoredGitlabUsername");
const slackApiClient = require("../../helpers/slackApiClient");
const constructSlackGitlabDiscussion = require("../../utils/constructSlackGitlabDiscussion");

module.exports = async (req, res) => {
  const { body, headers } = req;

  if (
    headers["x-gitlab-token"] &&
    headers["x-gitlab-token"] !== process.env.GITLAB_WEBHOOK_TOKEN
  ) {
    throw new Error("Webhook source not verified");
  }

  if (!body) {
    return res.send("Send body payload to this endpoint using post request");
  }

  console.log("body", JSON.stringify(req.body));

  if (body && body.event_type !== "note") {
    throw new Error("Not a note webhook");
  }

  if (isIgnoredGitlabUsername(body.user.username)) {
    return res.send("Payload is from ignored gitlab username. Skipping it...");
  }

  const message = await constructSlackGitlabDiscussion(body);
  const response = slackApiClient.sendMessage({ message });

  res.send(response);
};
