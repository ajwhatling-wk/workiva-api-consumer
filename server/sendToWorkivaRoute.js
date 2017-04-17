let workivaExporter = require('./workivaExporter');

module.exports = {
  route: '/sendToWorkiva',
  handler: (req, res) => {
    workivaExporter
      .exportData({
        apiUrl: process.env.WORKIVA_API_URL,
        authToken: process.env.WORKIVA_AUTH_TOKEN,
        dataToSave: req.body
      })
      .then(() => {
        res.send('');
      })
      .catch(() => {
        res.status(400);
        res.send('failed');
      });
  }
};
