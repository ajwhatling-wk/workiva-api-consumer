let logger = require('./utils/logger'),
  workivaExporter = require('./workivaExporter'),
  githubImporter = require('./githubImporter');

module.exports = {
  route: '/sendToWorkiva',
  handler: (req, res) => {
    logger.log('About to do export to Workiva');
    
    githubImporter
      .importGithubIssues(req.body.github_owner, req.body.github_repo)
      .then(data => {
        logger.log('Import from github succeeded');
        workivaExporter
          .exportData({
            apiUrl: process.env.WORKIVA_API_URL,
            authToken: process.env.WORKIVA_AUTH_TOKEN,
            dataToSave: data
          })
          .then(() => {
            logger.log('Export to workiva succeeded');
            res.send('');
          })
          .catch(reason => {
            logger.log(`Export to workiva failed: ${reason}`);
            res.status(400);
            res.send(reason);
          });
      })
      .catch(err => {
        logger.log(`Import from github failed: ${err}`);
        res.status(400);
        res.send(err);
      });
  }
};
