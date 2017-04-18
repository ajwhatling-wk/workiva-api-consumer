let promiseBuilder = require('./utils/promiseBuilder'),
  logger = require('./utils/logger'),
  request = require('request-promise-native');

function importGithubIssues(owner, repo) {
  const CID = process.env.GH_CLIENT_ID,
    CSECRET = process.env.GH_CLIENT_SECRET;

  let getParams = {
    url: `https://api.github.com/repos/${owner}/${repo}/issues?status=open&page=1&per_page=25&client_id=${CID}&client_secret=${CSECRET}`,
    headers: {
      'User-Agent': 'workiva-api-consumer'
    }
  };

  return promiseBuilder.create((resolve, reject) => {
    request.get(getParams)
      .then(response => {
        let issuesJsonResponse = JSON.parse(response);
        let issues = [];

        logger.log(`Github payload size: ${response.length / 1024} Kb`);

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
