import request from '@/utils/request'

const optimalApi = {
  getOldBondsList: '/getHisPricePage',
  exportBond: '/exportHisPricePage',
}

// 2.10查询历史报价列表
export const getOldBondsList = params => {
  return request({
    url: optimalApi.getOldBondsList,
    method: 'post',
    data: params
  })
}
// 2.37.7导出历史报价
export const exportBond = params => {
  return request({
    url: optimalApi.exportBond,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
