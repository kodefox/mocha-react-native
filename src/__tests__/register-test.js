// @flow
const {describe, it, beforeEach, afterEach} = global;

import fs from 'fs';
import * as babel from 'babel-core';
import expect from 'expect';
import Module from 'module';
import {setHandler} from './helpers/setHandler';
import '../register';

type ModuleType = typeof Module;

describe('register', () => {
  let extensions = Module._extensions;
  let mockNormalCompiler;
  let mockReadFile;
  let mockTransformer;

  beforeEach(() => {
    mockNormalCompiler = expect.createSpy().andCall(
      (module, fileName) => `normal:${fileName}`
    );
    setHandler(mockNormalCompiler);
    mockReadFile = expect.spyOn(fs, 'readFileSync').andCall(
      (fileName: string) => `contents:${fileName}`
    );
    mockTransformer = expect.spyOn(babel, 'transform').andCall(
      (src: string) => ({code: `transformed:${src}`})
    );
  });

  afterEach(() => {
    setHandler(null);
    mockReadFile.restore();
    mockTransformer.restore();
  });

  function createMockModule(mockCompile: Function): ModuleType {
    return {...Module, _compile: mockCompile};
  }

  function shouldCompile(fileName: string) {
    let handler = extensions['.js'];
    let mockModuleCompile = expect.createSpy().andCall(
      (code) => `compiled:${code}`
    );
    let result = handler(createMockModule(mockModuleCompile), fileName);
    expect(mockNormalCompiler).toNotHaveBeenCalled();
    expect(mockTransformer.calls.length).toBe(1);
    expect(mockTransformer.calls[0].arguments).toEqual([
      `contents:${fileName}`,
      {
        filename: fileName,
        sourceFileName: fileName,
      },
    ]);
    expect(mockModuleCompile.calls.length).toBe(1);
    expect(mockModuleCompile.calls[0].arguments).toEqual([
      `transformed:contents:${fileName}`,
      fileName,
    ]);
    return result;
  }

  function shouldNotCompile(fileName: string) {
    let handler = extensions['.js'];
    let mockModuleCompile = expect.createSpy();
    let result = handler(createMockModule(mockModuleCompile), fileName);
    expect(mockNormalCompiler).toHaveBeenCalled();
    expect(mockTransformer.calls.length).toBe(0);
    expect(mockModuleCompile.calls.length).toBe(0);
    return result;
  }

  it('should compile normal js file', () => {
    let fileName = 'foo/bar.js';
    let result = shouldCompile(fileName);
    expect(result).toBe(`compiled:transformed:contents:${fileName}`);
  });

  it('should not compile node module', () => {
    let fileName = './node_modules/foo/bar.js';
    let result = shouldNotCompile(fileName);
    expect(result).toBe(`normal:${fileName}`);
  });

  it('should compile node module for react-native', () => {
    let fileName = './node_modules/react-native-foo/bar.js';
    let result = shouldCompile(fileName);
    expect(result).toBe(`compiled:transformed:contents:${fileName}`);
  });

});
