let request = require('request-promise-native');

function importGithubIssues(owner, repo) {
  let url = `https://api.github.com/repos/${owner}/${repo}/issues?status=open`;
  request.get(url);
}

module.exports = {
  importGithubIssues
};
