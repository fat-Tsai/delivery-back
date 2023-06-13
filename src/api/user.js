import request from '@/utils/request'

export const getUserList = (page, pageSize, name, phone) => {
  return request.get(`/user/page?page=${page}&pageSize=${pageSize}&name=${name}&phone=${phone}`)
}
