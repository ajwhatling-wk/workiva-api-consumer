let sinon = require('sinon'),
  expect = require('chai').expect,
  Chance = require('chance'),
  logger = require('../../server/utils/logger'),
  githubImporter = require('../../server/githubImporter'),
  workivaExporter = require('../../server/workivaExporter'),
  route = require('../../server/sendToWorkivaRoute');

describe('SendToWorkiva Route Tests', () => {
  let sandbox,
    chance,

    fakeCatchPromise,
    fakePromise,
    fakeGithubPromise,
    fakeRequest,
    fakeResponse,
    fakeExportData;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    chance = new Chance();

    sandbox.stub(logger, 'log');

    fakeCatchPromise = {
      catch: sandbox.stub()
    };

    fakePromise = {
      then: sandbox.stub().returns(fakeCatchPromise)
    };

    fakeGithubPromise = {
      then: sandbox.stub(),
      catch: sandbox.stub()
    };

    fakeGithubPromise.then.returns(fakeGithubPromise);
    fakeGithubPromise.catch.returns(fakeGithubPromise);

    fakeExportData = sandbox.stub(workivaExporter, 'exportData');
    fakeExportData.returns(fakePromise);

    sandbox.stub(githubImporter, 'importGithubIssues').returns(fakeGithubPromise);

    fakeRequest = {
      body: {foo: chance.string()}
    };

    fakeResponse = {
      status: sandbox.stub().returns(fakeResponse),
      send: sandbox.stub().returns(fakeResponse)
    };

    process.env.WORKIVA_API_URL = chance.url();
    process.env.WORKIVA_AUTH_TOKEN = chance.string();
  });

  afterEach(() => {
    delete process.env.WORKIVA_API_URL;
    delete process.env.WORKIVA_AUTH_TOKEN;

    sandbox.restore();
  });

  it('should be an object with a "route" property and a "handler" property', () => {
    expect(route.route).to.equal('/sendToWorkiva');
    expect(route.handler).to.be.a('function');
  });

  it('should call importGithubIssues first to fetch github data', () => {
    fakeRequest.body.github_owner = chance.name();
    fakeRequest.body.github_repo = chance.word();

    route.handler(fakeRequest, fakeResponse);

    sinon.assert.calledOnce(githubImporter.importGithubIssues);
    sinon.assert.calledWithExactly(
      githubImporter.importGithubIssues,
      fakeRequest.body.github_owner,
      fakeRequest.body.github_repo
    );
  });

  it('should not call exportData on workivaExporter when github import fails', () => {
    route.handler(fakeRequest, fakeResponse);

    let error = 'failed';
    fakeGithubPromise.catch.getCall(0).args[0](error);

    sinon.assert.notCalled(workivaExporter.exportData);
  });

  it('should respond with status 400 and send the error when github import fails', () => {
    route.handler(fakeRequest, fakeResponse);

    let error = chance.word();
    fakeGithubPromise.catch.getCall(0).args[0](error);
    
    sinon.assert.calledOnce(fakeResponse.status);
    sinon.assert.calledWithExactly(fakeResponse.status, 400);
    
    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, error);
  });

  it('should call exportData on workivaExporter when github import is successful', () => {
    route.handler(fakeRequest, fakeResponse);

    let data = {};
    fakeGithubPromise.then.getCall(0).args[0](data);

    sinon.assert.calledOnce(workivaExporter.exportData);
  });

  it('should call exportData on workivaExporter with the correct parameters', () => {
    route.handler(fakeRequest, fakeResponse);

    let data = [[chance.name(), chance.word()]];
    fakeGithubPromise.then.getCall(0).args[0](data);

    sinon.assert.calledWithExactly(workivaExporter.exportData, {
      apiUrl: process.env.WORKIVA_API_URL,
      authToken: process.env.WORKIVA_AUTH_TOKEN,
      dataToSave: data
    });
  });

  it('should call exportData and when export succeeds it should call response.send()', () => {
    route.handler(fakeRequest, fakeResponse);

    let data = [[chance.name(), chance.word()]];
    fakeGithubPromise.then.getCall(0).args[0](data);

    let thenCallback = fakePromise.then.getCall(0).args[0];

    thenCallback();

    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, '');
  });

  it('should call exportData and when export fails it should call response.status(400).send("failed")', () => {
    route.handler(fakeRequest, fakeResponse);

    let data = [[chance.name(), chance.word()]];
    fakeGithubPromise.then.getCall(0).args[0](data);

    let error = chance.word(),
      catchCallback = fakeCatchPromise.catch.getCall(0).args[0];

    catchCallback(error);

    sinon.assert.calledOnce(fakeResponse.status);
    sinon.assert.calledWithExactly(fakeResponse.status, 400);

    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, error);
  });
});
