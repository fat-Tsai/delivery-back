import request from '@/utils/request'

// 添加菜品/分类
export const addCategory = params => {
  return request.post('/category', params)
}

// 查询分类列表
export const getCategotyList = (page, pageSize) => {
  return request.get(`/category/page?page=${page}&pageSize=${pageSize}`)
}

// 删除分类
export const delCategory = (id) => {
  return request.delete(`/category/${id}`)
}

// 修改分类信息
export const updateCategory = params => {
  return request.put('/category', params)
}
