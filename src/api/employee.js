import request from '@/utils/request'

export const addEmployee = function (params) {
  return request.post('/employee', params)
}
