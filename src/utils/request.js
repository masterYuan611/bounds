import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import {
  message as Message,
  notification as Notification
} from 'ant-design-vue'

Message.config({
  maxCount: 1
})

const pendingRequest = new Map()

const generateReqKey = config => {
  const { method, url, params, data } = config
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}

const addPendingRequest = config => {
  const requestKey = generateReqKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel)
      }
    })
}

const removePendingRequest = config => {
  const requestKey = generateReqKey(config)
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey)
    cancelToken(requestKey)
    pendingRequest.delete(requestKey)
  }
}

// 异常拦截处理器
const errorHandler = error => {
  const errorInfo = error.toJSON()
  if (
    errorInfo.message === 'Network Error' &&
    errorInfo.config.url !== '/heart'
  ) {
    Message.error('网络异常Network Error')
  }
  if (error.response) {
    const { status, config, data } = error.response
    if (status === 500) {
      Notification.error({
        message: `${config.baseURL}${config.url}`,
        description: `${data.error}\n${data.message}`,
        style: {
          width: '400px',
          marginLeft: '-200px'
        }
      })
    }
  }
}

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

instance.interceptors.request.use(
  config => {
    removePendingRequest(config) // 检查是否存在重复请求，若存在则取消已发的请求
    addPendingRequest(config) // 把当前请求信息添加到pendingRequest对象中

    const authorization = store.getters.authorization
    if (authorization) {
      config.headers.Authorization = authorization
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    removePendingRequest(response.config) // 从pendingRequest对象中移除请求
    const res = response.data
    // 导出接口
    if (response.config.responseType === 'arraybuffer') {
      return res
    }
    // 正常json接口
    const { status, message } = res
    // 所有接口status为0时表示失败
    if (status === '0') {
      Message.error(message)
      return Promise.reject(new Error())
    }
    return res
  },
  error => {
    removePendingRequest(error.config || {}) // 从pendingRequest对象中移除请求
    if (axios.isCancel(error)) {
      console.log('已取消的重复请求：' + error.message)
    } else {
      errorHandler(error)
    }
    return Promise.reject(error)
  }
)

export default instance
