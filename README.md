# snapshot-publish

[![Build Status](https://travis-ci.org/ncredinburgh/snapshot-publish.svg?branch=master)](https://travis-ci.org/NCR-CoDE/snapshot-publish)

A thin wrapper around `npm publish` that detects if the module to be published is at a snapshot version (identified via the `SNAPSHOT`
prerelease tag) and, if so, first unpublishes the previous snapshot then publishes with the `snapshot` tag.  Additionally, milestone
versions (-MXX) and release candidate versions (-RCX) are tagged with the `milestone` and `candidate` dist tags respectively.

Note that unpublishing does not work on the main NPM registry, however this module is designed to work with private NPM registries such as [Sinopia](https://github.com/rlidwka/sinopia).

## Install

```
$ npm install --save snapshot-publish
```

## Usage

```js
var publish = require('snapshot-publish');

publish().then(function () {
	console.log('A new version has been published!');
});
```

## API

### snapshotPublish([cwd])

Returns a promise that is resolved when the package has been published.

#### cwd

Type: `string`  
Default: `.`

Directory to start looking for a package.json file.

## Licence


MIT © [NCR Corporation](http://ncr.com)
