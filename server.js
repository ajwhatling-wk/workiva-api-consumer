let express = require('express'),
  serverApp = express(),
  logger = require('./server/utils/logger'),
  sendToWorkivaRoute = require('./server/sendToWorkivaRoute');

const port = 8145;

serverApp.get(sendToWorkivaRoute.route, sendToWorkivaRoute.handler);

serverApp.listen(port, () => {
  logger.log(`Server started on port ${port}.`);
});
