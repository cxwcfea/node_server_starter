/* global describe, it */
import chai from 'chai';

chai.should();
const expect = chai.expect;
const assert = chai.assert;

function add(x, y) {
  return x + y;
}

describe('testcase examples', () => {
  describe('chai', () => {
    it('how to use should', () => {
      const result = add(1, 2);
      result.should.be.a('number').equal(3);
    });
    it('how to use expect', () => {
      const result = add(1, 2);
      expect(result).to.be.a('number').equal(3);
    });
    it('how to use assert', () => {
      const result = add(1, 2);
      assert.typeOf(result, 'number');
      assert.equal(result, 3);
    });
  });
});
