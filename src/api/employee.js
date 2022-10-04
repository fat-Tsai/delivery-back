import request from '@/utils/request'

// 添加员工
export const addEmployee = (params) => {
  return request.post('/employee', params)
}

// 获取员工列表
export const getEmployeeList = (page, pageSize, name) => {
  return request.get('/employee/page?page=' + page + '&pageSize=' + pageSize + '&name=' + name)
}

// 修改员工状态 || 修改员工信息
export const editEmployee = params => {
  return request.put('/employee', params)
}

// 查询员工信息
export const queryEmployeeById = id => {
  return request.get(`employee/${id}`)
}
