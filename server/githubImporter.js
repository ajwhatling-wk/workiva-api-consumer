let promiseBuilder = require('./utils/promiseBuilder'),
  request = require('request-promise-native');

function importGithubIssues(owner, repo) {
  let getParams = {
    url: `https://api.github.com/repos/${owner}/${repo}/issues?status=open`,
    headers: {
      'User-Agent': 'workiva-api-consumer'
    }
  };

  return promiseBuilder.create((resolve, reject) => {
    request.get(getParams)
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
