// 手写instanceof
function myInstanceOf(left, right) {
  if (typeof right !== 'function') {
    throw new Error('constructor is not Function')
  }
  let proto = Object.getPrototypeOf(left)
  while (proto !== null) {
    if (proto === right.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

// function User(name) {
//     this.name = name;
// }

// const user = new User('winnie');
// const user1 = {name: 'ee'}

// console.log(myInstanceOf(user1, User))
// console.log(myInstanceOf(user, User))

function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new Error('constructor is not Function')
  }
  // 通过Object.create创建对象 执行原型
  const obj = Object.create(constructor.prototype)
  // 执行构造函数
  const result = constructor.apply(obj, args)
  // 如果构造函数返回对象就直接使用，如果没有就使用新创建的对象
  return result instanceof Object ? result : obj
}

function User(name) {
  this.name = name
}

const user = myNew(User, 'winnie')

console.log(user)
