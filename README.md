# mocha-react-native

This is a collection of helpers to get Mocha tests working nicely with React Native projects. It includes runtime babel transformations, aliasing imports and mocking modules.

## How to use

```
$ npm install mocha-react-native
```

Create a file in your project: `test/mocha.opts`

Paste the following into that file.

```
--compilers js:mocha-react-native/init
```

## Advanced

Add an alias or mock a react-native module:

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

## License
This software is [ICS](https://en.wikipedia.org/wiki/ISC_license) licensed.
