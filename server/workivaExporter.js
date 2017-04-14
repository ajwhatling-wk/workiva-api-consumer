let request = require('request-promise-native');

function doExportToWorkiva(apiUrl, dataString, authToken) {
  return request.put({
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
