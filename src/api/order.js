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

export const getTypeNum = (type, time) => {
  return request.get(`order/type?type=${type}&time=${time}`)
}

// 首页的七日订单
export const getSevenNum = () => {
  return request.get('order/getSevenDate')
}
