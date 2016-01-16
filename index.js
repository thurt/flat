var flat = flatten
flat.flatten = flatten
flat.unflatten = unflatten

module.exports = flat

flatten.getDefaults = function () {
  return {
    delimiter: '.',
    maxDepth: Number.MAX_VALUE,
    safe: false
  }
}

unflatten.getDefaults = function () {
  return {
    delimiter: '.',
    overwrite: false,
    object: false
  }
}

function flatten (target, opts) {
  opts = Object.assign(flatten.getDefaults(), opts)

  var currentDepth = 1
  var output = {}

  function step (object, prev) {
    Object.keys(object).forEach(function (key) {
      var value = object[key]
      var isarray = opts.safe && Array.isArray(value)
      var type = Object.prototype.toString.call(value)
      var isbuffer = isBuffer(value)
      var isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      )

      var newKey = prev
        ? prev + opts.delimiter + key
        : key

      if (!isarray && !isbuffer && isobject && Object.keys(value).length && currentDepth < opts.maxDepth) {
        ++currentDepth
        return step(value, newKey)
      }

      output[newKey] = value
    })
  }

  step(target, undefined)

  return output
}

function unflatten (target, opts) {
  opts = Object.assign(unflatten.getDefaults(), opts)

  var result = {}

  var isbuffer = isBuffer(target)
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey (key) {
    var parsedKey = Number(key)

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1
    ) ? key
      : parsedKey
  }

  Object.keys(target).forEach(function (key) {
    var split = key.split(opts.delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      )

      if ((opts.overwrite && !isobject) || (!opts.overwrite && recipient[key1] === undefined)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        )
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts)
  })

  return result
}

function isBuffer (value) {
  if (typeof Buffer === 'undefined') return false
  return Buffer.isBuffer(value)
}
