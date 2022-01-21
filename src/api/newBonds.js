import request from '@/utils/request'

const optimalApi = {
  toDistinguish: '/parseTemplate',
  getBondInfo: '/getBondInfoByCode',
  toRelease: '/addBondPrice',
  getNewBondInfo: '/copyFinePriceSkip',
}

// 2.3识别
export const toDistinguish = params => {
  return request({
    url: optimalApi.toDistinguish,
    method: 'post',
    data: params
  })
}
// 2.13获取证券信息
export const getBondInfo = params => {
  return request({
    url: optimalApi.getBondInfo,
    method: 'get',
    params
  })
}
// 2.4发布
export const toRelease = params => {
  return request({
    url: optimalApi.toRelease,
    method: 'post',
    data: params
  })
}
// 2.33获取复制新增的报价数据
export const getNewBondInfo = params => {
  return request({
    url: optimalApi.getNewBondInfo,
    method: 'get',
    params
  })
}
