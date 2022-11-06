import request from '@/utils/request'
import axios from 'axios'

export const getUploadToken = () => {
  return request.get('/common/getup')
}

export const up2QiNiu = (domain, formdata, config) => {
  axios.post(domain, formdata, config)
}
