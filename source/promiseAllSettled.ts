// 手写Promise.allSettled

// 定义类型
type FulfilledResult<T> = {
  status: 'fulfilled'
  value: T
}

type RejectedResult = {
  status: 'rejected'
  reason: any
}

type SettlementResult<T> = FulfilledResult<T> | RejectedResult

// 返回所有的promise结果 不管成功还是失败
function promiseAllSettled<T>(promises: Promise<T>[]): Promise<Array<SettlementResult<T>>> {
  return new Promise((resolve) => {
    const result: Array<SettlementResult<T>> = new Array(promises.length)
    let doneCount = 0
    for (let i = 0; i < promises.length; ++i) {
      promises[i]
        .then((value) => {
          result[i] = {
            status: 'fulfilled',
            value,
          }
        })
        .catch((reason) => {
          result[i] = {
            status: 'rejected',
            reason,
          }
        })
        .finally(() => {
          doneCount++
          if (promises.length === doneCount) {
            resolve(result)
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

const p3 = Promise.reject('fail')

promiseAllSettled([p1, p2, p3]).then((res) => {
  console.log('res', res)
})
