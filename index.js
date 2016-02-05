'use strict';
var readPkgUp = require('read-pkg-up');
var pify = require('pify');
var semver = require('semver');
var pinkiePromise = require('pinkie-promise');
var childProcess = pify(require('child_process'), pinkiePromise);

var POSSIBLE_TAGS = {
  snapshot: /^snapshot$/i,
  candidate: /^rc\d*$/i,
  milestone: /^m\d+$/i
};

function getDistTagForTag(tag) {
  for (var possibleTag in POSSIBLE_TAGS) {
    if (POSSIBLE_TAGS[possibleTag].test(tag)) {
      return possibleTag;
    }
  }

  return null;
}

function getMatchingDistTags(prereleaseTags) {
  return prereleaseTags.reduce(function (matchedTags, tag) {
    var distTag = getDistTagForTag(tag);

    if (distTag === null) {
      return matchedTags;
    }

    return matchedTags.concat(distTag);
  }, []);
}

function getDistTagForVersion(version) {
  var prereleaseTags = semver.parse(version).prerelease;

  var matchingDistTags = getMatchingDistTags(prereleaseTags);

  if (matchingDistTags.length > 1) {
    throw new Error('Multiple prerelease tags matching possible dist tags detected');
  }

  return matchingDistTags.length === 1 ? matchingDistTags[0] : null;
}

module.exports = function (cwd) {
  if (cwd === undefined) {
    cwd = '.';
  }

  function publish(distTag) {
    var publishCommand = 'npm publish' + (distTag ? ' --tag ' + distTag : '');
    return childProcess.exec(publishCommand, {cwd: cwd});
  }

  function publishPackage(packageObj) {
    var version = packageObj.pkg.version;
    var distTag = getDistTagForVersion(version);

    if (distTag === 'snapshot') {
      return childProcess.exec('npm unpublish --force', {cwd: cwd})
        .then(publish.bind(undefined, distTag));
    }

    return publish(distTag === null ? undefined : distTag);
  }

  return readPkgUp({cwd: cwd}).then(publishPackage);
};
