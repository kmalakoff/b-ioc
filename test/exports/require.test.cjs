const assert = require('assert');
const Ioc = require('b-ioc-js');

describe('exports .cjs', () => {
  it('bind', () => {
    assert.equal(typeof Ioc.bind, 'function');
  });
});
