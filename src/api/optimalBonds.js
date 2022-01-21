import request from '@/utils/request'

const optimalApi = {
  getBondBestPage: '/getBondBestPage', // 最优报价列表
  getTodayTranPage: '/getTodayTranPage', // 今日成交列表
  getBondListPreN: '/getBondListPreN', // 债券代码、名称模糊搜索
  getQuoterList: '/getQuoterList', // 最优报价维护人信息列表
  addScheme: '/addScheme', // 新增方案
  getSchemeList: '/getSchemeList', // 方案列表
  deleteScheme: '/deleteScheme', // 删除方案
  updateScheme: '/updateScheme', // 更新方案
  setHot: '/setHot', // 设置热点债券
  copyFinePrice: '/copyFinePrice', // 复制最优报价
  exportBestPage: '/exportBestPage', // 导出报价
  exportTodayTranPage: '/exportTodayTranPage', // 导出今日成交
  copyTranFromFine: '/copyTranFromFine' // 复制成交
}

export const getBondBestPage = params => {
  return request({
    url: optimalApi.getBondBestPage,
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

export const getBondListPreN = params => {
  return request({
    url: optimalApi.getBondListPreN,
    method: 'get',
    params
  })
}

export const getQuoterList = params => {
  return request({
    url: optimalApi.getQuoterList,
    method: 'get',
    params
  })
}

export const addScheme = params => {
  return request({
    url: optimalApi.addScheme,
    method: 'post',
    data: params
  })
}

export const getSchemeList = params => {
  return request({
    url: optimalApi.getSchemeList,
    method: 'get',
    params
  })
}

export const deleteScheme = params => {
  return request({
    url: optimalApi.deleteScheme,
    method: 'get',
    params
  })
}

export const updateScheme = params => {
  return request({
    url: optimalApi.updateScheme,
    method: 'post',
    data: params
  })
}

export const setHot = params => {
  return request({
    url: optimalApi.setHot,
    method: 'get',
    params
  })
}

export const copyFinePrice = params => {
  return request({
    url: optimalApi.copyFinePrice,
    method: 'get',
    params
  })
}

export const exportBestPage = params => {
  return request({
    url: optimalApi.exportBestPage,
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

export const copyTranFromFine = params => {
  return request({
    url: optimalApi.copyTranFromFine,
    method: 'get',
    params
  })
}
