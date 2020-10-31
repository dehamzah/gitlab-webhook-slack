module.exports = (username) => {
  const ignoredUsernamesString = process.env.IGNORED_GITLAB_USERNAMES || "";
  const ignoredUsernames = ignoredUsernamesString.split(",");

  return ignoredUsernames.includes(username);
};
