const getters = {
  authorization: state => state.user.authorization,
  userInfo: state => state.user.userInfo,
  groups: state => state.user.groups,
  currentPath: state => state.app.currentPath,
  cachedPath: state => state.app.cachedPath,
  isCtrl: state => state.app.isCtrl,
  isShift: state => state.app.isShift,
  searchHistory: state => state.app.searchHistory,
  newBondsList: state => state.newBonds.newBondsList,
  myBondsList: state => state.newBonds.myBondsList,
  socketDataList: state => state.socket.socketDataList,
  socket: state => state.socket.socket,
  transcationList: state => state.transcation.transcationList
}

export default getters
