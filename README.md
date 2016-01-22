# flat [![Build Status](https://secure.travis-ci.org/thurt/flat.png?branch=master)](http://travis-ci.org/thurt/flat) [![codecov.io](https://codecov.io/github/thurt/flat/coverage.svg?branch=devel)](https://codecov.io/github/thurt/flat?branch=devel) [![js-standard-style](https://camo.githubusercontent.com/3c9082cfba1231e4340eee8c17fefc5ee24d5e2f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d7374616e646172642d627269676874677265656e2e737667)](http://standardjs.com/)
Take a nested Javascript object and flatten it, or unflatten an object with
delimited keys.

## Installation

``` bash
$ npm install flat
```

## Methods

### flatten(original, options)

Flattens the object - it'll return an object one level deep, regardless of how
nested the original object was:

``` javascript
var flatten = require('flat')

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
})

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a.b.c': 2
// }
```

### unflatten(original, options)

Flattening is reversible too, you can call `flatten.unflatten()` on an object:

``` javascript
var unflatten = require('flat').unflatten

unflatten({
    'three.levels.deep': 42,
    'three.levels': {
        nested: true
    }
})

// {
//     three: {
//         levels: {
//             deep: 42,
//             nested: true
//         }
//     }
// }
```

## Options

### delimiter

Use a custom delimiter for (un)flattening your objects, instead of `.`.

### safe

When enabled, both `flat` and `unflatten` will preserve arrays and their
contents. This is disabled by default.

``` javascript
var flatten = require('flat')

flatten({
    this: [
        { contains: 'arrays' },
        { preserving: {
              them: 'for you'
        }}
    ]
}, {
    safe: true
})

// {
//     'this': [
//         { contains: 'arrays' },
//         { preserving: {
//             them: 'for you'
//         }}
//     ]
// }
```

### object

When enabled, arrays will not be created automatically when calling unflatten, like so:

``` javascript
unflatten({
    'hello.you.0': 'ipsum',
    'hello.you.1': 'lorem',
    'hello.other.world': 'foo'
}, { object: true })

// hello: {
//     you: {
//         0: 'ipsum',
//         1: 'lorem',
//     },
//     other: { world: 'foo' }
// }
```

### overwrite

When enabled, existing keys in the unflattened object may be overwritten if they cannot hold a newly encountered nested value:

```javascript
unflatten({
    'TRAVIS': 'true',
    'TRAVIS_DIR': '/home/travis/build/kvz/environmental'
}, { overwrite: true })

// TRAVIS: {
//     DIR: '/home/travis/build/kvz/environmental'
// }
```

Without `overwrite` set to `true`, the `TRAVIS` key would already have been set to a string, thus could not accept the nested `DIR` element.

This only makes sense on ordered arrays, and since we're overwriting data, should be used with care.

### `objectEnpoints: true || false`

**flat** *IN*
```javascript
{
  a: {
    b: {
      c: 1
    }
  }
}
```
**flat** *OUT*
```javascript
{
  a: null,
  'a.b': null,
  'a.b.c': 1
}
```

### `maxDepth: n`

**flat** *IN*
``` javascript
-> maxDepth: 2
{
  a: { b: 1 },
  c: { d: 2 },
  e: { f: { g: { h: 3 } } }
}
```
**flat** *OUT*
```javascript
{
  'a.b': 1,
  'c.d': 2,
  'e.f': { g: { h: 3 } }
}
```
