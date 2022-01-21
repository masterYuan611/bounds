import request from '@/utils/request'

const transactionDetailApi = {
  getTranPage: '/getTranPage', // 查询成交明细列表
  getOrgList: '/getOrgList', // 查询机构列表
  getCustomerList: '/getCustomerList', // 查询指定机构的交易员列表
  delMyselfTran: '/delMyselfTran', // 撤销我的成交
  exportTranPage: '/exportTranPage' // 导出成交明细
}

export const getTranPage = params => {
  return request({
    url: transactionDetailApi.getTranPage,
    method: 'post',
    data: params
  })
}

export const getOrgList = params => {
  return request({
    url: transactionDetailApi.getOrgList,
    method: 'get',
    params
  })
}

export const getCustomerList = params => {
  return request({
    url: transactionDetailApi.getCustomerList,
    method: 'get',
    params
  })
}

export const delMyselfTran = params => {
  return request({
    url: transactionDetailApi.delMyselfTran,
    method: 'get',
    params
  })
}

export const exportTranPage = params => {
  return request({
    url: transactionDetailApi.exportTranPage,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
