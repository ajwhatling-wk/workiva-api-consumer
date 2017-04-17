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
    fakePutPromise,

    firstPostResponse;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();

    fakePostPromise = {};
    fakePostPromise.then = sandbox.stub().returns(fakePostPromise);

    fakePutPromise = {then: sandbox.stub()};

    sandbox.stub(request, 'post').returns(fakePostPromise);
    sandbox.stub(request, 'put').returns(fakePutPromise);

    firstPostResponse = {
      data: {
        id: 'i-dont-care'
      }
    };

    apiUrl = 'www.example.com';
    dataToSave = '[["row 1", "row 1", "row 1"], ["row 2", "row 2", "row 2"]]';
    authToken = 'some-auth-token';

    exporterParams = {
      apiUrl: apiUrl,
      authToken: authToken
    };
  });

  afterEach('tear down', () => {
    sandbox.restore();
  });

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
    thenExecutor(JSON.stringify(firstPostResponse));

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWithExactly(request.post, {
      url: `${exporterParams.apiUrl}/spreadsheets/${firstPostResponse.data.id}/sheets`,
      headers: {
        'Authorization': `Bearer ${exporterParams.authToken}`
      }
    });
  });

  it('should return the promise from the second POST call', () => {
    exportData(exporterParams);

    let thenExecutor = fakePostPromise.then.getCall(0).args[0],
        postPromise = thenExecutor(JSON.stringify(firstPostResponse));

    expect(postPromise).to.equal(fakePostPromise);
  });

  it('should make a PUT after the second POST call', () => {
    exportData(exporterParams);

    let thenExecutor = fakePostPromise.then.getCall(1).args[0],
        putPromise = thenExecutor();

    expect(putPromise).to.equal(fakePutPromise);
  })
});
