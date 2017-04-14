let sinon = require('sinon'),
  expect = require('chai').expect,
  request = require('request'),

  workivaExporter = require('../../server/workivaExporter');


describe('Workiva Exporter Test', () => {
  let sandbox,

    apiUrl,
    dataToSave,
    authToken;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(request, 'put');

    apiUrl = 'www.example.com';
    dataToSave = '[["row 1", "row 1", "row 1"], ["row 2", "row 2", "row 2"]]';
    authToken = 'some-auth-token';
  });

  afterEach('tear down', () => {
    sandbox.reset();
  });

  it('should hit api.app.wdesk.com with the auth token', () => {
    let expectedPayload = JSON.stringify({values: dataToSave});

    workivaExporter.exportData(apiUrl, dataToSave, authToken);

    sinon.assert.calledOnce(request.put);
    sinon.assert.calledWithExactly(request.put, {
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: expectedPayload
    });
  });

});
