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
      sinon.assert.calledWith(execStub, 'npm publish');
    });
  });

  it('should error when package version is not valid semver', function (done) {
    testee('./fixture/invalid').catch(function (err) {
      assert(err.message.match(/Invalid version/) !== null);
      done();
    });
  });

  it('should tag as snapshot when snapshot prerelease tag is one of several', function () {
    return testee('./fixture/multitag').then(function () {
      sinon.assert.calledWithMatch(execStub, /--tag snapshot/);
    });
  });

  it('should unpublish previous snapshot when package is snapshot version', function () {
    return testee('./fixture/snapshot').then(function () {
      sinon.assert.calledWithMatch(execStub, /unpublish/);
    });
  });

  it('should not unpublish when package is not snapshot version', function () {
    return testee('./fixture/nosnapshot').then(function () {
      sinon.assert.neverCalledWithMatch(execStub, /unpublish/);
    });
  });

  it('should publish with snapshot tag when package is snapshot version', function () {
    return testee('./fixture/snapshot').then(function () {
      sinon.assert.calledWithMatch(execStub, /--tag snapshot/);
    });
  });

  it('should publish with milestone tag when package is milestone version', function () {
    return testee('./fixture/milestone').then(function () {
      sinon.assert.calledWithMatch(execStub, /--tag milestone/);
    });
  });

  it('should publish with candidate tag when package is release candidate version', function () {
    return testee('./fixture/candidate').then(function () {
      sinon.assert.calledWithMatch(execStub, /--tag candidate/);
    });
  });
});
