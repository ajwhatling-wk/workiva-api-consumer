let sinon = require('sinon'),
  expect = require('chai').expect,
  request = require('request-promise-native'),

  logger = require('../../server/utils/logger'),
  promiseBuilder = require('../../server/utils/promiseBuilder'),

  importGithubIssues = require('../../server/githubImporter').importGithubIssues;


describe('Github Importer tests', () => {
  let sandbox;

  beforeEach('set up', () => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(request, 'get');
  });

  afterEach(() => sandbox.restore());

  it('should perform a GET request to fetch the open issues for the given repo and repo owner', () => {
    let repo_owner = 'repo-owner',
      repo = 'repo';

    importGithubIssues(repo_owner, repo);

    sinon.assert.calledOnce(request.get);
    sinon.assert.calledWithExactly(request.get, `https://api.github.com/repos/${repo_owner}/${repo}/issues?status=open`);
  });

  it('should convert the json to a list of rows with the issue title and user', () => {

  });
});
