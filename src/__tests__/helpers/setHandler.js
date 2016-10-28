// @flow
import Module from 'module';

import type {FileTypeHandler} from 'module';

const originalHandler = Module._extensions['.js'];

let mockHandler: ?FileTypeHandler;

Module._extensions['.js'] = (module, fileName) => {
  if (mockHandler) {
    return mockHandler(module, fileName);
  } else {
    return originalHandler(module, fileName);
  }
};

export function setHandler(compiler: ?FileTypeHandler) {
  mockHandler = compiler;
}
