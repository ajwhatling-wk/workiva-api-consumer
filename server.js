let express = require('express'),
  bodyParser = require('body-parser'),
  serverApp = express(),
  logger = require('./server/utils/logger'),
  sendToWorkivaRoute = require('./server/sendToWorkivaRoute');

const port = 8145;

serverApp.use(bodyParser.json());

serverApp.post(sendToWorkivaRoute.route, sendToWorkivaRoute.handler);

serverApp.listen(port, () => {
  logger.log(`Server started on port ${port}.`);
});
