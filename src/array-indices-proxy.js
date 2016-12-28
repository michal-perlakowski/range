import fromPairs from 'lodash.frompairs';
import includes from 'babel-runtime/core-js/array/includes';

export default class ArrayIndicesProxy {
  constructor(targetArray, handler) {
    const newHandler = fromPairs(Object.entries(handler).map(([name, trap]) => {
      const propertyAccessTraps = ['defineProperty', 'deleteProperty', 'get', 'getOwnPropertyDescriptor', 'has', 'set'];
      if (includes(propertyAccessTraps, name)) {
        return [name, (target, property, ...other) => {
          if (typeof property !== 'symbol') {
            const parsed = parseInt(property, 10);
            if (String(parsed) === property && parsed >= 0 && parsed <= Number.MAX_VALUE) {
              return trap(target, parsed, ...other);
            }
          }
          return Reflect[name](target, property, ...other);
        }];
      }
      return [name, trap];
    }));
    return new Proxy(targetArray, newHandler);
  }
}
