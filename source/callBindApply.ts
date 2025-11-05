// 手写bind
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.myBind - what is trying to be bound is not callable')
  }
  const self = this
  return function (...newArgs) {
    return self.apply(context, [...args, ...newArgs])
  }
}

// 手写apply
Function.prototype.myApply = function (context, args) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.myApply - what is trying to be bound is not callable')
  }
  const self = this
  return self.call(context, ...args)
}

// 手写call
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.myCall - what is trying to be bound is not callable')
  }
  const self = this
  return self.apply(context, args)
}
