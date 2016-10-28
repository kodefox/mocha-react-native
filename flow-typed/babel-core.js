// @flow

declare module 'babel-core' {
  declare type TransformOptions = {
    filename?: string;
    sourceFileName?: string;
  };

  declare type TransformResult = {
    code: string;
  };

  declare type BabelCore = {
    transform: (source: string, options: TransformOptions) => TransformResult;
  };

  declare var exports: BabelCore;
}
