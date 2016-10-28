// @flow
import fs from 'fs';
import path from 'path';
import OriginalModule from 'module';

import type {Module as ModuleType} from 'module';

type AliasModuleList = {[key: string]: string};
type MockModuleList = {[key: string]: mixed};

// Lifted from `.flowconfig` from a fresh ReactNative app.
const RN_STATIC_RESOURCE = /\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf)$/;

const aliasModules: AliasModuleList = {};
const mockModules: MockModuleList = {};
const isPatchedMap: Map<ModuleType, boolean> = new Map();

let Module = OriginalModule;

export function addAlias(name: string, aliasName: string) {
  aliasModules[name] = aliasName;
  patchModule();
}

export function addMock(name: string, exports: mixed) {
  mockModules[name] = exports;
  patchModule();
}

export function patchModule() {
  let isPatched = (isPatchedMap.get(Module) === true);
  if (isPatched) {
    return;
  }
  const originalLoader = Module._load;
  Module._load = (request, parent, ...others) => {
    if (request.match(RN_STATIC_RESOURCE)) {
      return {uri: request};
    }
    if (request in aliasModules) {
      request = aliasModules[request];
    }
    if (request in mockModules) {
      return mockModules[request];
    }
    return originalLoader(request, parent, ...others);
  };

  const originalFindPath = Module._findPath;
  Module._findPath = (request, paths, ...others) => {
    let fileName = originalFindPath(request, paths, ...others);
    if (!fileName) {
      let cacheKey = JSON.stringify({request, paths});
      for (let i = 0; i < paths.length; i++) {
        let basePath = path.resolve(paths[i], request);
        try {
          // TODO: Support configurable suffix.
          fileName = fs.realpathSync(basePath + '.ios.js');
        } catch (ex) {}
        if (fileName) {
          Module._pathCache[cacheKey] = fileName;
          break;
        }
      }
    }
    return fileName;
  };

  isPatchedMap.set(Module, true);
}

/* Setters for testing */

function setModule(_Module: ModuleType) {
  Module = _Module;
}

function resetModule() {
  Module = OriginalModule;
}

export {
  setModule as setModuleForTesting,
  resetModule as resetModuleForTesting,
};
