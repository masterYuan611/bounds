// 页面操作相关
const app = {
  namespaced: true,
  state: {
    currentPath: '', // 当前路由
    cachedPath: [], // 标签栏
    isCtrl: false, // 按住ctrl键
    isShift: false, // 按住shift键
    searchHistory: [] // 债券搜索记录
  },
  mutations: {
    setCurrentPath(state, currentPath) {
      state.currentPath = currentPath
    },
    setCachedPath(state, { path, flag }) {
      const index = state.cachedPath.findIndex(item => item.path === path.path)
      const fixedNav = [
        '/layout/optimalBonds',
        '/layout/tradeGroup',
        '/layout/myBonds'
      ]
      if (flag === 'add') {
        if (index > -1 || fixedNav.includes(path.path)) return // 不能重复添加,且最优报价，交易组报价，我的报价固定在navbar前三
        if (state.cachedPath.length >= 11) {
          state.cachedPath.shift()
        }
        state.cachedPath.push(path)
      } else if (flag === 'remove') {
        if (index === -1) return
        state.cachedPath.splice(index, 1)
      }
    },
    updateCachedPath(state, cachedPath) {
      state.cachedPath = cachedPath
    },
    setIsCtrl(state, isCtrl) {
      state.isCtrl = isCtrl
    },
    setIsShift(state, isShift) {
      state.isShift = isShift
    },
    setSearchHistory(state, code) {
      const index = state.searchHistory.findIndex(
        item => item.code === code.code
      )
      if (index > -1) {
        state.searchHistory.splice(index, 1)
        state.searchHistory.unshift(code)
        return
      }
      if (state.searchHistory.length < 5) {
        state.searchHistory.unshift(code)
      } else {
        state.searchHistory.pop()
        state.searchHistory.unshift(code)
      }
    }
  },
  actions: {}
}

export default app
