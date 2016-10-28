//@flow
const {describe, it, beforeEach, afterEach} = global;

import expect from 'expect';
import {
  addMock,
  addAlias,
  setModuleForTesting,
  resetModuleForTesting,
} from '../moduleIntercept';

describe('loaderIntercept', () => {
  let mockLoader;
  let MockModule;

  beforeEach(() => {
    mockLoader = expect.createSpy().andCall(
      (name: string) => ({name})
    );
    MockModule = {
      _load: mockLoader,
      _findPath: () => false,
      _pathCache: {},
      _extensions: {},
      _compile: () => ({}),
    };
    setModuleForTesting(MockModule);
  });

  afterEach(() => {
    resetModuleForTesting();
  });

  it('should addAlias', () => {
    addAlias('foo', 'bar');
    MockModule._load('foo');
    expect(mockLoader.calls.length).toBe(1);
    expect(mockLoader.calls[0].arguments[0]).toBe('bar');
  });

  it('should addMock', () => {
    let bazExport = {baz: true};
    addMock('baz', bazExport);
    let result = MockModule._load('baz');
    expect(result).toBe(bazExport);
    expect(mockLoader.calls.length).toBe(0);
  });

});
