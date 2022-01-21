// 新增报价
const newBonds = {
  namespaced: true,
  state: {
    newBondsList: [],
    myBondsList: [],
  },
  mutations: {
    setNewBondsList(state, newBondsList) {
      state.newBondsList = newBondsList
    },
    setMyBondsList(state, myBondsList) {
      state.myBondsList = myBondsList
    },
  },
  actions: {}
}

export default newBonds
