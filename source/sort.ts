// 快速排序
function quickSort(nums: number[]) {
  if (nums.length < 2) {
    return nums
  }
  const baseIndex = Math.floor(nums.length / 2)
  const baseValue = nums[baseIndex]

  const left = []
  const right = []
  for (let i = 0; i < nums.length; ++i) {
    if (i === baseIndex) continue
    if (nums[i] < baseValue) {
      left.push(nums[i])
    } else {
      right.push(nums[i])
    }
  }

  return [...quickSort(left), baseValue, ...quickSort(right)]
}
