let logger = require('./utils/logger'),
  workivaExporter = require('./workivaExporter');

module.exports = {
  route: '/sendToWorkiva',
  handler: (req, res) => {
    logger.log('About to do export to Workiva');
    workivaExporter
      .exportData({
        apiUrl: process.env.WORKIVA_API_URL,
        authToken: process.env.WORKIVA_AUTH_TOKEN,
        dataToSave: req.body
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
  }
};
