// 成交
const transcation = {
  namespaced: true,
  state: {
    transcationList: []
  },
  mutations: {
    setTranscationList(state, transcationList) {
      state.transcationList = transcationList
    },
  },
  actions: {}
}
export default transcation
