const gitlabApiClient = require("../helpers/gitlabApiClient");
const parseGitlabSlackUsernamesEnv = require("../utils/parseGitlabSlackUsernamesEnv");
const formatToSlackUsername = require("../utils/formatToSlackUsername");

module.exports = async (payload) => {
  const gitlabSlackUserMap = parseGitlabSlackUsernamesEnv(
    process.env.GITLAB_SLACK_USERNAMES_MAP
  );

  const slackUsers = new Set();

  const projectName = payload.project.name;
  const projectUrl = payload.project.web_url;
  const comment = payload.object_attributes.note;
  const replyUrl = payload.object_attributes.url;
  const commenterName = payload.user.name;
  const mergeRequestTitle =
    payload.merge_request && payload.merge_request.title;
  const mergeRequestUrl = payload.merge_request && payload.merge_request.url;
  const issueTitle = payload.issue && payload.issue.title;
  const issueUrl = payload.issue && payload.issue.url;
  const commentScopeType = payload.merge_request
    ? " merge request "
    : payload.issue
    ? " issue "
    : " ";
  const commentScopeTitle = mergeRequestTitle || issueTitle;
  const commentScopeUrl = mergeRequestUrl || issueUrl;

  // get author username
  let authorId;
  if (payload.merge_request && payload.merge_request.author_id) {
    authorId = payload.merge_request.author_id;
  } else if (payload.issue && payload.issue.author_id) {
    authorId = payload.issue.author_id;
  }

  if (authorId) {
    const authorUsername = await gitlabApiClient.getUsernameById(authorId);
    slackUsers.add(gitlabSlackUserMap[authorUsername]);
  }

  // get mentioned username
  Object.keys(gitlabSlackUserMap).forEach((gitlabUserName) => {
    const hasUserMentioned = comment.includes(gitlabUserName);
    if (hasUserMentioned) {
      slackUsers.add(gitlabSlackUserMap[gitlabUserName]);
    }
  });

  const slackUsersArray = formatToSlackUsername(Array.from(slackUsers));
  const slackUsersFlat = slackUsersArray.join(" ");

  const slackPostPayload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Kon'nichiwa ${slackUsersFlat} :wave: \n ${commenterName} has a comment for you in${commentScopeType}<${commentScopeUrl}|${commentScopeTitle}> (<${projectUrl}|${projectName}>):`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `>${comment}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            style: "primary",
            text: {
              type: "plain_text",
              text: "Click to Reply",
              emoji: false,
            },
            url: replyUrl,
          },
        ],
      },
    ],
  };

  return slackPostPayload;
};
