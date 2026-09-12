import assert from 'assert';
import * as Ioc from 'b-ioc-js';

describe('exports .mjs', () => {
  it('bind', () => {
    assert.equal(typeof Ioc.bind, 'function');
  });
});
