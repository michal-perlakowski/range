import _ from 'lodash';

export default class ArrayIndicesProxy {
  constructor(targetArray, handler) {
    const newHandler = _.fromPairs(Object.entries(handler).map(([name, trap]) => {
      const propertyAccessTraps = ['defineProperty', 'deleteProperty', 'get', 'getOwnPropertyDescriptor', 'has', 'set'];
      if (propertyAccessTraps.includes(name)) {
        return [name, (target, property, ...other) => {
          if (typeof property !== 'symbol') {
            const parsed = parseInt(property, 10);
            const maxArrayLength = 4294967295;
            if (parsed >= 0 && parsed <= maxArrayLength) {
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
