let promiseBuilder = require('./utils/promiseBuilder'),
  request = require('request-promise-native');

function importGithubIssues(owner, repo) {
  let url = `https://api.github.com/repos/${owner}/${repo}/issues?status=open`;

  return promiseBuilder.create((resolve, reject) => {
    request.get(url);
  });
}

module.exports = {
  importGithubIssues
};
