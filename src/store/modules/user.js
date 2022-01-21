// 用户信息及权限相关
const user = {
  namespaced: true,
  state: {
    userInfo: {},
    authorization: undefined,
    groups: [] // 分组
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setAuthorization(state, authorization) {
      state.authorization = authorization
    },
    setGroups(state, groups) {
      state.groups = groups
    }
  },
  actions: {}
}

export default user
