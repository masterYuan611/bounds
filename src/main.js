import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socket from '@/utils/socket'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@/assets/styles/reset.css'
import keepCache from '@/components/keepCache'
import nprogress from 'nprogress'
import '@/assets/styles/nprogress.css'

import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import '@/assets/styles/vxe-table.scss'
import '@/assets/styles/popup.scss'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'

import AutoComplete from '@/components/autoComplete'
import NameComplete from '@/components/nameComplete'
import BatchEditCode from '@/components/batchEditCode'
import quoter from '@/components/quoterInfo/index.js'
import Vconsole from 'vconsole'
import drag from '@/utils/drag'

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  new Vconsole()
  window.localStorage.setItem('vConsole_switch_y', 50)
}

Vue.use(VXETable)
VXETable.use(VXETablePluginAntd)

Vue.component(AutoComplete.name, AutoComplete)
Vue.component(NameComplete.name, NameComplete)
Vue.component(BatchEditCode.name, BatchEditCode)

Vue.config.productionTip = false

Vue.prototype.$socket = socket
Vue.prototype.$XEUtils = XEUtils
nprogress.configure({ speed: 1000, showSpinner: false })
Vue.prototype.$nprogress = nprogress

Vue.directive(drag)

Vue.use(Antd)
Vue.use(keepCache)
Vue.use(quoter)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
