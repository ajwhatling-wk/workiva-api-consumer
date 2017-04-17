let sinon = require('sinon'),
  stub = sinon.stub,
  proxyquire = require('proxyquire'),

  sendToWorkivaRoute = require('../server/sendToWorkivaRoute');


describe('Server tests', () => {

  let expressStub,
    getStub,
    listenStub;

  beforeEach(() => {
    listenStub = stub();
    getStub = stub();
    expressStub = stub().returns({
      get: getStub,
      listen: listenStub
    });

    proxyquire('../server.js', {
      'express': expressStub
    });
  });

  it('should start on port 8145', () => {
    sinon.assert.calledOnce(listenStub);
    sinon.assert.calledWith(listenStub, 8145);
  });

  it('should have a GET route for sendToWorkiva.route', () => {
    sinon.assert.calledOnce(getStub);
    sinon.assert.calledWithExactly(getStub, sendToWorkivaRoute.route, sendToWorkivaRoute.handler);
  });
});
