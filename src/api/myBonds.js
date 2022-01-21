import request from '@/utils/request'

const optimalApi = {
  getMyBondsList: '/getMyPricePage',
  quotePrice: '/updateBondPrice',
  revokePrice: '/delBondPrice',
  exportBond: '/exportMyPricePage',
}

// 2.8查询我的报价列表
export const getMyBondsList = params => {
  return request({
    url: optimalApi.getMyBondsList,
    method: 'post',
    data: params
  })
}
// 2.5修改报价
export const quotePrice = params => {
  return request({
    url: optimalApi.quotePrice,
    method: 'post',
    data: params
  })
}
// 2.6撤销报价
export const revokePrice = params => {
  return request({
    url: optimalApi.revokePrice,
    method: 'get',
    params
  })
}
// 2.37.6导出我的报价
export const exportBond = params => {
  return request({
    url: optimalApi.exportBond,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
