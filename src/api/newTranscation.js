import request from '@/utils/request'

const optimalApi = {
  parseTranList: '/parseTranList',
  addTranBatch: '/addTranBatch',
  getBondInfoByName: '/getBondInfoByName'
}

// 2.17. 成交模版解析 - 智能识别
export const parseTranList = params => {
  return request({
    url: optimalApi.parseTranList,
    method: 'post',
    data: params
  })
}

// 2.18. 批量新增成交
export const addTranBatch = params => {
  return request({
    url: optimalApi.addTranBatch,
    method: 'post',
    data: params
  })
}

// 2.12. 通过债券名称得到债券详细信息
export const getBondInfoByName = params => {
  return request({
    url: optimalApi.getBondInfoByName,
    method: 'get',
    params
  })
}
