let sinon = require('sinon'),
  stub = sinon.stub,
  proxyquire = require('proxyquire'),
  Chance = require('chance'),

  sendToWorkivaRoute = require('../server/sendToWorkivaRoute');


describe('Server tests', () => {

  let chance,
    expressStub,
    bodyParserStub,
    jsonStub,
    jsonStubReturnValue,
    useStub,
    postStub,
    listenStub;

  beforeEach(() => {
    chance = new Chance();

    jsonStubReturnValue = chance.string();
    jsonStub = stub();
    useStub = stub();
    postStub = stub();
    listenStub = stub();

    jsonStub.returns(jsonStubReturnValue);

    expressStub = stub().returns({
      post: postStub,
      listen: listenStub,
      use: useStub
    });

    bodyParserStub = {
      json: jsonStub
    };

    proxyquire('../server.js', {
      'express': expressStub,
      'body-parser': bodyParserStub
    });
  });

  it('should use a json body parser to auto parse application/json payloads', () => {
    sinon.assert.calledOnce(useStub);
    sinon.assert.calledWithExactly(useStub, jsonStubReturnValue);
  });

  it('should start on port 8145', () => {
    sinon.assert.calledOnce(listenStub);
    sinon.assert.calledWith(listenStub, 8145);
  });

  it('should have a POST route for sendToWorkiva.route', () => {
    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWithExactly(postStub, sendToWorkivaRoute.route, sendToWorkivaRoute.handler);
  });
});
