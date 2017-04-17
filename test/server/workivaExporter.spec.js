let sinon = require('sinon'),
  expect = require('chai').expect,
  request = require('request-promise-native'),

  workivaExporter = require('../../server/workivaExporter');


describe('Workiva Exporter Test', () => {
  let sandbox,

    apiUrl,
    dataToSave,
    authToken,

    exporterParams,

    fakePromise;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();

    fakePromise = {foo: 'bar'};
    sandbox.stub(request, 'put').returns(fakePromise);

    apiUrl = 'www.example.com';
    dataToSave = '[["row 1", "row 1", "row 1"], ["row 2", "row 2", "row 2"]]';
    authToken = 'some-auth-token';

    exporterParams = {
      apiUrl: apiUrl,
      authToken: authToken,
      dataToSave: dataToSave
    };
  });

  afterEach('tear down', () => {
    sandbox.restore();
  });

  it('should hit the api url in the parameter object with the auth token', () => {
    let expectedPayload = JSON.stringify({values: dataToSave});

    workivaExporter.exportData(exporterParams);

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

  it('should return the promise from the call to request.put', () => {
    let promise = workivaExporter.exportData(exporterParams);

    expect(promise).to.equal(fakePromise);
  });

});
