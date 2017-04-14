let express = require('express'),
  serverApp = express();

const port = 8145;

serverApp.get('/', (req, res) => res.send('Hello, world!'));


serverApp.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
