import request from '@/utils/request'

const userApi = {
  login: '/loginUser', // 用户登录
  getGroupList: '/getGroupList', // 分组列表
  heart: '/heart'
}

export const login = params => {
  return request({
    url: userApi.login,
    method: 'get',
    params
  })
}

export const getGroupList = () => {
  return request({
    url: userApi.getGroupList,
    method: 'get'
  })
}
export const heart = () => {
  return request({
    url: userApi.heart,
    method: 'get'
  })
}
