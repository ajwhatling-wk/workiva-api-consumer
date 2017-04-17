let request = require('request-promise-native');

function doExportToWorkiva(params) {
  /*let data = params.dataToSave,
    req = {
      url: params.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.authToken}`
      },
      body: JSON.stringify({values: data})
    };

  return request.put(req);*/

  let createUrl = `${params.apiUrl}/spreadsheets`;
  request.post({ url: createUrl });
}

module.exports = {
  exportData: doExportToWorkiva
};
