import request from '@/utils/request'

// 登录
export const login = data => {
  return request.post('/employee/login', data)
}

// 退出
export const logout = () => {
  return request.post('/employee/logout')
}
