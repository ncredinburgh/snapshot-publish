# snapshot-publish

A thin wrapper around `npm publish` that detects if the module to be published is at a snapshot version (identified via the `SNAPSHOT` prerelease tag) and if so first unpublishes the previous snapshot the publishes with the `snapshot` tag.  Unpublishing does not work on the main NPM registry, however this module is designed to work with private NPM registries such as [Sinopia](https://github.com/rlidwka/sinopia).

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
