let sinon = require('sinon'),
  expect = require('chai').expect,
  request = require('request-promise-native'),

  logger = require('../../server/utils/logger'),
  clock = require('../../server/utils/clock'),
  promiseBuilder = require('../../server/utils/promiseBuilder'),

  exportData = require('../../server/workivaExporter').exportData;


describe('Workiva Exporter Test', () => {
  let sandbox,

    apiUrl,
    dataToSave,
    authToken,

    exporterParams,

    fakePostPromise,
    fakePutPromise,

    resolveStub,
    rejectStub,

    firstPostResponse,
    secondPostResponse,

    clockTime,

    exportToWorkivaExecutor,
    exportToWorkivaPromise;

  function getPromiseExecutor() {
    return promiseBuilder.create.getCall(0).args[0];
  }

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();

    clockTime = parseInt(Math.random() * 100);

    sandbox.stub(promiseBuilder, 'create').returns('i am a promise');
    sandbox.stub(logger, 'log');
    sandbox.stub(clock, 'getTimeSeconds').returns(clockTime);

    fakePostPromise = {};
    fakePostPromise.then = sandbox.stub().returns(fakePostPromise);
    fakePostPromise.catch = sandbox.stub().returns(fakePostPromise);

    fakePutPromise = {then: sandbox.stub()};

    sandbox.stub(request, 'post').returns(fakePostPromise);
    sandbox.stub(request, 'put').returns(fakePutPromise);

    firstPostResponse = {
      data: {
        id: 'i-dont-care'
      }
    };

    secondPostResponse = {
      data: {
        id: 'sheetId-0000'
      }
    };

    apiUrl = 'www.example.com';
    dataToSave = '[["row 1", "row 1", "row 1"], ["row 2", "row 2", "row 2"]]';
    authToken = 'some-auth-token';

    exporterParams = {
      apiUrl,
      authToken,
      dataToSave
    };

    resolveStub = sandbox.stub();
    rejectStub = sandbox.stub();
  });

  beforeEach('set up - call system under test', () => {
    exportToWorkivaPromise = exportData(exporterParams);
    exportToWorkivaExecutor = getPromiseExecutor();
    exportToWorkivaExecutor(resolveStub, rejectStub);
  });

  afterEach('tear down', () => {
    sandbox.restore();
  });

  it('should create promise from the promise builder and return it', () => {
    sinon.assert.calledOnce(promiseBuilder.create);
    expect(exportToWorkivaPromise).to.equal('i am a promise');
  });

  it('should make a POST request to the /spreadsheets end point of the API', () => {
    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWithExactly(request.post, {
      url: `${exporterParams.apiUrl}/spreadsheets`,
      headers: {
        'Authorization': `Bearer ${exporterParams.authToken}`
      },
      body: JSON.stringify({
        name: `workiva-api-consumer-sheet-${clockTime}`
      })
    });
  });

  it('should make a second POST call after the POST request succeed', () => {
    request.post.reset();

    let thenExecutor = fakePostPromise.then.getCall(0).args[0];
    thenExecutor(JSON.stringify(firstPostResponse));

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWithExactly(request.post, {
      url: `${exporterParams.apiUrl}/spreadsheets/${firstPostResponse.data.id}/sheets`,
      headers: {
        'Authorization': `Bearer ${exporterParams.authToken}`
      },
      body: JSON.stringify({index: 0, name: 'node-js-github-issues'})
    });
  });

  it('should return the promise from the second POST call', () => {
    let thenExecutor = fakePostPromise.then.getCall(0).args[0],
      postPromise = thenExecutor(JSON.stringify(firstPostResponse));

    expect(postPromise).to.equal(fakePostPromise);
  });

  it('should make a PUT after the second POST call', () => {
    let thenExecutor = fakePostPromise.then.getCall(1).args[0],
      putPromise = thenExecutor(JSON.stringify(secondPostResponse));

    expect(putPromise).to.equal(fakePutPromise);
  });

  it('should call PUT with the correct parameters', () => {
    let firstThenExecutor = fakePostPromise.then.getCall(0).args[0],
      secondThenExecutor = fakePostPromise.then.getCall(1).args[0];

    firstThenExecutor(JSON.stringify(firstPostResponse));
    secondThenExecutor(JSON.stringify(secondPostResponse));

    sinon.assert.calledOnce(request.put);
    sinon.assert.calledWithExactly(request.put, {
      url: `${exporterParams.apiUrl}/spreadsheets/${firstPostResponse.data.id}/sheets/${secondPostResponse.data.id}/data`,
      headers: {
        'Authorization': `Bearer ${exporterParams.authToken}`
      },
      body: JSON.stringify({
        'values': exporterParams.dataToSave
      })
    });
  });

  it('should resolve the promise after all requests successfully resolve', () => {
    let firstThenExecutor = fakePostPromise.then.getCall(0).args[0],
      secondThenExecutor = fakePostPromise.then.getCall(1).args[0],
      thirdThenExecutor = fakePostPromise.then.getCall(2).args[0];

    firstThenExecutor(JSON.stringify(firstPostResponse));
    secondThenExecutor(JSON.stringify(secondPostResponse));
    thirdThenExecutor();

    sinon.assert.calledOnce(resolveStub);
  });

  it('should reject if the catch is triggered', () => {
    let catchExecutor = fakePostPromise.catch.getCall(0).args[0];
    catchExecutor();

    sinon.assert.calledOnce(rejectStub);
    expect(fakePostPromise.catch.getCall(0).calledAfter(fakePostPromise.then.getCall(2)))
      .to.equal(true, 'catch() should be called after the last then()');
  });
});
