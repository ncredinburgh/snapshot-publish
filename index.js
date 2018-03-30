'use strict';
const readPkgUp = require('read-pkg-up');
const pify = require('pify');
const semver = require('semver');
const childProcess = pify(require('child_process'));

const STDOUT_BUFFER_SIZE = 2000 * 1024;
const POSSIBLE_TAGS = {
  snapshot: /^snapshot$/i,
  candidate: /^rc\d*$/i,
  milestone: /^m\d+$/i
};

function getDistTagForTag(tag) {
  for (const possibleTag in POSSIBLE_TAGS) {
    if (POSSIBLE_TAGS[possibleTag].test(tag)) {
      return possibleTag;
    }
  }

  return null;
}

function getMatchingDistTags(prereleaseTags) {
  return prereleaseTags.reduce(function (matchedTags, tag) {
    const distTag = getDistTagForTag(tag);

    if (distTag === null) {
      return matchedTags;
    }

    return matchedTags.concat(distTag);
  }, []);
}

function getDistTagForVersion(version) {
  const prereleaseTags = semver.prerelease(version);

  if (prereleaseTags === null) {
    return null;
  }

  const matchingDistTags = getMatchingDistTags(prereleaseTags);

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
    const publishCommand = 'npm publish' + (distTag ? ' --tag ' + distTag : '');
    return childProcess.exec(publishCommand, {cwd: cwd, maxBuffer: STDOUT_BUFFER_SIZE});
  }

  function publishPackage(packageObj) {
    const version = packageObj.pkg.version;
    const distTag = getDistTagForVersion(version);

    if (distTag === 'snapshot') {
      return childProcess.exec('npm unpublish --force', {cwd: cwd, maxBuffer: STDOUT_BUFFER_SIZE})
        .then(publish.bind(undefined, distTag));
    }

    return publish(distTag === null ? undefined : distTag);
  }

  return readPkgUp({cwd: cwd}).then(publishPackage);
};
