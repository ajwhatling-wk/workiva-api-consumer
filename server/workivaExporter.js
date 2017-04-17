let request = require('request-promise-native'),
  logger = require('./utils/logger'),
  promiseBuilder = require('./utils/promiseBuilder');

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

  return promiseBuilder.create((resolve, reject) => {
    logger.log(`Creating spreadsheet`);
    request
      .post(postParams)
      .then(response => {
        let json = JSON.parse(response),
          sheetsParams = buildSheetsCreationParams(params, json);

        spreadsheetId = json.data.id;

        logger.log(`Creating sheet inside of spreadsheet ${spreadsheetId}`);

        return request.post(sheetsParams)
      })
      .then(response => {
        let json = JSON.parse(response);
        sheetId = json.data.id;
        let sheetUpdateParams = buildSheetUpdateParams(params, spreadsheetId, sheetId);

        logger.log(`Inserting data into sheet ${sheetId} of spreadsheet ${spreadsheetId}`);

        return request.put(sheetUpdateParams);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  exportData: doExportToWorkiva
};
