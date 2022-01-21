import request from '@/utils/request'

const optimalApi = {
  getBondPriceDetailByCode: '/getBondPriceDetailByCode', // 详情报价列表
  getPriceIncludeGranList: '/getPriceIncludeGranList', // 详情成交列表
  exportDetailBestPage: '/exportDetailBestPage', // 导出最优报价
  exportPriceIncludeGranList: '/exportPriceIncludeGranList' // 导出报价列表
}

export const getBondPriceDetailByCode = params => {
  return request({
    url: optimalApi.getBondPriceDetailByCode,
    method: 'get',
    params
  })
}

export const getPriceIncludeGranList = params => {
  return request({
    url: optimalApi.getPriceIncludeGranList,
    method: 'post',
    data: params
  })
}

export const exportDetailBestPage = params => {
  return request({
    url: optimalApi.exportDetailBestPage,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}

export const exportPriceIncludeGranList = params => {
  return request({
    url: optimalApi.exportPriceIncludeGranList,
    method: 'post',
    data: params,
    responseType: 'arraybuffer'
  })
}
