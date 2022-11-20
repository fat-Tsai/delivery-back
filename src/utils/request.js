import axios from 'axios'
// import store from '@/store'
import router from '@/router'
// 引入消息提示
import { Message } from 'element-ui'

const request = axios.create({
  // baseURL: 'http://localhost:9979'
  baseURL: '/api', // 测试环境下跨域
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (sessionStorage.getItem('userInfo')) { // 修改登录逻辑，JSON.parse()遇到不存在会报错，导致请求无法发送
      const token = JSON.parse(sessionStorage.getItem('userInfo')).token
      config.headers.token = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(res => {
  const code = res.data.code
  const msg = res.data.msg
  if (code === 0 && msg === 'Not login') { // 未登录状态，无法访问后台
    localStorage.removeItem('userInfo')
    Message({
      message: '暂未登录,没有权限',
      type: 'error',
      duration: 3000
    })
    router.replace('/login')
  } else if (code === 401) { // token失效，重新登录
    router.replace('/login')
  } else {
    return res.data
  }
},
error => {
  console.log(error)
  return Promise.reject(error)
}
)

export default request
