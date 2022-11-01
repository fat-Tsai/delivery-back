import request from '@/utils/request'

export const addSetmeal = params => {
  return request.post('/setmeal', params)
}

export const getSetmealList = (page, pageSize, name) => {
  return request.get(`/setmeal/page?page=${page}&pageSize=${pageSize}&name=${name}`)
}

export const getSetmealInfo = id => {
  return request.get(`/setmeal/${id}`)
}

export const updateSetmealInfo = params => {
  return request.put('/setmeal', params)
}

export const updateSetmealStatus = (params) => {
  return request.post(`/setmeal/status/${params.status}?ids=${params.ids}`)
}

export const deleteSetmeal = ids => {
  return request.delete(`/setmeal?ids=${ids}`)
}
