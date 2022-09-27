import router from '@/router'

let id = '2'
let name = '员工管理'
let path = '/employeeManage'
let flag = false

// let id = ''
// let name = ''
// let path = ''
// let flag = false

const init = function () {
  id = '1'
  name = '首页管理'
  path = '/employee'
  flag = false
  router.push(path)
}
const menuHandle = function (current, isGoback) {
  /**
   * 需要四个参数
   * 1. 目前激活的页面id
   * 2. 跳转的路径
   * 3. 当前页面的路径名称
   * 4. 是否有返回图标
   */
  id = current.id
  name = current.name
  path = current.path
  flag = isGoback
  router.push(path)
}
export default {
  id,
  name,
  path,
  flag,
  init,
  menuHandle
}
