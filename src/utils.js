function clone(target, source) {
  var out = {}
  for (var i in target) out[i] = target[i]
  for (var j in source) out[j] = source[j]
  return out
}

module.exports = {
  clone: clone
}
