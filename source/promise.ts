// 手写 Promise
class MyPromise {
  constructor(executor) {
    this.state = 'pending' // pending, fulfilled, rejected
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 处理值穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.state === 'fulfilled') {
        handleFulfilled()
      } else if (this.state === 'rejected') {
        handleRejected()
      } else if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(handleFulfilled)
        this.onRejectedCallbacks.push(handleRejected)
      }
    })

    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason
        })
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = []
      let count = 0

      if (promises.length === 0) {
        resolve(results)
        return
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then((value) => {
          results[index] = value
          count++
          if (count === promises.length) {
            resolve(results)
          }
        }, reject)
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve, reject)
      })
    })
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      const results = []
      let count = 0

      const processResult = (index, status, value) => {
        results[index] = { status, value }
        count++
        if (count === promises.length) {
          resolve(results)
        }
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => processResult(index, 'fulfilled', value),
          (reason) => processResult(index, 'rejected', reason)
        )
      })
    })
  }
}

// 三种状态：pending、fulfilled、rejected
// 链式调用：then 方法返回新的 Promise
// 异步执行：使用 queueMicrotask 确保异步
// 值穿透：非函数的 onFulfilled/onRejected 会被忽略
// Promise 解析：处理 thenable 对象和循环引用
// 静态方法：resolve、reject、all、race、allSettled
// 处理 thenable 对象和循环引用

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  if (x instanceof MyPromise) {
    x.then((value) => resolvePromise(promise2, value, resolve, reject), reject)
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    let called = false

    try {
      then = x.then
    } catch (error) {
      reject(error)
      return
    }

    if (typeof then === 'function') {
      try {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        if (!called) {
          reject(error)
        }
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
