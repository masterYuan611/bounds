import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import newBonds from './modules/newBonds'
import app from './modules/app'
import socket from './modules/socket'
import transcation from './modules/transcation'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    socket,
    newBonds,
    transcation
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
  plugins: [
    createPersistedState({
      paths: [
        'user.userInfo',
        'user.authorization',
        'user.groups',
        'app.searchHistory',
        'app.cachedPath'
      ],
      storage: window.localStorage
    })
  ]
})
