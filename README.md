# range
A JavaScript implementation of the Python's `range()` function.

# Examples

## Basic usage

```
import range from 'python-range';

const r = range(10);
console.log(r); // range(0, 10, 1)
console.log(Array.from(r)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(r[3]); // 3
console.log(r.length); // 10

console.log(Array.from(range(2, 5))); // [2, 3, 4]
console.log(Array.from(range(5, 0, -1))); [5, 4, 3, 2, 1]
```

## Iteration

```
const r = range(3, 6);
for (const n of r) {
  console.log(n); // logs 3, 4 and 5
}
for (const i in r) {
  console.log([i, r[r]]); // logs [0, 3], [1, 4] and [2, 5]
}
```

## Lazy evaluation

Unlike other range modules, `python-range` has lazy evaluation.

See [Why is “1000000000000000 in range(1000000000000001)” so fast in Python 3?](http://stackoverflow.com/q/30081275/3853934)

```
console.log(range(1000000000000001).includes(1000000000000000)); // true
console.log(range(0, 1000000000000000000001, 10).includes(1000000000000000000000)); // true
console.log(range(0, -1000000000, -3)[12345678]; // -37037034
```

# Documentation

## Exported values

`python-range` exports two values: a `PythonRange` class, and a `range` function (a default export), which returns a `PythonRange` object.

```
import range, {PythonRange} from 'python-range';
console.log(range(10) instanceof PythonRange); // true
```

## `new PythonRange(<int> start, <int> stop[, <int> step])`

The `PythonRange` constructor creates a range starting with `start` (inclusive) and ending with `stop` (exclusive). The `step` parameter defaults to `1` and specifies the distance between two elements. The `step` parameter must be different than `0`.

## `new PythonRange(<int> stop)`

When called with only one argument, the `start` parameter defaults to `0` and the passed argument becomes `stop`.

```
const r = range(3);
console.log(r.start); // 0
console.log(r.stop); // 3
```

## `start`, `stop` and `step` properties

The `PythonRange` constructor creates these properties based on the arguments passed to the constructor, or the default values. These properties can are writable, and changing them automatically updates the range.

```
const r = range(5);
console.log(Array.from(r)); // [0, 1, 2, 3, 4]
r.step = 2;
console.log(Array.from(r)); // [0, 2, 4]
```

## `length` property

The `length` property specifies the number of elements in the range. It's updated automatically when the `start`, `stop` and `step` properties are changed.

```
const r = range(5);
console.log(r.length); // 5
r.stop = 3;
console.log(r.length); // 3
```

## `PythonRange.prototype.includes(<int> value)`

Returns `true` if the range contains the specified value; otherwise returns `false`.

```
console.log(range(3, 5).includes(3)); // true
console.log(range(10)).includes(10); // false
```

## `PythonRange.prototype.min()`

Returns the smallest value in the range.

```
console.log(range(10).min()); // 0
console.log(range(0, -15, -1).min()); // -15
```

## `PythonRange.prototype.max()`

Returns the largest value in the range.

```
console.log(range(10).max()); // 9
console.log(range(12, 0, -2).max()); // 12
```

## `PythonRange.prototype.reverse()`

Reverses the range in-place and returns it.

```
console.log(range(2, 5).reverse()); // range(4, 1, -1)
console.log(range(10, 0, -1).reverse()); // range(1, 10, 1)
```

## `PythonRange.prototype.toString()`

Returns a string `range(<start>, <stop>, <step>)`, where `<start>`, `<stop>` and `<step>` are the `start`, `stop` and `step` properties of the range.

```
console.log(range(3, 6, 2)); // range(3, 6, 2)
```

## `PythonRange.prototype.valueOf()`

Returns the result of the `toString()` method.

## `PythonRange.prototype[@@iterator]()`

Returns the result of calling `Array.prototype.values()` on the range.

## `PythonRange.areEqual(<PythonRange> a, <PythonRange> b)`

Returns `true` if the passed arguments are equal; otherwise returns `false`. Two ranges are considered equals if they contain the same set of values. For example, `range(3, 3)` and `range(0)` are equal, because they're both empty ranges. `range(4, 5, 2)` and `range(4, 6, 3)` are equal too, because they both contain only one element: `4`.

```
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

`python-range` works in every environment which supports [`Proxy`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy), i.e. Microsoft Edge 12+, Mozilla Firefox 42+, Google Chrome 49+, Safari 10+ and Node.js 6+.
