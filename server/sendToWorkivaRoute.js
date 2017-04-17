let workivaExporter = require('./workivaExporter');

module.exports = {
  route: '/sendToWorkiva',
  handler: (req, res) => {
    workivaExporter
      .exportData({})
      .then(() => {
        res.send('');
      })
      .catch(() => {
        res.status(400);
        res.send('failed');
      });
  }
};
