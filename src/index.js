import 'babel-polyfill';
import { head, last } from 'lodash';
import ArrayIndicesProxy from './array-indices-proxy';

const mod = (n, m) => ((n % m) + m) % m;

const mandatory = (parameter) => {
  throw new Error(`The ${parameter} parameter is mandatory`);
};

export class PythonRange {
  constructor(...args) {
    if (args.length < 1) {
      throw new Error(`Expected at least 1 argument, got ${args.length}`);
    }
    if (args.length > 3) {
      throw new Error(`Expected at most 3 arguments, got ${args.length}`);
    }
    if (!args.every(Number.isInteger)) {
      throw new Error('All arguments must be integers');
    }

    const step = args.length === 3 ? args[2] : 1;
    if (step === 0) {
      throw new Error('The step argument must not be zero');
    }
    let [start, stop] = args;
    [start, stop] = (stop === undefined) ? [0, start] : [start, stop];
    const descriptor = {
      configurable: false,
      enumerable: false,
      writable: true,
    };
    Reflect.defineProperty(this, 'start', { ...descriptor, value: start });
    Reflect.defineProperty(this, 'stop', { ...descriptor, value: stop });
    Reflect.defineProperty(this, 'step', { ...descriptor, value: step });

    Reflect.defineProperty(this, 'length', {
      configurable: false,
      enumerable: false,
      get() {
        const difference = this.step > 0 ? this.stop - this.start : this.start - this.stop;
        const length = Math.ceil(difference / Math.abs(this.step));
        return Math.max(0, length);
      },
    });

    const proxy = new Proxy(this, {
      set(target, property, value) {
        return (property === 'length') ? false : Reflect.set(target, property, value);
      },
    });

    const indicesProxy = new ArrayIndicesProxy(proxy, {
      get(target, index) {
        if (index < target.length) {
          const value = target.start + (target.step * index);
          return value;
        }
        return undefined;
      },
      has(target, index) {
        return index < target.length;
      },
      getOwnPropertyDescriptor(target, index) {
        const indexDescriptor = {
          value: Reflect.get(indicesProxy, index),
          configurable: false,
          enumerable: true,
          writable: false,
        };
        // It is neccessary to define this property on target, because proxy cannot
        // report a non-existing property as non-configurable.
        // See http://stackoverflow.com/q/40921884/3853934
        Reflect.defineProperty(target, String(index), indexDescriptor);
        return indexDescriptor;
      },
      set() {
        return false;
      },
      defineProperty() {
        return false;
      },
      deleteProperty() {
        return false;
      },
      preventExtensions() {
        return false;
      },
      ownKeys(target) {
        const numericProperties = Object.keys(Array.from({ length: target.length }));
        return [...Reflect.ownKeys(target), ...numericProperties];
      },
    });

    return indicesProxy;
  }
  includes(value = mandatory('value'), ...rest) {
    if (rest.length !== 0) {
      throw new Error(`Expected one argument; got ${rest.length + 1}`);
    }
    if (!Number.isInteger(value)) {
      throw new Error('The value argument must be an integer');
    }
    return (this.step > 0
        ? value >= this.start && value < this.stop
        : value > this.stop && value <= this.start)
      && mod(value - this.start, this.step) === 0;
  }
  min(...rest) {
    if (rest.length !== 0) {
      throw new Error(`Expected zero arguments; got ${rest.length}`);
    }
    if (this.length !== 0) {
      return this.step > 0 ? head(this) : last(this);
    }
    return Infinity;
  }
  max(...rest) {
    if (rest.length !== 0) {
      throw new Error(`Expected zero arguments; got ${rest.length}`);
    }
    if (this.length !== 0) {
      return this.step > 0 ? last(this) : head(this);
    }
    return -Infinity;
  }
  reverse(...rest) {
    if (rest.length !== 0) {
      throw new Error(`Expected zero arguments; got ${rest.length}`);
    }
    [this.start, this.stop, this.step] = [last(this), this.start - 1, -this.step];
    return this;
  }
  static areEqual(a = mandatory('a'), b = mandatory('b'), ...rest) {
    if (rest.length !== 0) {
      throw new Error(`Expected two arguments; got ${rest.length + 2}`);
    }
    if (![a, b].every(x => x instanceof PythonRange)) {
      throw new Error('Both arguments must be instances of PythonRange');
    }
    // Based on https://github.com/python/cpython/blob/cff677abe1823900e954592035a170eb67840971/Objects/rangeobject.c#L425
    if (a === b) return true;
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;
    if (a.start !== b.start) return false;
    if (a.length === 1) return true;
    return a.step === b.step;
  }
}
export default function range(...args) {
  return new PythonRange(...args);
}
