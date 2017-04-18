let promiseBuilder = require('./utils/promiseBuilder'),
  request = require('request-promise-native');

function importGithubIssues(owner, repo) {
  let url = `https://api.github.com/repos/${owner}/${repo}/issues?status=open`;

  return promiseBuilder.create((resolve, reject) => {

    request.get(url)
      .then(response => {
        let issuesJsonResponse = JSON.parse(response);
        let issues = [];

        for (let issueJson of issuesJsonResponse) {
          issues.push([issueJson.title, issueJson.user.login]);
        }

        resolve(issues);
      })
      .catch(reason => reject(reason.message));

  });
}

module.exports = {
  importGithubIssues
};
