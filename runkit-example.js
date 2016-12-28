const { default: range } = require('python-range');

const r = range(10);
console.log(Array.from(r)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(r.get(3)); // 3
console.log(r.length); // 10

console.log(Array.from(range(2, 5))); // [2, 3, 4]
console.log(Array.from(range(5, 0, -1))); // [5, 4, 3, 2, 1]
