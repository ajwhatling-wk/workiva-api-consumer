let sinon = require('sinon'),
  expect = require('chai').expect,
  workivaExporter = require('../../server/workivaExporter'),
  route = require('../../server/sendToWorkivaRoute');

describe('SendToWorkiva Route Tests', () => {
  let sandbox,

    fakeCatchPromise,
    fakePromise,
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

  it('should call exportData and when export finishes it should call response.send()', () => {
    let fakeResponse = {
      send: sandbox.stub()
    };

    route.handler({}, fakeResponse);

    let thenCallback = fakePromise.then.getCall(0).args[0];

    thenCallback();

    sinon.assert.calledOnce(fakeResponse.send);
    sinon.assert.calledWithExactly(fakeResponse.send, '');
  });
});
