import { expect } from 'chai';
import sinon from 'sinon';
import fromPairs from 'lodash.frompairs';
import ArrayIndicesProxy from '../src/array-indices-proxy';

const checkTrap = (name, ...args) => {
  const spy = sinon.spy(Reflect[name]);
  const target = [1, 2];
  const proxy = new ArrayIndicesProxy(target, {
    [name]: spy,
  });
  const properties = ['-1', '0', '1', '2', ' 1', 'test', 'constructor'];
  properties.forEach(property => Reflect[name](proxy, property, ...args));
  expect(spy.callCount).to.equal(3);
  expect(spy.calledWith(target, 0)).to.be.true;
  expect(spy.calledWith(target, 1)).to.be.true;
  expect(spy.calledWith(target, 2)).to.be.true;
};

describe('ArrayIndicesProxy', () => {
  describe('property access traps', () => {
    it('invokes the trap only for array indices', () => {
      checkTrap('defineProperty', { configurable: true, enumerable: true });
      checkTrap('deleteProperty');
      checkTrap('get');
      checkTrap('getOwnPropertyDescriptor');
      checkTrap('has');
      checkTrap('set', true);
    });
    it('calls the appropriate Reflect methods on the target for properties which are not array indices', () => {
      const propertyAccessTraps = ['defineProperty', 'deleteProperty', 'get', 'getOwnPropertyDescriptor', 'has', 'set'];
      const handler = fromPairs(propertyAccessTraps.map(name => [name, () => {}]));
      const proxy = new ArrayIndicesProxy([1, 2, 3], handler);
      Reflect.defineProperty(proxy, 'test', { configurable: true, enumerable: true, value: 42 });
      expect(proxy).to.have.property('test', 42);
      Reflect.deleteProperty(proxy, 'test');
      expect(proxy).to.not.have.property('test');
      Reflect.set(proxy, 'test2', 43);
      expect(proxy).to.have.property('test2', 43);
      expect(Reflect.get(proxy, 'test2')).to.equal(43);
      expect(Reflect.has(proxy, 'test2')).to.equal(true);
      expect(Reflect.getOwnPropertyDescriptor(proxy, 'test2')).to.deep.equal({
        configurable: true,
        enumerable: true,
        writable: true,
        value: 43,
      });
    });
  });
  describe('other traps', () => {
    it('are not affected', () => {
      const proxy = new ArrayIndicesProxy([1, 2, 3], { ownKeys: () => ['0', '1', '2', 'length', 'test'] });
      expect(Reflect.ownKeys(proxy)).to.deep.equal(['0', '1', '2', 'length', 'test']);
    });
  });
});
