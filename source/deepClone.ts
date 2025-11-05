// 手写Promise  解决循环引用问题
const deepClone = (obj, hash = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  } else {
    if (Array.isArray(obj)) {
      const newArr = []
      if (hash.has(obj)) {
        return hash.get(obj)
      }
      hash.set(obj, newArr)
      for (let i = 0; i < obj.length; i++) {
        newArr.push(deepClone(obj[i], hash))
      }
      return newArr
    } else {
      const newObj = {}
      if (hash.has(obj)) {
        return hash.get(obj)
      }
      hash.set(obj, newObj)
      for (let key in obj) {
        newObj[key] = deepClone(obj[key], hash)
      }
      return newObj
    }
  }
}

const obj = { a: 1, b: { c: 2 }, c: { d: 3 } }
obj.c = obj
const newObj = deepClone(obj)
console.log('obj', obj)
console.log('newObj', newObj)
console.log('newObj.c ', newObj.c)
