/**
 * 获取元素在页面的垂直位置
 * @param element
 * @returns
 */
export function getElementTop(element: any) {
  let actualTop = element.offsetTop //这是获取元素距父元素顶部的距离
  let current = element.offsetParent //这是获取父元素
  while (current !== null) {
    //当它上面有元素时就继续执行
    actualTop += current.offsetTop //这是获取父元素距它的父元素顶部的距离累加起来
    current = current.offsetParent //继续找父元素
  }
  return actualTop
}

/**
 * 获取元素在页面的垂直位置
 * @param element
 * @returns
 */
export function getElementLeft(element: any) {
  let actualLeft = element.offsetLeft //这是获取元素距父元素顶部的距离
  let current = element.offsetParent //这是获取父元素
  while (current !== null) {
    //当它上面有元素时就继续执行
    actualLeft += current.offsetLeft //这是获取父元素距它的父元素顶部的距离累加起来
    current = current.offsetParent //继续找父元素
  }
  return actualLeft
}
