import request from '@/utils/request'

export const login = data => {
  return request.post('/employee/login', data)
}
