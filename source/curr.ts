// 函数柯里化
function curr<T extends (...args: any[]) => any>(fn: T, ...args: any[]): T {
  return ((...args2) => {
    return fn.apply(null, [...args, ...args2])
  }) as T
}

// 本质上是将多参数函数转换为单参数函数
// 传入被柯里化的函数
function curry(fn) {
  return function curried(...args) {
    // 如果传入的参数数量 >= 原函数参数数量，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      // 否则返回一个新函数，等待剩余参数
      return function (...nextArgs) {
        return curried.apply(this, [...args, ...nextArgs])
      }
    }
  }
}

// 测试
function multiply(a, b, c) {
  return a * b * c
}

const curriedMultiply = curry(multiply)

console.log(curriedMultiply(2)(3)(4)) // 24
console.log(curriedMultiply(2, 3)(4)) // 24
console.log(curriedMultiply(2)(3, 4)) // 24
console.log(curriedMultiply(2, 3, 4)) // 24

// 参数复用
const double = curriedMultiply(2)
console.log(double(3)(4)) // 24
console.log(double(5)(6)) // 60
