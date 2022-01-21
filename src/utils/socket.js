import store from '@/store'
import { Modal } from 'ant-design-vue'

// 1 成功 2 正在连接 3 失败
const state = {
  success: {
    state: '1',
    text: '服务已连接'
  },
  connecting: {
    state: '2',
    text: '服务正在重连'
  },
  fail: {
    state: '3',
    text: '服务异常'
  }
}

class Socket {
  websock = null
  wsuri = ''
  heartTimer = null
  socketTimer = null
  expiredNum = 0

  init(code, token, mark) {
    if (this.websock) {
      this.websock.close()
    }
    if (token) {
      this.wsuri = `${process.env.VUE_APP_SOCKET_API}/${code}/${mark}/${token}`
    }
    this.websock = new WebSocket(this.wsuri)
    this.websock.onmessage = e => {
      try {
        store.commit('socket/setSocketDataList', JSON.parse(e.data))
        console.log(store.getters.socketDataList, 'kkkk')
      } catch (error) {
        console.log(e.data, '111')
        if (e.data.includes('过期')) {
          this.expiredNum++
          if (this.expiredNum > 3) {
            Modal.confirm({
              content: '应用闲置超时，请重新登录！',
              cancelText: '取消',
              okText: '确定',
              icon: 'exclamation-circle',
              class: 'expired',
              onOk() {
                window.close()
              },
              onCancel() {}
            })
          }
        }
        if (e.data.includes('成功')) {
          this.expiredNum = 0
        }
      }
    }
    this.websock.onclose = e => {
      this.reconnect(e)
    }
    this.websock.onopen = () => {
      this.websocketOpen()
    }
    this.websock.onerror = () => {
      this.reconnect()
      console.log('WebSocket连接发生错误')
    }
  }

  websocketOpen(e) {
    store.commit('socket/setSocket', state.success)
  }

  websocketsend(agentData) {
    this.websock.send(agentData)
  }

  reconnect(e) {
    if (this.expiredNum > 3) return
    if (store.getters.socket.state !== '3') {
      store.commit('socket/setSocket', state.connecting)
    }
    clearTimeout(this.socketTimer)
    this.socketTimer = setTimeout(() => {
      this.init()
    }, 3000)
    console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
  }

  sendSock(agentData) {
    const { readyState, OPEN } = this.websock
    if (readyState === OPEN) {
      // 若是ws开启状态
      this.websocketsend(agentData)
    } else {
      // 非开启状态 ，则等待1s后重新调用
      setTimeout(() => {
        this.sendSock(agentData)
      }, 1000)
    }
  }

  heart() {
    clearInterval(this.heartTimer)
    this.heartTimer = setInterval(() => {
      if (store.getters.socket.state === '3') {
        return
      }
      this.sendSock('ping')
    }, 20000)
  }
}

export default new Socket()
