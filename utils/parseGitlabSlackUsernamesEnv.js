// example input: "kuro_gitlab:kuro,shiro_id:shiro"
module.exports = (input) => {
  const usernames = input.split(",");
  const usernamesMap = {};
  usernames.forEach((item) => {
    const [usernameGitlab, usernameSlack] = item.split(":");
    usernamesMap[usernameGitlab] = usernameSlack;
  });
  return usernamesMap;
};
