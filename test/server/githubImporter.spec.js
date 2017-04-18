let sinon = require('sinon'),
  expect = require('chai').expect,
  Chance = require('chance'),
  request = require('request-promise-native'),

  logger = require('../../server/utils/logger'),
  promiseBuilder = require('../../server/utils/promiseBuilder'),

  importGithubIssues = require('../../server/githubImporter').importGithubIssues;


describe('Github Importer tests', () => {
  let sandbox,
    chance,
    owner,
    repo,

    fakePromise,
    httpGetPromise,

    stubResolve,
    stubReject,

    githubIssueOne,
    githubIssueTwo,
    someGithubData;

  function callPromiseExecutor(resolveFn, rejectFn) {
    promiseBuilder.create.getCall(0).args[0](resolveFn, rejectFn);
  }

  function callHttpGetPromiseThen(response) {
    httpGetPromise.then.getCall(0).args[0](response);
  }

  function callHttpGetPromiseCatch(response) {
    httpGetPromise.catch.getCall(0).args[0](response);
  }

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();
    chance = new Chance();

    owner = chance.word();
    repo = chance.word();

    githubIssueOne = {
      title: chance.sentence(),
      user: {
        login: chance.name()
      }
    };

    githubIssueTwo = {
      title: chance.sentence(),
      user: {
        login: chance.name()
      }
    };

    someGithubData = [
      githubIssueOne, githubIssueTwo
    ];

    httpGetPromise = {
      then: sandbox.stub(),
      catch: sandbox.stub()
    };

    httpGetPromise.then.returns(httpGetPromise);

    fakePromise = 'this is a promise ' + chance.string();

    stubResolve = sandbox.stub();
    stubReject = sandbox.stub();

    sandbox.stub(request, 'get').returns(httpGetPromise);
    sandbox.stub(promiseBuilder, 'create').returns(fakePromise);
  });

  afterEach(() => sandbox.restore());

  it('should return a promise', () => {
    let issuesPromise = importGithubIssues(owner, repo);

    expect(issuesPromise).to.equal(fakePromise);
  });

  it('should perform a GET request to fetch the open issues for the given repo and repo owner', () => {
    let expectGetParams = {
      url: `https://api.github.com/repos/${owner}/${repo}/issues?status=open`,
      headers: {
        'User-Agent': 'workiva-api-consumer'
      }
    };

    importGithubIssues(owner, repo);

    sinon.assert.notCalled(request.get);

    callPromiseExecutor(stubResolve, stubReject);

    sinon.assert.calledOnce(request.get);
    sinon.assert.calledWithExactly(request.get, expectGetParams);
  });

  it('should convert the json to a list of rows with the issue title and user', () => {
    importGithubIssues(owner, repo);

    callPromiseExecutor(stubResolve, stubReject);

    sinon.assert.calledOnce(httpGetPromise.then);

    callHttpGetPromiseThen(JSON.stringify(someGithubData));

    sinon.assert.calledOnce(stubResolve);
    sinon.assert.calledWithExactly(stubResolve, [
      [githubIssueOne.title, githubIssueOne.user.login],
      [githubIssueTwo.title, githubIssueTwo.user.login]
    ]);
  });

  it('should reject promise with exception message when github request fails', () => {
    importGithubIssues(owner, repo);

    callPromiseExecutor(stubResolve, stubReject);

    sinon.assert.calledOnce(httpGetPromise.then);

    callHttpGetPromiseCatch({message: "failed"});

    sinon.assert.calledOnce(stubReject);
    sinon.assert.calledWithExactly(stubReject, "failed");
  });
});
