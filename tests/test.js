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
  });
  describe('length property', () => {
    it('has the correct value', () => {
      expect(range(10)).to.have.property('length', 10);
      expect(range(1, 6)).to.have.property('length', 5);
      expect(range(1, 11, 2)).to.have.property('length', 5);
      expect(range(1, 12, 2)).to.have.property('length', 6);
      expect(range(1, 1)).to.have.property('length', 0);
      expect(range(-10)).to.have.property('length', 0);
      expect(range(-10)).to.have.property('length', 0);
      expect(range(0, -10, -1)).to.have.property('length', 10);
    });
    it('is non-configurable, non-enumerable and non-writable', () => {
      expect(Reflect.getOwnPropertyDescriptor(range(10), 'length')).to.deep.equal({
        configurable: false,
        enumerable: false,
        writable: false,
        value: 10,
      });
    });
  });
  describe('numeric properties', () => {
    it('exist', () => {
      const r = range(2);
      expect(Reflect.has(r, '-1')).to.be.false;
      expect(Reflect.has(r, '0')).to.be.true;
      expect(Reflect.has(r, '1')).to.be.true;
      expect(Reflect.has(r, '3')).to.be.false;
    });
    it('have correct values', () => {
      let r = range(3);
      expect(Reflect.get(r, '-1')).to.be.undefined;
      expect(Reflect.get(r, '0')).to.equal(0);
      expect(Reflect.get(r, '1')).to.equal(1);
      expect(Reflect.get(r, '2')).to.equal(2);
      expect(Reflect.get(r, '3')).to.be.undefined;

      r = range(4, 5);
      expect(Reflect.get(r, '-1')).to.be.undefined;
      expect(Reflect.get(r, '0')).to.equal(4);
      expect(Reflect.get(r, '1')).to.be.undefined;

      r = range(3, 6, 2);
      expect(Reflect.get(r, '0')).to.equal(3);
      expect(Reflect.get(r, '1')).to.equal(5);

      r = range(2, 0, -1);
      expect(Reflect.get(r, '0')).to.equal(2);
      expect(Reflect.get(r, '1')).to.equal(1);
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
  it('returns a correct result for Reflect.ownKeys()', () => {
    expect(Reflect.ownKeys(range(3))).to.deep.equal(['start', 'stop', 'step', 'length', '0', '1', '2']);
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
    });
    it('returns false if the range doesn\'t include the specified number', () => {
      expect(range(3).includes(-1)).to.be.false;
      expect(range(3).includes(3)).to.be.false;
      expect(range(2, 5).includes(1)).to.be.false;
      expect(range(2, 5).includes(5)).to.be.false;
      expect(range(10, 0, -2).includes(11)).to.be.false;
      expect(range(10, 0, -2).includes(9)).to.be.false;
      expect(range(10, 0, -2).includes(0)).to.be.false;
    });
  });
});
