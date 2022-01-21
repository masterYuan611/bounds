// websocket推送相关
const socket = {
  namespaced: true,
  state: {
    socket: {
      state: '', // 1 成功 2 正在连接 3 失败
      text: ''
    },
    socketDataList: []
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket
    },
    setSocketDataList(state, socketDataList) {
      state.socketDataList = socketDataList
    }
  },
  actions: {}
}

export default socket
