let request = require('request-promise-native');

function buildSpreadsheetsCreationParams(exportParams) {
  return {
    url: `${exportParams.apiUrl}/spreadsheets`,
    headers: {
      'Authorization': `Bearer ${exportParams.authToken}`
    }
  };
}

function buildSheetsCreationParams(params, json) {
  return {
    url: `${params.apiUrl}/spreadsheets/${json.data.id}/sheets`,
    headers: {
      'Authorization': `Bearer ${params.authToken}`
    }
  };
}

function doExportToWorkiva(params) {
  let postParams = buildSpreadsheetsCreationParams(params);

  request
    .post(postParams)
    .then(response => {
      let json = JSON.parse(response),
        sheetsParams = buildSheetsCreationParams(params, json);

      return request.post(sheetsParams)
    })
    .then(() => request.put());
}

module.exports = {
  exportData: doExportToWorkiva
};
