let sinon = require('sinon'),
  expect = require('chai').expect,
  request = require('request-promise-native'),

  exportData = require('../../server/workivaExporter').exportData;


describe('Workiva Exporter Test', () => {
  let sandbox,

    apiUrl,
    dataToSave,
    authToken,

    exporterParams,

    fakePostPromise,
    fakePutPromise;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();

    fakePostPromise = {then: sandbox.stub()};
    fakePutPromise = {then: sandbox.stub()};

    sandbox.stub(request, 'post').returns(fakePostPromise);
    sandbox.stub(request, 'put').returns(fakePutPromise);

    apiUrl = 'www.example.com';
    dataToSave = '[["row 1", "row 1", "row 1"], ["row 2", "row 2", "row 2"]]';
    authToken = 'some-auth-token';

    exporterParams = {
      apiUrl: apiUrl,
      /*authToken: authToken,
       dataToSave: dataToSave*/
    };
  });

  afterEach('tear down', () => {
    sandbox.restore();
  });

  /*  it.skip('should hit the api url in the parameter object with the auth token', () => {
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
   });*/


  it('should make a POST request to the /spreadsheets end point of the API', () => {
    exportData(exporterParams);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWithExactly(request.post, {
      url: `${exporterParams.apiUrl}/spreadsheets`,
      headers: {
        'Authorization': `Bearer ${exporterParams.authToken}`
      }
    });
  });

  it('should make a second POST call after the POST request succeed', () => {
    exportData(exporterParams);

    request.post.reset();

    let thenExecutor = fakePostPromise.then.getCall(0).args[0];
    thenExecutor();

    sinon.assert.calledOnce(request.post);
  });

  it('should return the promise from the second POST call', () => {
    exportData(exporterParams);

    let thenExecutor = fakePostPromise.then.getCall(0).args[0],
        postPromise = thenExecutor();

    expect(postPromise).to.equal(fakePostPromise);
  });
});
