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
        workivaExporter
          .exportData({
            apiUrl: process.env.WORKIVA_API_URL,
            authToken: process.env.WORKIVA_AUTH_TOKEN,
            dataToSave: data
          })
          .then(() => {
            logger.log('Export succeeded');
            res.send('');
          })
          .catch(() => {
            logger.log('Export failed');
            res.status(400);
            res.send('failed');
          });
      })
      .catch(err => {
        res.status(400);
        res.send(err);
      });
  }
};
