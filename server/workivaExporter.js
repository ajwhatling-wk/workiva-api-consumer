let request = require('request-promise-native');

function buildPostParameters(exportParams, authToken) {
  return {
    url: `${exportParams.apiUrl}/spreadsheets`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };
}

function doExportToWorkiva(params) {
  let postParams = buildPostParameters(params);

  request
    .post(postParams)
    .then(() => request.post());
}

module.exports = {
  exportData: doExportToWorkiva
};
