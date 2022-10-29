import request from '@/utils/request'

export const addDish = params => {
  return request.post('/dish', params)
}

export const getDishList = (page, pageSize, name) => {
  return request.get(`/dish/page?page=${page}&pageSize=${pageSize}&name=${name}`)
}

export const getDishInfo = id => {
  return request.get(`/dish/${id}`)
}

export const updateDish = params => {
  return request.put('/dish', params)
}

export const changeDishStatus = (params) => {
  return request.post(`/dish/status/${params.status}?ids=${params.ids}`)
}

export const deleteDish = id => {
  return request.delete(`/dish?ids=${id}`)
}
