import assert from 'assert';
import * as Ioc from 'b-ioc-js';

describe('exports .ts', () => {
  it('bind', () => {
    assert.equal(typeof Ioc.bind, 'function');
  });
});
