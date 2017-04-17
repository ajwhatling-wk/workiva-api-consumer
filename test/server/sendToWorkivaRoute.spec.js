let sinon = require('sinon'),
  expect = require('chai').expect,
  Chance = require('chance'),
  workivaExporter = require('../../server/workivaExporter'),
  route = require('../../server/sendToWorkivaRoute');

describe('SendToWorkiva Route Tests', () => {
  let sandbox,
    chance,

    fakeCatchPromise,
    fakePromise,
    fakeRequest,
    fakeResponse,
    fakeExportData;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    chance = new Chance();

    fakeCatchPromise = {
      catch: sandbox.stub()
    };

    fakePromise = {
      then: sandbox.stub().returns(fakeCatchPromise)
    };

    fakeExportData = sandbox.stub(workivaExporter, 'exportData');

    fakeExportData.returns(fakePromise);

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

  it('should call exportData on workivaExporter', () => {
    route.handler(fakeRequest, fakeResponse);

    sinon.assert.calledOnce(workivaExporter.exportData);
  });

  it('should call exportData on workivaExporter with the correct parameters', () => {
    route.handler(fakeRequest, fakeResponse);

    sinon.assert.calledWithExactly(workivaExporter.exportData, {
      apiUrl: process.env.WORKIVA_API_URL,
      authToken: process.env.WORKIVA_AUTH_TOKEN,
      dataToSave: fakeRequest.body
    });
  });

  it('should call exportData and when export succeeds it should call response.send()', () => {
    route.handler({}, fakeResponse);

    let thenCallback = fakePromise.then.getCall(0).args[0];

    thenCallback();

    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, '');
  });

  it('should call exportData and when export fails it should call response.status(400).send("failed")', () => {
    route.handler({}, fakeResponse);

    let catchCallback = fakeCatchPromise.catch.getCall(0).args[0];

    catchCallback();

    sinon.assert.calledOnce(fakeResponse.status);
    sinon.assert.calledWithExactly(fakeResponse.status, 400);

    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, 'failed');
  });
});
