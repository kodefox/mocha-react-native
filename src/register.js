// @flow
import fs from 'fs';
import {transform} from 'babel-core';
import Module from 'module';

const JS = '.js';
const REACT_NATIVE_PACKAGE = /\/react-native-[^\/]+\//;
const extensions = Module._extensions;
const transformPackages: Set<string> = new Set();

let originalHandler = extensions[JS];

extensions[JS] = (module, fileName) => {
  let isNodeModule = (fileName.indexOf('node_modules/') !== -1);
  let isReactNative = REACT_NATIVE_PACKAGE.test(fileName);
  if (isNodeModule && !isReactNative) {
    let packageName = fileName.split('/node_modules/').pop().split('/')[0];
    if (!transformPackages.has(packageName)) {
      return originalHandler(module, fileName);
    }
  }
  let src = fs.readFileSync(fileName, 'utf8');
  let output = transform(src, {
    filename: fileName,
    sourceFileName: fileName,
  });
  return module._compile(output.code, fileName);
};

export function addPackage(packageName: string) {
  transformPackages.add(packageName);
}
