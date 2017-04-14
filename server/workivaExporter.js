let request = require('request');

function doExportToWorkiva(apiUrl, dataString, authToken) {
  request.put({
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({values: dataString})
  });
}

module.exports = {
  exportData: doExportToWorkiva
};
