import request from '@/utils/request'

const settingApi = {
  getSetupPage: '/getSetupPage', // 取得系统设置页面信息
  saveUserSetup: '/saveUserSetup', // 保存系统用户设置
  saveHideOrg: '/saveHideOrg' // 保存隐藏我填报数据中的机构名称
}

// 取得系统设置页面信息
export const getSetupPage = params => {
  return request({
    url: settingApi.getSetupPage,
    method: 'get',
    params
  })
}

// 保存系统用户设置
export const saveUserSetup = params => {
  return request({
    url: settingApi.saveUserSetup,
    method: 'post',
    data: params
  })
}

// 保存隐藏我填报数据中的机构名称
export const saveHideOrg = params => {
  return request({
    url: settingApi.saveHideOrg,
    method: 'post',
    data: params
  })
}
