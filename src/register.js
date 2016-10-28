// @flow
import fs from 'fs';
import {transform} from 'babel-core';
import Module from 'module';

const JS = '.js';
const REACT_NATIVE_PACKAGE = /\/react-native-[^\/]+\//;
const extensions = Module._extensions;

let originalHandler = extensions[JS];

extensions[JS] = (module, fileName) => {
  let isNodeModule = (fileName.indexOf('node_modules/') !== -1);
  let isReactNative = REACT_NATIVE_PACKAGE.test(fileName);
  if (isNodeModule && !isReactNative) {
    return originalHandler(module, fileName);
  }
  let src = fs.readFileSync(fileName, 'utf8');
  let output = transform(src, {
    filename: fileName,
    sourceFileName: fileName,
  });
  return module._compile(output.code, fileName);
};
