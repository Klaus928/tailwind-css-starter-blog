// 返回第一个兑现结束的promise 无论成功还是失败
function promiseRace<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; ++i) {
      promises[i]
        .then((value) => {
          resolve(value)
        })
        .catch((reason) => {
          reject(reason)
        })
    }
  })
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 2000)
})

const p3 = Promise.reject('fail')

promiseRace([p1, p2, p3]).then((res) => {
  console.log('res', res)
})
