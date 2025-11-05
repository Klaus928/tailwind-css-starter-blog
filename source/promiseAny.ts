// 返回第一个兑现成功的promise  如果全部失败就rejected
function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; ++i) {
      let count = 0
      promises[i]
        .then((value) => {
          resolve(value)
        })
        .catch((err) => {
          count++
          if (count === promises.length) {
            reject(err)
          }
        })
    }
  })
}

const p3 = Promise.reject('fail')

promiseAny([p3, p3])
  .then((res) => {
    console.log('res', res)
  })
  .catch((e) => {
    console.error(e)
  })
