import { expect } from 'chai';
import { isClass } from 'typechecker';
import range, { PythonRange } from '../src/index';

describe('range', () => {
  it('returns an instance of PythonRange', () => {
    expect(range(10)).to.be.an.instanceof(PythonRange);
  });
});

describe('PythonRange', () => {
  it('is a class', () => {
    expect(isClass(PythonRange)).to.be.true;
  });
  describe('handling incorrect arguments', () => {
    it('throws an error when called with less than one argument', () => {
      expect(() => range()).to.throw(Error);
    });
    it('throws an error when called with more than three arguments', () => {
      expect(() => range(1, 2, 3, 4)).to.throw(Error);
    });
    it('throws an error when called with non-integer arguments', () => {
      expect(() => range(1.2)).to.throw(Error);
      expect(() => range(true)).to.throw(Error);
      expect(() => range(1, 2, '3')).to.throw(Error);
    });
    it('throws an error when the step argument is zero', () => {
      expect(() => range(1, 2, 0)).to.throw(Error);
    });
  });
  describe('start, stop, and step properties', () => {
    let r;
    before(() => {
      r = range(1, 11, 2);
    });
    it('have correct values', () => {
      expect(r.start).to.equal(1);
      expect(r.stop).to.equal(11);
      expect(r.step).to.equal(2);
    });
    it('are non-configurable, non-enumerable and writable', () => {
      ['start', 'stop', 'step']
        .map(property => Reflect.getOwnPropertyDescriptor(r, property))
        .forEach(descriptor => expect(descriptor).to.deep.equal({
          configurable: false,
          enumerable: false,
          writable: true,
          value: descriptor.value,
        }));
    });
    it('changing them updates the length property', () => {
      r.start = 0;
      expect(r.length).to.equal(6);
      r.stop = 8;
      expect(r.length).to.equal(4);
      r.step = 1;
      expect(r.length).to.equal(8);
    });
  });
  describe('length property', () => {
    it('has the correct value', () => {
      expect(range(10)).to.have.property('length', 10);
      expect(range(1, 6)).to.have.property('length', 5);
      expect(range(1, 11, 2)).to.have.property('length', 5);
      expect(range(1, 12, 2)).to.have.property('length', 6);
      expect(range(1, 1)).to.have.property('length', 0);
      expect(range(-10)).to.have.property('length', 0);
      expect(range(-10, -15, -6)).to.have.property('length', 1);
      expect(range(0, -10, -1)).to.have.property('length', 10);
    });
    it('is non-configurable and non-enumerable', () => {
      const descriptor = Reflect.getOwnPropertyDescriptor(range(10), 'length');
      expect(descriptor.configurable).to.be.false;
      expect(descriptor.enumerable).to.be.false;
    });
    it('cannot be modified', () => {
      const r = range(10);
      expect(Reflect.set(r, 'length', 15)).to.be.false;
      expect(r.length).to.equal(10);
    });
  });
  describe('numeric properties', () => {
    it('exist', () => {
      const r = range(2);
      expect(-1 in r).to.be.false;
      expect(0 in r).to.be.true;
      expect(1 in r).to.be.true;
      expect(3 in r).to.be.false;
    });
    it('have correct values', () => {
      let r = range(3);
      expect(r[-1]).to.be.undefined;
      expect(r[0]).to.equal(0);
      expect(r[1]).to.equal(1);
      expect(r[2]).to.equal(2);
      expect(r[3]).to.be.undefined;

      r = range(4, 5);
      expect(r[-1]).to.be.undefined;
      expect(r[0]).to.equal(4);
      expect(r[1]).to.be.undefined;

      r = range(3, 6, 2);
      expect(r[0]).to.equal(3);
      expect(r[1]).to.equal(5);

      r = range(2, 0, -1);
      expect(r[0]).to.equal(2);
      expect(r[1]).to.equal(1);
    });
    it('are non-configurable, enumerable and non-writable', () => {
      expect(Reflect.getOwnPropertyDescriptor(range(1, 2), '0')).to.deep.equal({
        configurable: false,
        enumerable: true,
        writable: false,
        value: 1,
      });
    });
    it('cannot be reassigned', () => {
      expect(Reflect.set(range(10), '0', 42)).to.be.false;
    });
    it('cannot be changed using defineProperty', () => {
      expect(Reflect.defineProperty(range(10), '0', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: 42,
      })).to.be.false;
    });
    it('cannot be deleted', () => {
      expect(Reflect.deleteProperty(range(10), '0')).to.be.false;
    });
  });
  it('cannot be made non-extensible', () => {
    expect(Reflect.preventExtensions(range(10))).to.be.false;
  });
  it('returns a correct result for Object.getOwnPropertyNames()', () => {
    expect(Object.getOwnPropertyNames(range(3))).to.deep.equal(['start', 'stop', 'step', 'length', '0', '1', '2']);
  });
  describe('#includes', () => {
    it('throws an error for invalid arguments', () => {
      expect(() => range(3).includes()).to.throw(Error);
      expect(() => range(3).includes('1')).to.throw(Error);
      expect(() => range(3).includes(3, 5)).to.throw(Error);
    });
    it('returns true if the range includes the specifed number', () => {
      expect(range(3).includes(0)).to.be.true;
      expect(range(3).includes(2)).to.be.true;
      expect(range(2, 5).includes(2)).to.be.true;
      expect(range(2, 5).includes(3)).to.be.true;
      expect(range(2, 5).includes(4)).to.be.true;
      expect(range(10, 0, -2).includes(10)).to.be.true;
      expect(range(10, 0, -2).includes(8)).to.be.true;
      expect(range(10, 0, -2).includes(2)).to.be.true;
      expect(range(-5, 0).includes(-5)).to.be.true;
      expect(range(-10, -5).includes(-6)).to.be.true;
      expect(range(-5, 5).includes(2)).to.be.true;
    });
    it('returns false if the range doesn\'t include the specified number', () => {
      expect(range(3).includes(-1)).to.be.false;
      expect(range(3).includes(3)).to.be.false;
      expect(range(2, 5).includes(1)).to.be.false;
      expect(range(2, 5).includes(5)).to.be.false;
      expect(range(10, 0, -2).includes(11)).to.be.false;
      expect(range(10, 0, -2).includes(9)).to.be.false;
      expect(range(10, 0, -2).includes(0)).to.be.false;
      expect(range(-5, 0).includes(0)).to.be.false;
      expect(range(-5, 0).includes(5)).to.be.false;
      expect(range(-10, -5).includes(-5)).to.be.false;
      expect(range(-10, -5).includes(-1)).to.be.false;
    });
  });
  describe('#min', () => {
    it('throws an error for invalid arguments', () => {
      expect(() => range(3).min(1)).to.throw(Error);
    });
    it('returns the smallest value in the range', () => {
      expect(range(0).min()).to.equal(Infinity);
      expect(range(3).min()).to.equal(0);
      expect(range(2, 4).min()).to.equal(2);
      expect(range(10, 0, -2).min()).to.equal(2);
    });
  });
  describe('#max', () => {
    it('throws an error for invalid arguments', () => {
      expect(() => range(3).max(1)).to.throw(Error);
    });
    it('returns the largest value in the range', () => {
      expect(range(0).max()).to.equal(-Infinity);
      expect(range(3).max()).to.equal(2);
      expect(range(2, 4).max()).to.equal(3);
      expect(range(10, 0, -2).max()).to.equal(10);
    });
  });
  describe('#reverse', () => {
    it('throws an error when called with more than 0 arguments', () => {
      expect(() => range(3).reverse(true)).to.throw(Error);
    });
    it('changes the original range', () => {
      const r = range(3);
      r.reverse();
      expect(PythonRange.areEqual(r, range(2, -1, -1)));
    });
    it('returns the range', () => {
      const r = range(3);
      expect(r === r.reverse()).to.be.true;
    });
    it('reverses the range', () => {
      expect(PythonRange.areEqual(range(3).reverse(), range(2, -1, -1))).to.be.true;
      expect(PythonRange.areEqual(range(2, 5).reverse(), range(4, 1, -1))).to.be.true;
      expect(PythonRange.areEqual(range(0, 10, 2).reverse(), range(8, -1, -2))).to.be.true;
      expect(PythonRange.areEqual(range(0, 3, 3).reverse(), range(0, 1))).to.be.true;
      expect(PythonRange.areEqual(range(10, 0, -1).reverse(), range(1, 11, 1))).to.be.true;
    });
  });
  describe('@@iterator', () => {
    it('iterates the range', () => {
      const result = [];
      for (const element of range(3)) { // eslint-disable-line
        result.push(element);
      }
      expect(result).to.deep.equal([0, 1, 2]);
    });
  });
  describe('@@toStringTag', () => {
    it('equals to "PythonRange"', () => {
      expect(range(3)[Symbol.toStringTag]).to.equal('PythonRange');
    });
  });
  describe('#toString', () => {
    it('returns a string representation of the range', () => {
      expect(range(3).toString()).to.equal('range(0, 3, 1)');
      expect(range(4, 2, -1).toString()).to.equal('range(4, 2, -1)');
    });
  });
  describe('#valueOf', () => {
    it('returns the result of toString() method', () => {
      expect(range(3).valueOf()).to.equal(range(3).toString());
      expect(range(4, 2, -1).valueOf()).to.equal(range(4, 2, -1).toString());
    });
  });
  describe('PythonRange.areEqual()', () => {
    it('throws an error for invalid arguments', () => {
      expect(() => PythonRange.areEqual()).to.throw(Error);
      expect(() => PythonRange.areEqual(range(3))).to.throw(Error);
      expect(() => PythonRange.areEqual(1, 2)).to.throw(Error);
      expect(() => PythonRange.areEqual(range(3), range(4), range(5))).to.throw(Error);
    });
    it('returns true if the ranges are equal', () => {
      const r = range(2);
      expect(PythonRange.areEqual(r, r)).to.be.true;
      expect(PythonRange.areEqual(range(0, 3), range(3))).to.be.true;
      expect(PythonRange.areEqual(range(0), range(5, 5))).to.be.true;
      expect(PythonRange.areEqual(range(3), range(3))).to.be.true;
      expect(PythonRange.areEqual(range(3, 10, 15), range(3, 11, 15))).to.be.true;
    });
    it('returns false if the ranges are not equal', () => {
      expect(PythonRange.areEqual(range(3), range(4))).to.be.false;
      expect(PythonRange.areEqual(range(2, 3), range(3, 4))).to.be.false;
      expect(PythonRange.areEqual(range(0, 5, 1), range(0, 5, 2))).to.be.false;
    });
  });
});
