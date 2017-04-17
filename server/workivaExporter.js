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

function buildSheetUpdateParams(params, spreadsheetId, sheetId) {
  return {
    url: `${params.apiUrl}/spreadsheets/${spreadsheetId}/sheets/${sheetId}/data`,
    headers: {
      'Authorization': `Bearer ${params.authToken}`
    },
    body: {
      'values': params.dataToSave
    }
  };
}

function doExportToWorkiva(params) {
  let postParams = buildSpreadsheetsCreationParams(params),
    spreadsheetId = '',
    sheetId = '';

  request
    .post(postParams)
    .then(response => {
      let json = JSON.parse(response),
        sheetsParams = buildSheetsCreationParams(params, json);

      spreadsheetId = json.data.id;

      return request.post(sheetsParams)
    })
    .then(response => {
      let json = JSON.parse(response);
      sheetId = json.data.id;
      let sheetUpdateParams = buildSheetUpdateParams(params, spreadsheetId, sheetId);

      return request.put(sheetUpdateParams);
    });
}

module.exports = {
  exportData: doExportToWorkiva
};
