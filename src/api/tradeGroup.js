import request from '@/utils/request'

const optimalApi = {
  getGroupPriceList: '/getGroupPriceList', // 交易组报价列表
  getTodayTranPage: '/getTodayTranPage', // 交易组成交列表
  exportGroupPriceList: '/exportGroupPriceList', // 导出报价
  exportTodayTranPage: '/exportTodayTranPage', // 导出今日成交
  getGroupQuoterList: '/getGroupQuoterList'
}

export const getGroupPriceList = params => {
  return request({
    url: optimalApi.getGroupPriceList,
    method: 'post',
    data: params
  })
}

export const getTodayTranPage = params => {
  return request({
    url: optimalApi.getTodayTranPage,
    method: 'post',
    data: params
  })
}

export const exportGroupPriceList = params => {
  return request({
    url: optimalApi.exportGroupPriceList,
    method: 'post',
    data: params,
    responseType: 'arraybuffer'
  })
}
export const exportTodayTranPage = params => {
  return request({
    url: optimalApi.exportTodayTranPage,
    method: 'post',
    data: params,
    responseType: 'arraybuffer'
  })
}

export const getGroupQuoterList = params => {
  return request({
    url: optimalApi.getGroupQuoterList,
    method: 'get',
    params
  })
}
