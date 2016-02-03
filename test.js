/* eslint-env mocha */
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var assert = require('assert');
var execStub = sinon.stub().callsArg(2);
var testee = proxyquire('./', {child_process: {exec: execStub}});// eslint-disable-line camelcase

describe('snapshot-publish', function () {
  beforeEach(function () {
    execStub.reset();
  });

  it('should publish to an npm registry', function () {
    return testee('./fixture/nosnapshot').then(function () {
      assert(execStub.calledWith('npm publish'));
    });
  });

  it('should unpublish previous snapshot when package is snapshot version', function () {
    return testee('./fixture/snapshot').then(function () {
      assert(execStub.calledWithMatch(/unpublish/));
    });
  });

  it('should not unpublish when package is not snapshot version', function () {
    return testee('./fixture/nosnapshot').then(function () {
      assert(execStub.calledWithMatch(/unpublish/) === false);
    });
  });

  it('should publish with snapshot tag when package is snapshot version', function () {
    return testee('./fixture/snapshot').then(function () {
      assert(execStub.calledWithMatch(/--tag snapshot/));
    });
  });
});
