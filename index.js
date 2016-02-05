'use strict';
var readPkgUp = require('read-pkg-up');
var includes = require('lodash.includes');
var pify = require('pify');
var semver = require('semver');
var pinkiePromise = require('pinkie-promise');
var childProcess = pify(require('child_process'), pinkiePromise);

var SNAPSHOT_IDENTIFIER = 'SNAPSHOT';
var SNAPSHOT_TAG = 'snapshot';

module.exports = function (cwd) {
  if (cwd === undefined) {
    cwd = '.';
  }

  function publish(isSnapshot) {
    var publishCommand = 'npm publish' + (isSnapshot ? ' --tag ' + SNAPSHOT_TAG : '');
    return childProcess.exec(publishCommand, {cwd: cwd});
  }

  function prereleaseTags(version) {
    return semver.parse(version).prerelease;
  }

  function publishPackage(packageObj) {
    var version = packageObj.pkg.version;

    if (includes(prereleaseTags(version), SNAPSHOT_IDENTIFIER)) {
      return childProcess.exec('npm unpublish --force', {cwd: cwd})
        .then(publish.bind(undefined, true));
    }

    return publish(false);
  }

  return readPkgUp({cwd: cwd}).then(publishPackage);
};
