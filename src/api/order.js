import request from '@/utils/request'

export const getOrderList = (page, pageSize, userId, date, phone) => {
  return request.get(`/order/page?page=${page}&pageSize=${pageSize}&id=${userId}&date=${date}&phone=${phone}`)
}

export const getOrderInfo = (data) => {
  return request.get(`/order?orderId=${data}`)
}

export const getDetail = data => {
  return request.get(`/orderDetail/list?orderId=${data}`)
}
