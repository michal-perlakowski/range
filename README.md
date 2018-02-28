# range

[![NPM Version](https://img.shields.io/npm/v/python-range.svg?style=flat-square)](https://www.npmjs.com/package/python-range)
[![Build Status](https://img.shields.io/travis/Gothdo/range.svg?style=flat-square)](https://travis-ci.org/Gothdo/range)
[![dependency Status](https://img.shields.io/david/Gothdo/range.svg?style=flat-square)](https://david-dm.org/Gothdo/range)
[![devDependency Status](https://img.shields.io/david/dev/Gothdo/range.svg?style=flat-square)](https://david-dm.org/Gothdo/range?type=dev)
[![Coverage Status](https://img.shields.io/coveralls/Gothdo/range.svg?style=flat-square)](https://coveralls.io/github/Gothdo/range?branch=master)

A JavaScript implementation of the Python's `range()` function.

# Installation

```
npm i python-range
```

# Examples

[Try it out in your browser](https://runkit.com/npm/python-range).

## Basic usage

```javascript
import range from 'python-range';

const r = range(10);
console.log(r); // range(0, 10, 1)
console.log(Array.from(r)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(r[3]); // 3
console.log(r.length); // 10

console.log(Array.from(range(2, 5))); // [2, 3, 4]
console.log(Array.from(range(5, 0, -1))); // [5, 4, 3, 2, 1]
```

## Iteration

```javascript
const r = range(3, 6);
for (const n of r) {
  console.log(n); // logs 3, 4 and 5
}
r.forEach(n => console.log(n)); // logs 3, 4, and 5
```

## Lazy evaluation

Unlike other range modules, `python-range` has lazy evaluation.

See [Why is “1000000000000000 in range(1000000000000001)” so fast in Python 3?](http://stackoverflow.com/q/30081275/3853934)

```javascript
console.log(range(1000000000000001).includes(1000000000000000)); // true
console.log(range(0, 100000000000001, 10).includes(100000000000000)); // true
console.log(range(0, -1000000000, -3)[12345678]); // -37037034
```

# Documentation

## Exported values

`python-range` exports two values: a `PythonRange` class, and a `range` function (a default export), which returns a `PythonRange` object.

```javascript
import range, {PythonRange} from 'python-range';
console.log(range(10) instanceof PythonRange); // true
```

## `new PythonRange(<int> start, <int> stop[, <int> step])`

The `PythonRange` constructor creates a range starting with `start` (inclusive) and ending with `stop` (exclusive). The `step` parameter defaults to `1` and specifies the distance between two elements. The `step` parameter must be different than `0`.

## `new PythonRange(<int> stop)`

When called with only one argument, the `start` parameter defaults to `0` and the passed argument becomes `stop`.

```javascript
const r = range(3);
console.log(r.start); // 0
console.log(r.stop); // 3
```

## Numeric properties

You can access range elements using array indices. Note that this requires native `Proxy` support.

```javascript
const r = range(2, 5);
console.log(r[0]); // 2
console.log(r[2]); // 4
```

## `start`, `stop` and `step` properties

The `PythonRange` constructor creates these properties based on the arguments passed to the constructor, or the default values. These properties are writable, and changing them automatically updates the range.

```javascript
const r = range(5);
console.log(Array.from(r)); // [0, 1, 2, 3, 4]
r.step = 2;
console.log(Array.from(r)); // [0, 2, 4]
```

## `length` property

The `length` property specifies the number of elements in the range. It's updated automatically when the `start`, `stop` and `step` properties are changed.

```javascript
const r = range(5);
console.log(r.length); // 5
r.stop = 3;
console.log(r.length); // 3
```

## `PythonRange.prototype.get(<int> index)`

Works the same as accessing numeric properties (e.g. `r[2]`). Use this method if you want to execute your code in environments without native `Proxy` support.

```javascript
console.log(range(2, 5).get(1)); // 3
```

## `PythonRange.prototype.forEach(<callable> callback[, <object> thisArg])`

Executes the `callback` once for each element with element, current index and the range as arguments. Works the same as `Array.prototype.forEach()`.

## `PythonRange.prototype.includes(<int> value)`

Returns `true` if the range contains the specified value; otherwise returns `false`.

```javascript
console.log(range(3, 5).includes(3)); // true
console.log(range(10).includes(10)); // false
```

## `PythonRange.prototype.min()`

Returns the smallest value in the range.

```javascript
console.log(range(10).min()); // 0
console.log(range(0, -15, -1).min()); // -14
```

## `PythonRange.prototype.max()`

Returns the largest value in the range.

```javascript
console.log(range(10).max()); // 9
console.log(range(12, 0, -2).max()); // 12
```

## `PythonRange.prototype.reverse()`

Reverses the range in-place and returns it.

```javascript
console.log(range(2, 5).reverse()); // range(4, 1, -1)
console.log(range(10, 0, -1).reverse()); // range(1, 11, 1)
```

## `PythonRange.prototype.toString()`

Returns a string `range(<start>, <stop>, <step>)`, where `<start>`, `<stop>` and `<step>` are the `start`, `stop` and `step` properties of the range.

```javascript
console.log(String(range(3, 6, 2))); // range(3, 6, 2)
```

## `PythonRange.prototype.valueOf()`

Returns the result of the `toString()` method.

## `PythonRange.prototype[@@iterator]()`

Returns the result of calling `Array.prototype.values()` on the range.

## `PythonRange.areEqual(<PythonRange> a, <PythonRange> b)`

Returns `true` if the passed arguments are equal; otherwise returns `false`. Two ranges are considered equals if they contain the same set of values. For example, `range(3, 3)` and `range(0)` are equal, because they're both empty ranges. `range(4, 5, 2)` and `range(4, 6, 3)` are equal too, because they both contain only one element: `4`.

```javascript
const r = range(3);
console.log(PythonRange.areEqual(r, r)); // true
console.log(PythonRange.areEqual(range(10), range(10))); // true
console.log(PythonRange.areEqual(range(3, 3), range(0))); // true, because both ranges are empty
console.log(PythonRange.areEqual(range(4, 5, 2), range(4, 6, 3))); // true, because both ranges contain only one element: 4
console.log(PythonRange.areEqual(range(2), range(3))); // false
```

## `range(...args)`

Returns an instance of `PythonRange` with the specified arguments.

# Supported environments

In order to be able to access numeric properties (e.g. `r[2]`), native `Proxy` support is required (see [compatibility table](https://kangax.github.io/compat-table/es6/#test-Proxy)). If you want to execute your code in environments without `Proxy` support, you can use the `get()` method instead.
