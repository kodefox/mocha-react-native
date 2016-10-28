// @flow

declare module 'module' {
  declare type FindPathResult = false | string;
  declare type FileTypeHandler = (module: Module, fileName: string) => mixed;

  declare type Module = {
    _load: (path: string, parent: mixed) => mixed;
    _findPath: (request: string, paths: Array<string>, isMain: boolean) => ?FindPathResult;
    _pathCache: {[key: string]: string};
    _extensions: {[ext: string]: FileTypeHandler};
    _compile: (code: string, fileName: string) => mixed;
  };

  declare var exports: Module;
}
