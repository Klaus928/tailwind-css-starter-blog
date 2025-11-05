// 手写Promise.all
const promiseAll = (promises: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    const results = []
    let count = 0
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((res) => {
          console.log('res', res)
          results[i] = res
          count++
          if (count === promises.length) {
            resolve(results)
          }
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

// 手写Promise.race： 任意一个 Promise 实例率先改变状态，就会触发 Promise.race 的回调
const promiseRace = (promises: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

// 手写Promise.any： 任意一个 Promise 实例率先改变状态为成功，就会触发 Promise.any 的回调
const promiseAny = (promises: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    let count = 0
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((res) => {
          resolve(res)
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

promiseAll([p1, p2]).then((res) => {
  console.log('res', res)
})
