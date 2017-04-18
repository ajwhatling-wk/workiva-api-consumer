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
    fakePromise;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();
    chance = new Chance();

    owner = chance.word();
    repo = chance.word();

    fakePromise = 'this is a promise ' + chance.string();
    sandbox.stub(request, 'get');
    sandbox.stub(promiseBuilder, 'create').returns(fakePromise);
  });

  afterEach(() => sandbox.restore());

  it('should return a promise', () => {
    let issuesPromise = importGithubIssues(owner, repo);

    expect(issuesPromise).to.equal(fakePromise);
  });

  it('should perform a GET request to fetch the open issues for the given repo and repo owner', () => {
    importGithubIssues(owner, repo);

    sinon.assert.notCalled(request.get);

    promiseBuilder.create.getCall(0).args[0]();

    sinon.assert.calledOnce(request.get);
    sinon.assert.calledWithExactly(request.get, `https://api.github.com/repos/${owner}/${repo}/issues?status=open`);
  });
});
