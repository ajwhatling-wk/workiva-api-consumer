let sinon = require('sinon'),
  expect = require('chai').expect,
  workivaExporter = require('../../server/workivaExporter'),
  route = require('../../server/sendToWorkivaRoute');

describe('SendToWorkiva Route Tests', () => {
  let sandbox,

    fakeCatchPromise,
    fakePromise,
    fakeResponse,
    fakeExportData;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    fakeCatchPromise = {
      catch: sandbox.stub()
    };

    fakePromise = {
      then: sandbox.stub().returns(fakeCatchPromise)
    };

    fakeExportData = sandbox.stub(workivaExporter, 'exportData');

    fakeExportData.returns(fakePromise);

    fakeResponse = {
      status: sandbox.stub().returns(fakeResponse),
      send: sandbox.stub().returns(fakeResponse)
    };
  });

  afterEach(() => sandbox.restore());

  it('should be an object with a "route" property and a "handler" property', () => {
    expect(route.route).to.equal('/sendToWorkiva');
    expect(route.handler).to.be.a('function');
  });

  it('should call exportData on workivaExporter', () => {
    route.handler();

    sinon.assert.calledOnce(workivaExporter.exportData);
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
