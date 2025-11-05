// debounce加完整的类型校验
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: number | null = null
  return ((...args) => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as T
}

// const fn = (a: number, b: number) => console.log(a+b)
// const debounceFn = debounce(fn, 300)

// 节流函数
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer = null
  return function (...args) {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  } as T
}
