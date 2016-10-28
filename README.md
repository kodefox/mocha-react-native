# mocha-react-native

This is a collection of helpers to get Mocha tests working nicely with React Native projects. It includes runtime babel transformations, aliasing imports and mocking modules.

## How to use

```
$ npm install --save-dev mocha-react-native
```

Create a file in your project: `test/mocha.opts`

Paste the following into that file.

```
--compilers js:mocha-react-native/init
```

## Advanced

### Alias / Mock

You can add an alias or mock a react-native module to help with testing.

Create a file in your project: `test/mocks.js`

Add some code using `addAlias` and/or `addMock`:
```js
import {addAlias, addMock} from 'mocha-react-native';

addAlias('react-native-linear-gradient', 'actual-empty-object');

addMock('exponent', {
  Font: {
    style: () => ({fontFamily: ''}),
  },
});
```

Tell mocha about that file by adding a line to `test/mocha.opts`:

```
--compilers js:mocha-react-native/init
--require ./test/mocks.js
```

### Whitelist a react-native npm package

You can specify one ore more react-native npm packages that should be transformed by babel. This is done for you automatically if the package starts with `react-native-` however there are some packages that do not follow this convention and should be manually whitelisted.

Create a file in your project: `test/whitelist.js`

Use `addPackage` to whitelist packages by name:
```js
import {addPackage} from 'mocha-react-native';

addPackage('react-clone-referenced-element');
```

Tell mocha about that file by adding a line to `test/mocha.opts`:

```
--compilers js:mocha-react-native/init
--require ./test/whitelist.js
```

## License
This software is [ICS](https://en.wikipedia.org/wiki/ISC_license) licensed.
