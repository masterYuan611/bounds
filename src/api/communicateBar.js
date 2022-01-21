import request from '@/utils/request'

const optimalApi = {
  getDiscussPage: '/getDiscussPage', // 查询交流动态列表
  addDiscuss: '/addDiscuss', // 新增交流
  topDiscuss: '/topDiscuss', // 置顶/取消置顶交流
}

// 查询交流动态列表
export const getDiscussPage = params => {
  return request({
    url: optimalApi.getDiscussPage,
    method: 'post',
    data: params
  })
}
// 新增交流
export const addDiscuss = params => {
  return request({
    url: optimalApi.addDiscuss,
    method: 'post',
    data: params
  })
}

// 置顶/取消置顶交流
export const topDiscuss = params => {
  return request({
    url: optimalApi.topDiscuss,
    method: 'get',
    params
  })
}
